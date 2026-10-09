import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';

export const ProjectsSprintBacklogView: React.FC = () => {
  const {
    tickets,
    selectedTicketKey,
    setSelectedTicketKey,
    triggerAgentRun,
    setPortal
  } = usePlatform();

  const [activeTab, setActiveTab] = useState<'all' | 'me' | 'ai'>('all');
  const [selectedPreset, setSelectedPreset] = useState('Refactor & optimize');
  const [modelTarget, setModelTarget] = useState('Claude 3.7 Sonnet');
  const [prPolicy, setPrPolicy] = useState('Auto-create Draft PR');
  const [promptText, setPromptText] = useState(
    `Task: Refactor the redisClient connection pool within internal/cache/redis.go.\n- Use the redigo pool configuration pattern.\n- Handle idle socket disconnects cleanly without dropping pending queries.\n- Add test coverage for connection reconnection failures.`
  );
  const [dryRunRunning, setDryRunRunning] = useState(false);

  const selectedTicket = tickets.find((t) => t.key === selectedTicketKey) || tickets[0];

  const totalTickets = tickets.length;
  const openCount = tickets.filter((t) => t.status === 'Open').length;
  const inProgressCount = tickets.filter((t) => t.status === 'In Progress').length;
  const prReadyCount = tickets.filter((t) => t.status === 'PR Ready').length;
  const completedCount = tickets.filter((t) => t.status === 'Completed').length;

  const handleLaunchAgent = (ticketKey: string) => {
    triggerAgentRun(ticketKey);
    setPortal('developer');
  };

  const handleDryRun = () => {
    setDryRunRunning(true);
    setTimeout(() => {
      setDryRunRunning(false);
      alert('Dry Run Simulation Succeeded: 0 AST syntax violations found. Ready for autonomous commit generation.');
    }, 1500);
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] w-full mx-auto">
      {/* Sprint Overview Summary Row */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white border border-[#c7c4d8]/80 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-[#565e74] uppercase tracking-wider">Total Tickets</div>
            <div className="text-2xl font-bold text-[#0b1c30] mt-0.5">{totalTickets}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#e5eeff] flex items-center justify-center text-[#3525cd]">
            <span className="material-symbols-outlined text-[20px]">receipt_long</span>
          </div>
        </div>

        <div className="bg-white border border-[#c7c4d8]/80 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-[#565e74] uppercase tracking-wider">Open Backlog</div>
            <div className="text-2xl font-bold text-[#0b1c30] mt-0.5">{openCount}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#e5eeff] flex items-center justify-center text-[#565e74]">
            <span className="material-symbols-outlined text-[20px]">inbox</span>
          </div>
        </div>

        <div className="bg-white border border-[#c7c4d8]/80 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-[#565e74] uppercase tracking-wider">In Progress</div>
            <div className="text-2xl font-bold text-[#3525cd] mt-0.5">{inProgressCount}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#e2dfff] flex items-center justify-center text-[#3525cd]">
            <span className="material-symbols-outlined text-[20px]">play_arrow</span>
          </div>
        </div>

        <div className="bg-white border border-[#c7c4d8]/80 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-[#565e74] uppercase tracking-wider">PR Ready / Review</div>
            <div className="text-2xl font-bold text-[#005338] mt-0.5">{prReadyCount}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">rule</span>
          </div>
        </div>

        <div className="bg-white border border-[#c7c4d8]/80 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-[#565e74] uppercase tracking-wider">Sprint Done</div>
            <div className="text-2xl font-bold text-[#006e4b] mt-0.5">{completedCount}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#6ffbbe]/30 flex items-center justify-center text-[#006e4b]">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
          </div>
        </div>
      </section>

      {/* Interactive 2-Panel Backlog Layout */}
      <section className="grid grid-cols-12 gap-6 items-start">
        {/* Left Panel: Ticket List (5 cols) */}
        <div className="col-span-12 lg:col-span-5 bg-white border border-[#c7c4d8]/80 rounded-xl shadow-sm flex flex-col h-[740px] overflow-hidden">
          {/* Header & Tabs */}
          <div className="p-4 border-b border-[#c7c4d8]/80 space-y-3 bg-[#f8f9ff]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-[#0b1c30]">Sprint Backlog</span>
                <span className="text-xs font-mono bg-[#e5eeff] text-[#565e74] px-2 py-0.5 rounded-full font-medium">
                  {tickets.length} Tickets
                </span>
              </div>
              <div className="text-xs text-[#3525cd] font-mono flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">filter_list</span>
                <span>Filters</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-[#eff4ff] p-1 rounded-lg text-xs font-mono">
              <button
                onClick={() => setActiveTab('all')}
                className={`flex-1 py-1 rounded text-center font-medium transition-colors ${
                  activeTab === 'all' ? 'bg-white text-[#3525cd] shadow-xs' : 'text-[#565e74]'
                }`}
              >
                All Tickets
              </button>
              <button
                onClick={() => setActiveTab('me')}
                className={`flex-1 py-1 rounded text-center transition-colors ${
                  activeTab === 'me' ? 'bg-white text-[#3525cd] shadow-xs' : 'text-[#565e74]'
                }`}
              >
                Assigned to Me
              </button>
              <button
                onClick={() => setActiveTab('ai')}
                className={`flex-1 py-1 rounded text-center transition-colors flex items-center justify-center gap-1 ${
                  activeTab === 'ai' ? 'bg-white text-[#3525cd] shadow-xs' : 'text-[#565e74]'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>AI Ready</span>
              </button>
            </div>
          </div>

          {/* Cards Scrollable Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
            {tickets.map((t) => {
              const isSelected = selectedTicketKey === t.key;
              return (
                <div
                  key={t.key}
                  onClick={() => setSelectedTicketKey(t.key)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-2 border-[#3525cd] bg-[#e2dfff]/20 shadow-xs'
                      : 'border-[#c7c4d8]/80 hover:border-[#777587] bg-white hover:bg-[#eff4ff]/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#3525cd] text-white">
                        {t.key}
                      </span>
                      <span
                        className={`text-xs font-mono px-2 py-0.5 rounded font-semibold ${
                          t.priority === 'High' || t.priority === 'Critical'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-[#dae2fd] text-[#131b2e]'
                        }`}
                      >
                        {t.priority}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[#565e74] text-xs font-mono">
                      <span className="material-symbols-outlined text-[14px]">timer</span>
                      <span>{t.points} pts (est. {t.estimatedHours})</span>
                    </div>
                  </div>

                  <h3 className="text-sm font-semibold text-[#0b1c30] mt-2 leading-snug">{t.title}</h3>
                  <p className="text-xs text-[#565e74] line-clamp-2 mt-1">{t.description}</p>

                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#c7c4d8]/40">
                    <div className="flex items-center gap-1.5 text-xs text-[#565e74] font-mono">
                      <span className="material-symbols-outlined text-[15px] text-emerald-600">
                        {t.status === 'Completed' ? 'check_box' : 'check_box_outline_blank'}
                      </span>
                      <span>
                        {t.completedCriteria}/{t.criteria.length} Criteria
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLaunchAgent(t.key);
                      }}
                      className="px-2.5 py-1 rounded bg-[#3525cd] hover:bg-[#4f46e5] text-white text-xs font-mono font-semibold flex items-center gap-1 shadow-xs cursor-pointer active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[14px]">smart_toy</span>
                      <span>Execute with AI</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Panel: Selected Ticket Quick-View & Trigger (7 cols) */}
        <div className="col-span-12 lg:col-span-7 bg-white border border-[#c7c4d8]/80 rounded-xl shadow-sm flex flex-col h-[740px] overflow-hidden">
          {/* Selected Ticket Header Strip */}
          <div className="p-4 border-b border-[#c7c4d8]/80 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[#3525cd] text-white">
                {selectedTicket.key}
              </span>
              <span className="text-base font-semibold text-[#0b1c30] truncate max-w-md">
                {selectedTicket.title}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#eff4ff] text-[#565e74] flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                <span>Open in Jira</span>
              </span>
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-[#dae2fd] text-[#131b2e] font-semibold">
                {selectedTicket.status}
              </span>
            </div>
          </div>

          {/* Body Content Area (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Auto-detected Repo Target */}
            <div className="bg-[#eff4ff] border border-[#c7c4d8]/60 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-white border border-[#c7c4d8] flex items-center justify-center text-[#0b1c30]">
                  <span className="material-symbols-outlined text-[18px]">source</span>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-[#565e74] uppercase tracking-wider">
                    Auto-detected Repository Target
                  </div>
                  <div className="font-mono text-xs text-[#0b1c30] font-semibold mt-0.5">
                    {selectedTicket.targetRepo} <span className="text-[#565e74] font-normal">(branch: {selectedTicket.branch})</span>
                  </div>
                </div>
              </div>
              <span className="text-xs font-mono text-[#005338] font-semibold bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1 border border-emerald-200">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                <span>Context Mapped</span>
              </span>
            </div>

            {/* Acceptance Criteria Checklist */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono font-semibold uppercase tracking-wider text-[#565e74]">
                  Acceptance Criteria
                </label>
                <span className="text-xs font-mono text-[#565e74]">{selectedTicket.criteria.length} defined</span>
              </div>
              <div className="space-y-2 bg-[#f8f9ff] rounded-lg p-3 border border-[#c7c4d8]/60">
                {selectedTicket.criteria.map((crit, idx) => (
                  <label key={idx} className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={idx < selectedTicket.completedCriteria}
                      className="mt-0.5 rounded text-[#3525cd] focus:ring-0 border-[#c7c4d8]"
                    />
                    <span className="text-xs text-[#0b1c30] leading-snug">{crit}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Agent Instructions & Directives */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-semibold uppercase tracking-wider text-[#565e74]">
                  Agent Instructions & Directives
                </label>
                <span className="text-xs font-mono text-[#565e74]">
                  Preset: <strong className="text-[#3525cd]">{selectedPreset}</strong>
                </span>
              </div>

              {/* Quick Presets */}
              <div className="flex items-center gap-2">
                {['Refactor & optimize', 'Generate unit tests', 'Fix bug & add regression test'].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setSelectedPreset(preset)}
                    className={`px-2.5 py-1 rounded text-xs font-mono cursor-pointer transition-colors ${
                      selectedPreset === preset
                        ? 'bg-[#e2dfff] text-[#3525cd] font-semibold border border-[#3525cd]/30'
                        : 'bg-white hover:bg-[#e5eeff] text-[#565e74] border border-[#c7c4d8]'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>

              {/* Textarea Prompt Area */}
              <div className="relative">
                <textarea
                  rows={4}
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder="Specific developer instructions for the autonomous agent..."
                  className="w-full text-xs font-mono text-[#0b1c30] bg-[#f8f9ff] border border-[#c7c4d8] rounded-lg p-3 focus:border-[#3525cd] focus:ring-1 focus:ring-[#3525cd]"
                />
              </div>
            </div>

            {/* Execution Parameter Mini-Grid */}
            <div className="grid grid-cols-3 gap-3 pt-1">
              <div className="p-2.5 rounded-lg border border-[#c7c4d8]/60 bg-[#f8f9ff]">
                <div className="text-[11px] font-mono text-[#565e74]">Model Target</div>
                <select
                  value={modelTarget}
                  onChange={(e) => setModelTarget(e.target.value)}
                  className="text-xs font-mono font-semibold text-[#0b1c30] mt-0.5 bg-transparent border-0 p-0 focus:ring-0 cursor-pointer w-full"
                >
                  <option>Claude 3.7 Sonnet</option>
                  <option>Claude 3.5 Sonnet</option>
                  <option>Gemini 2.5 Pro</option>
                </select>
              </div>

              <div className="p-2.5 rounded-lg border border-[#c7c4d8]/60 bg-[#f8f9ff]">
                <div className="text-[11px] font-mono text-[#565e74]">Pull Request Policy</div>
                <select
                  value={prPolicy}
                  onChange={(e) => setPrPolicy(e.target.value)}
                  className="text-xs font-mono font-semibold text-[#0b1c30] mt-0.5 bg-transparent border-0 p-0 focus:ring-0 cursor-pointer w-full"
                >
                  <option>Auto-create Draft PR</option>
                  <option>Open Direct PR</option>
                  <option>Commit to Feature Branch</option>
                </select>
              </div>

              <div className="p-2.5 rounded-lg border border-[#c7c4d8]/60 bg-[#f8f9ff]">
                <div className="text-[11px] font-mono text-[#565e74]">Target Environment</div>
                <div className="text-xs font-mono font-semibold text-[#0b1c30] mt-0.5">
                  staging-sandbox-01
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="p-4 border-t border-[#c7c4d8]/80 bg-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-mono text-[#565e74]">
                Agent Fleet: <strong className="text-[#0b1c30]">12 Idle Workers</strong>
              </span>
              <span className="text-[#777587]">·</span>
              <span className="text-xs font-mono text-[#565e74]">
                Est: <strong className="text-[#0b1c30]">~15s</strong>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleDryRun}
                disabled={dryRunRunning}
                className="px-3.5 py-2 rounded-lg border border-[#c7c4d8] hover:bg-[#eff4ff] text-[#0b1c30] text-xs font-mono transition-colors cursor-pointer"
              >
                {dryRunRunning ? 'Simulating...' : 'Dry Run Simulation'}
              </button>

              <button
                type="button"
                onClick={() => handleLaunchAgent(selectedTicket.key)}
                className="px-5 py-2 rounded-lg bg-[#3525cd] hover:bg-[#4f46e5] text-white text-xs font-mono font-semibold shadow-md flex items-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">rocket_launch</span>
                <span>Launch Autonomous Agent</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
