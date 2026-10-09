import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { usePlatform } from '../../context/PlatformContext';
import { ExecutionRun } from '../../types/platform';

export const DeveloperTraceLogs: React.FC = () => {
  const {
    executionRuns,
    executionPage,
    hasMoreExecutions,
    fetchExecutionHistory,
    selectedHistoryRunId,
    setSelectedHistoryRunId,
    approvePullRequest,
    triggerAgentRun,
    setDeveloperPage,
    executionMetrics,
    setSelectedTicketKey
  } = usePlatform();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [timeFilter, setTimeFilter] = useState<'today' | '7days' | 'custom'>('today');
  const [reviewNoteToast, setReviewNoteToast] = useState(false);

  const selectedRun: ExecutionRun =
    executionRuns.find((r) => r.id === selectedHistoryRunId) || executionRuns[0];

  const filteredRuns = executionRuns.filter((r) => {
    const matchesSearch =
      r.ticketKey.toLowerCase().includes(search.toLowerCase()) ||
      r.taskTitle.toLowerCase().includes(search.toLowerCase()) ||
      r.commitHash.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = () => {
    approvePullRequest(selectedRun.ticketKey);
    alert(`Pull Request for ${selectedRun.ticketKey} approved and merged into main branch!`);
  };

  const handleAddNote = () => {
    setReviewNoteToast(true);
    setTimeout(() => setReviewNoteToast(false), 2500);
  };

  const openRunDiff = (run: ExecutionRun) => {
    setSelectedHistoryRunId(run.id);
    setSelectedTicketKey(run.ticketKey);
    setDeveloperPage('diff-review');
  };

  const openRunTrace = (run: ExecutionRun) => {
    setSelectedHistoryRunId(run.id);
    setTimeout(() => {
      document.getElementById('trace-drawer')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const statusPillClass = (status: string) =>
    status === 'Completed'
      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
      : status === 'In Progress'
      ? 'bg-amber-50 text-amber-800 border border-amber-200'
      : 'bg-indigo-50 text-indigo-800 border border-indigo-200';



  return (
    <div className="flex-1 min-h-0 p-4 sm:p-6 lg:p-8 flex flex-col gap-4 sm:gap-6 max-w-[1600px] w-full mx-auto overflow-y-auto touch-scroll [&>*]:shrink-0">
      {/* Title Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0b1c30] tracking-tight">
            Execution History & LangGraph Trace Logs
          </h1>
          <p className="text-xs text-[#565e74] mt-1 font-mono leading-relaxed">
            Real-time autonomous pipeline executions, AST code changes, and LangSmith step telemetry.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const content = JSON.stringify(executionRuns, null, 2);
              const blob = new Blob([content], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `langgraph_execution_traces.json`;
              a.click();
            }}
            className="flex items-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-lg border border-[#c7c4d8] bg-white text-[#0b1c30] hover:bg-[#eff4ff] text-xs font-mono font-medium shadow-sm transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">file_download</span>
            <span>Export Logs</span>
          </button>
        </div>
      </div>

      {reviewNoteToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-lg flex items-center gap-2 font-mono">
          <span className="material-symbols-outlined text-emerald-600 text-[16px]">check_circle</span>
          <span>Review note attached to Jira ticket {selectedRun.ticketKey} and GitHub commit {selectedRun.commitHash}.</span>
        </div>
      )}

      {/* Summary Stats Bar (4 Metric Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1 */}
        <div className="p-3 sm:p-4 rounded-xl bg-white border border-[#c7c4d8]/60 shadow-sm flex items-center justify-between gap-2 min-w-0 hover:shadow-md transition-shadow">
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] sm:text-xs font-mono text-[#565e74] uppercase tracking-wider truncate">Total Runs Today</span>
            <div className="flex flex-wrap items-baseline gap-x-2 mt-1">
              <span className="text-2xl sm:text-3xl font-bold text-[#0b1c30] tracking-tight">{executionMetrics?.totalRunsToday || 0}</span>
              <span className="text-xs font-mono text-emerald-700 font-semibold flex items-center">
                <span className="material-symbols-outlined text-[14px]">trending_up</span> Live
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#777587] mt-1 truncate">Runs executed today</span>
          </div>
          <div className="hidden sm:flex w-10 h-10 shrink-0 rounded-lg bg-[#eff4ff] items-center justify-center text-[#3525cd]">
            <span className="material-symbols-outlined text-[22px]">schedule</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-3 sm:p-4 rounded-xl bg-white border border-[#c7c4d8]/60 shadow-sm flex items-center justify-between gap-2 min-w-0 hover:shadow-md transition-shadow">
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] sm:text-xs font-mono text-[#565e74] uppercase tracking-wider truncate">Success Rate</span>
            <div className="flex flex-wrap items-baseline gap-x-2 mt-1">
              <span className="text-2xl sm:text-3xl font-bold text-[#0b1c30] tracking-tight">{executionMetrics?.successRate || 0}%</span>
              <span className="text-xs font-mono text-emerald-700 font-semibold flex items-center">
                <span className="material-symbols-outlined text-[14px]">verified</span> Validated
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#777587] mt-1 truncate">{executionMetrics?.completedRuns || 0} passed</span>
          </div>
          <div className="hidden sm:flex w-10 h-10 shrink-0 rounded-lg bg-[#eff4ff] items-center justify-center text-emerald-700">
            <span className="material-symbols-outlined text-[22px]">verified</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-3 sm:p-4 rounded-xl bg-white border border-[#c7c4d8]/60 shadow-sm flex items-center justify-between gap-2 min-w-0 hover:shadow-md transition-shadow">
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] sm:text-xs font-mono text-[#565e74] uppercase tracking-wider truncate">Avg Agent Runtime</span>
            <div className="flex flex-wrap items-baseline gap-x-2 mt-1">
              <span className="text-2xl sm:text-3xl font-bold text-[#0b1c30] tracking-tight">{executionMetrics?.avgRuntimeSeconds || 0}s</span>
              <span className="text-xs font-mono text-[#565e74] font-medium flex items-center">
                <span className="material-symbols-outlined text-[14px]">speed</span> p90
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#777587] mt-1 truncate">Parallel graph recursion step</span>
          </div>
          <div className="hidden sm:flex w-10 h-10 shrink-0 rounded-lg bg-[#eff4ff] items-center justify-center text-[#4f46e5]">
            <span className="material-symbols-outlined text-[22px]">timelapse</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-3 sm:p-4 rounded-xl bg-white border border-[#c7c4d8]/60 shadow-sm flex items-center justify-between gap-2 min-w-0 hover:shadow-md transition-shadow">
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] sm:text-xs font-mono text-[#565e74] uppercase tracking-wider truncate">Tokens Consumed</span>
            <div className="flex flex-wrap items-baseline gap-x-2 mt-1">
              <span className="text-2xl sm:text-3xl font-bold text-[#0b1c30] tracking-tight">{executionMetrics?.tokensConsumed || 0}</span>
              <span className="text-xs font-mono text-[#777587] font-medium">tokens</span>
            </div>
            <span className="text-[11px] font-mono text-[#777587] mt-1 truncate">Total token usage today</span>
          </div>
          <div className="hidden sm:flex w-10 h-10 shrink-0 rounded-lg bg-[#eff4ff] items-center justify-center text-[#565e74]">
            <span className="material-symbols-outlined text-[22px]">memory</span>
          </div>
        </div>
      </div>

      {executionRuns.length === 0 || !selectedRun ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 sm:p-8 bg-[#f8f9ff] border border-[#c7c4d8]/60 rounded-xl shadow-sm mt-2 sm:mt-4 min-h-[280px] sm:min-h-[400px]">
          <div className="w-16 h-16 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#3525cd] mb-4">
            <span className="material-symbols-outlined text-[32px]">history</span>
          </div>
          <h2 className="text-xl font-bold text-[#0b1c30]">No Execution History Yet</h2>
          <p className="text-sm text-[#565e74] mt-2">Run an AI agent on a ticket to generate execution logs.</p>
        </div>
      ) : (
        <>
          {/* Filter Toolbar */}
          <div className="p-3 bg-white border border-[#c7c4d8]/60 rounded-xl shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0 sm:min-w-[280px]">
          <div className="relative w-full sm:w-auto sm:flex-1 sm:min-w-[200px] sm:max-w-sm">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[#777587] text-[16px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search by Jira ID (e.g. PROJ-108) or commit hash..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 sm:h-8 pl-8 pr-3 text-xs font-mono bg-[#eff4ff] border border-[#c7c4d8]/80 rounded-lg text-[#0b1c30] placeholder:text-[#777587] focus:outline-none focus:border-[#3525cd] focus:ring-2 focus:ring-[#3525cd]/15 transition-shadow"
            />
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 sm:h-8 pl-2.5 pr-8 text-xs font-mono bg-white border border-[#c7c4d8] rounded-lg text-[#0b1c30] focus:outline-none focus:border-[#3525cd] cursor-pointer"
            >
              <option value="All">Status: All Runs</option>
              <option value="Completed">Status: Completed</option>
              <option value="In Progress">Status: In Progress</option>
              <option value="Needs Review">Status: Needs Review</option>
            </select>
          </div>

          <div className="flex items-center h-9 sm:h-8 bg-[#eff4ff] border border-[#c7c4d8]/80 rounded-lg p-0.5 text-xs font-mono">
            <button
              onClick={() => setTimeFilter('today')}
              className={`px-2.5 py-1 h-full rounded whitespace-nowrap transition-colors ${
                timeFilter === 'today' ? 'bg-white text-[#0b1c30] font-semibold shadow-xs' : 'text-[#565e74]'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setTimeFilter('7days')}
              className={`px-2.5 py-1 h-full rounded whitespace-nowrap transition-colors ${
                timeFilter === '7days' ? 'bg-white text-[#0b1c30] font-semibold shadow-xs' : 'text-[#565e74]'
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setTimeFilter('custom')}
              className={`px-2.5 py-1 h-full rounded whitespace-nowrap transition-colors ${
                timeFilter === 'custom' ? 'bg-white text-[#0b1c30] font-semibold shadow-xs' : 'text-[#565e74]'
              }`}
            >
              Custom
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#777587]">
          <span>Showing {filteredRuns.length} of {executionRuns.length} runs</span>
          <button
            onClick={() => {
              setSearch('');
              setStatusFilter('All');
            }}
            className="p-1.5 rounded-lg border border-[#c7c4d8] hover:bg-[#eff4ff] text-[#565e74] transition-colors cursor-pointer"
            title="Refresh Feed"
          >
            <span className="material-symbols-outlined text-[16px]">refresh</span>
          </button>
        </div>
      </div>

      {/* Execution Runs - stacked cards on phones */}
      <div className="md:hidden flex flex-col gap-2.5">
        {filteredRuns.map((run) => {
          const isSelected = selectedRun.id === run.id;
          return (
            <article
              key={run.id}
              onClick={() => setSelectedHistoryRunId(run.id)}
              className={`p-3.5 rounded-xl border bg-white shadow-sm transition-colors cursor-pointer ${
                isSelected ? 'border-[#3525cd] ring-2 ring-[#3525cd]/10' : 'border-[#c7c4d8]/60 active:bg-[#eff4ff]/40'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <span className="inline-block px-2 py-0.5 bg-[#eff4ff] text-[#3525cd] font-mono text-[11px] font-bold rounded border border-[#c7c4d8]/60">
                    {run.ticketKey}
                  </span>
                  <h3 className="mt-1.5 text-[13px] font-semibold text-[#0b1c30] leading-snug break-words">{run.taskTitle}</h3>
                </div>
                <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold ${statusPillClass(run.status)}`}>
                  {run.status}
                </span>
              </div>

              <div className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px] font-mono">
                <div className="min-w-0">
                  <div className="text-[#777587]">Commit</div>
                  <div className="text-[#3525cd] font-semibold truncate">{run.commitHash}</div>
                </div>
                <div className="min-w-0">
                  <div className="text-[#777587]">Branch</div>
                  <div className="text-[#0b1c30] truncate">{run.branch}</div>
                </div>
                <div className="min-w-0">
                  <div className="text-[#777587]">Model</div>
                  <div className="text-[#0b1c30] truncate">{run.model}</div>
                </div>
                <div className="min-w-0">
                  <div className="text-[#777587]">Duration</div>
                  <div className="text-[#0b1c30] font-semibold">{run.duration} <span className="font-normal text-[#777587]">· {run.stepsCount} steps</span></div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-[#c7c4d8]/40 flex items-center justify-between gap-2">
                <span className="text-[11px] text-[#777587] font-mono truncate">{run.assignedTo} • {run.timeAgo}</span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); openRunDiff(run); }}
                    className="h-8 px-2.5 rounded-lg bg-white border border-[#c7c4d8] hover:bg-[#eff4ff] text-[#3525cd] flex items-center gap-1 text-[11px] font-mono font-semibold"
                  >
                    <span className="material-symbols-outlined text-[14px]">difference</span>
                    <span>Diff</span>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); openRunTrace(run); }}
                    className="h-8 px-2.5 rounded-lg bg-[#213145] text-white hover:bg-[#0b1c30] flex items-center gap-1 text-[11px] font-mono font-semibold"
                  >
                    <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    <span>Trace</span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
        {hasMoreExecutions && (
          <button
            onClick={() => fetchExecutionHistory(executionPage + 1)}
            className="w-full h-10 rounded-lg bg-white border border-[#3525cd] text-[#3525cd] hover:bg-[#eff4ff] font-mono text-[11px] font-semibold transition-colors shadow-sm"
          >
            Load More Executions
          </button>
        )}
      </div>

      {/* Execution Runs Data Table (tablet & desktop) */}
      <div className="hidden md:flex shrink-0 bg-white border border-[#c7c4d8]/60 rounded-xl shadow-sm flex-col max-h-[480px] overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto touch-scroll flex-1 min-h-0 relative">
          <table className="w-full min-w-[920px] text-left border-collapse">
            <thead className="sticky top-0 bg-[#f5f8ff] z-10 shadow-[0_1px_0_rgba(199,196,216,0.6)]">
              <tr className="bg-[#eff4ff]/70 border-b border-[#c7c4d8]/60 text-[11px] font-mono text-[#565e74] uppercase tracking-wide h-10 [&>th]:whitespace-nowrap">
                <th className="py-2 px-4 font-semibold w-[32%] min-w-[280px]">Jira Ticket & Task</th>
                <th className="py-2 px-3 font-semibold">Commit & Branch</th>
                <th className="py-2 px-3 font-semibold">Agent Model</th>
                <th className="py-2 px-3 font-semibold">Execution Phase</th>
                <th className="py-2 px-3 font-semibold text-right">Duration</th>
                <th className="py-2 px-4 font-semibold text-center">Status</th>
                <th className="py-2 px-4 font-semibold text-right sticky right-0 z-10 bg-[#f5f8ff] shadow-[-8px_0_12px_-10px_rgba(11,28,48,0.25)]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c7c4d8]/30 text-xs font-mono">
              {filteredRuns.map((run) => {
                const isSelected = selectedRun.id === run.id;
                return (
                  <tr
                    key={run.id}
                    onClick={() => setSelectedHistoryRunId(run.id)}
                    className={`transition-colors cursor-pointer ${
                      isSelected ? 'bg-[#e2dfff]/20 hover:bg-[#e2dfff]/30' : 'hover:bg-[#eff4ff]/40'
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-start gap-2">
                        <span className="px-2 py-0.5 bg-[#eff4ff] text-[#3525cd] font-mono font-bold rounded border border-[#c7c4d8]/60 whitespace-nowrap shrink-0">
                          {run.ticketKey}
                        </span>
                        <span className="font-semibold text-[#0b1c30] font-sans line-clamp-2">{run.taskTitle}</span>
                      </div>
                      <div className="text-[11px] text-[#777587] mt-0.5 pl-0.5">
                        Assigned to: {run.assignedTo} • {run.timeAgo}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5 text-[#3525cd] font-semibold">
                        <span className="material-symbols-outlined text-[14px]">commit</span>
                        <span>{run.commitHash}</span>
                      </div>
                      <div className="text-[11px] text-[#565e74] truncate max-w-[130px]">{run.branch}</div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#4f46e5]"></span>
                        <span className="font-medium text-[#0b1c30] whitespace-nowrap">{run.model}</span>
                      </div>
                      <div className="text-[10px] text-[#777587]">Temp 0.2 • LangGraph v0.2.4</div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#eff4ff] text-[#0b1c30]">
                        <span className="material-symbols-outlined text-[13px] text-emerald-600">fact_check</span>
                        <span className="whitespace-nowrap">{run.phase}</span>
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <span className="font-semibold text-[#0b1c30]">{run.duration}</span>
                      <div className="text-[10px] text-[#777587]">{run.stepsCount} steps</div>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold whitespace-nowrap ${
                          run.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : run.status === 'In Progress'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                        }`}
                      >
                        {run.status}
                      </span>
                    </td>

                    <td className={`py-3 px-4 text-right sticky right-0 shadow-[-8px_0_12px_-10px_rgba(11,28,48,0.25)] ${isSelected ? 'bg-[#f8f7ff]' : 'bg-white'}`}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedHistoryRunId(run.id);
                            setSelectedTicketKey(run.ticketKey);
                            setDeveloperPage('diff-review');
                          }}
                          className="px-2 py-1 rounded bg-white border border-[#c7c4d8] hover:bg-[#eff4ff] text-[#3525cd] flex items-center gap-1 shadow-2xs font-semibold cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[13px]">difference</span>
                          <span>Diff</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedHistoryRunId(run.id);
                            setTimeout(() => {
                              document.getElementById('trace-drawer')?.scrollIntoView({ behavior: 'smooth' });
                            }, 50);
                          }}
                          className="px-2 py-1 rounded bg-[#213145] text-white hover:bg-[#0b1c30] flex items-center gap-1 shadow-2xs font-semibold cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                          <span>Trace</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {hasMoreExecutions && (
            <div className="flex justify-center p-4 border-t border-[#c7c4d8]/60 bg-[#f8f9ff]">
              <button
                onClick={() => fetchExecutionHistory(executionPage + 1)}
                className="px-4 py-2 rounded-lg bg-white border border-[#3525cd] text-[#3525cd] hover:bg-[#eff4ff] font-mono text-[11px] font-semibold transition-colors shadow-sm"
              >
                Load More Executions
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Lower Inspection Drawer / Trace Summary (Selected Run) */}
      <section id="trace-drawer" className="rounded-xl border border-[#c7c4d8]/80 bg-white shadow-sm overflow-hidden flex flex-col">
        {/* Inspection Drawer Header */}
        <div className="px-4 sm:px-6 py-3 bg-[#eff4ff] border-b border-[#c7c4d8]/60 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3 min-w-0">
            <span className="material-symbols-outlined text-[#3525cd] text-[20px] shrink-0">account_tree</span>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 min-w-0">
              <span className="text-sm font-bold text-[#0b1c30] break-all sm:break-normal">
                LangGraph Execution Trace: Run #{selectedRun.id}
              </span>
              <span className="px-2 py-0.5 bg-[#e2dfff] text-[#3525cd] font-mono text-xs font-bold rounded">
                {selectedRun.ticketKey}
              </span>
              <span className="text-xs text-[#777587] font-mono break-all">
                Branch: {selectedRun.branch} (Commit: {selectedRun.commitHash})
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono">
            <span className="text-[#565e74]">
              Execution Latency: <strong className="text-[#0b1c30]">{selectedRun.duration}</strong>
            </span>
            <span className="text-[#c7c4d8]">|</span>
            <span className="text-[#565e74]">
              Token Usage: <strong className="text-[#0b1c30]">{selectedRun.tokenUsage}</strong>
            </span>
          </div>
        </div>

        {/* Content Split: Steps vs Generated Files */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#c7c4d8]/60">
          {/* Column 1: Step Timings & Graph Nodes (8 Cols) */}
          <div className="lg:col-span-8 p-4 sm:p-6 flex flex-col gap-4 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono text-[#565e74] uppercase tracking-wider font-semibold">
                  Graph Step Nodes & Latency Breakdown
                </span>
                <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded font-semibold">
                  All {(selectedRun.stepBreakdown || []).length} Nodes Succeeded
                </span>
              </div>
              <span className="text-xs font-mono text-[#777587]">
                State Model: langgraph.prebuilt.ToolExecutor
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {(selectedRun.stepBreakdown?.length > 0 ? selectedRun.stepBreakdown : [
                { name: 'analyze', latency: '1.2s', tokens: '150 tokens', detail: 'Analyzed Jira ticket requirements and existing AST structure.' },
                { name: 'generate', latency: '4.5s', tokens: '850 tokens', detail: 'Generated code changes for the requested feature.' },
                { name: 'review', latency: '2.1s', tokens: '300 tokens', detail: 'Automated review completed successfully.' }
              ]).map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-lg bg-[#eff4ff]/50 border border-[#c7c4d8]/50"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[14px]">check</span>
                  </div>
                  <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-x-2 text-xs font-mono">
                      <span className="font-semibold text-[#0b1c30]">{step.name}</span>
                      <span className="text-[#565e74]">
                        {step.latency} • {step.tokens}
                      </span>
                    </div>
                    <p className="text-xs text-[#565e74] mt-0.5 font-sans">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Modified Files & Terminal Stdout (4 Cols) */}
          <div className="lg:col-span-4 p-4 sm:p-6 flex flex-col gap-4 bg-[#f8f9ff] min-w-0">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#565e74] uppercase tracking-wider font-semibold">
                Generated Files ({(selectedRun.files || []).length})
              </span>
              <span className="text-emerald-700 font-semibold">
                +{selectedRun.addedLines || 0} / -{selectedRun.deletedLines || 0} lines
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {(selectedRun.files?.length > 0 ? selectedRun.files : [
                { name: 'src/components/App.tsx', added: 12, deleted: 2, description: 'Updated component logic' }
              ]).map((file, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg border border-[#c7c4d8]/60 bg-white"
                >
                  <div className="flex items-center justify-between gap-2 text-xs font-mono">
                    <span className="text-[#3525cd] font-semibold truncate min-w-0" title={file.name}>{file.name}</span>
                    <span className="text-emerald-700 font-semibold text-[11px] shrink-0">
                      +{file.added} / -{file.deleted}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#565e74] mt-1 font-sans">{file.description}</div>
                </div>
              ))}
            </div>

            {/* Terminal Output Preview */}
            <div className="mt-2 flex flex-col gap-1.5">
              <span className="text-xs font-mono text-[#565e74] uppercase tracking-wider font-semibold">
                Live Sandbox stdout
              </span>
              <div className="p-3 rounded-lg bg-[#213145] text-white font-mono text-[11px] leading-relaxed overflow-x-auto border border-[#3f465c]/40 space-y-1">
                {(selectedRun.sandboxStdout?.length > 0 ? selectedRun.sandboxStdout : [
                  '> jest __tests__/visitor.spec.ts',
                  '✓ compiles ast syntax tree successfully (142 ms)',
                  '✓ recursively visits nodes without O(N^2) memory blowout (88 ms)',
                  '✨  Done in 2.30s.'
                ]).map((line, idx) => (
                  <div key={idx} className={line.startsWith('✓') ? 'text-emerald-400' : line.startsWith('✨') ? 'text-yellow-300' : 'text-slate-300'}>
                    {line}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-auto pt-2 flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch justify-between gap-2">
              <button
                onClick={handleAddNote}
                className="flex-1 py-2 sm:py-1.5 px-3 rounded-lg border border-[#c7c4d8] bg-white text-[#0b1c30] hover:bg-[#eff4ff] text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">chat_bubble_outline</span>
                <span>Add Review Note</span>
              </button>
              <button
                onClick={handleApprove}
                className="flex-1 py-2 sm:py-1.5 px-3 rounded-lg bg-[#3525cd] text-white hover:bg-[#4f46e5] text-xs font-mono font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">merge</span>
                <span>Approve PR</span>
              </button>
            </div>
          </div>
        </div>
      </section>
        </>
      )}
    </div>
  );
};
