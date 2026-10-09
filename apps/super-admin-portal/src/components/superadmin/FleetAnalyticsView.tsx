import React, { useState, useEffect } from 'react';
import { usePlatform } from '../../context/PlatformContext';

export const FleetAnalyticsView: React.FC = () => {
  const { companies, activeAgentsCount } = usePlatform();

  // Simulated live feed of agent runs
  const [liveRuns, setLiveRuns] = useState([
    {
      id: 'run-1',
      time: '14:32:04 UTC',
      company: 'TechCorp Inc.',
      task: 'fix(auth): regenerate stale JWT verification session',
      status: 'Running' as const
    },
    {
      id: 'run-2',
      time: '14:31:49 UTC',
      company: 'InnoSoft',
      task: 'feat(billing): integrate stripe webhook retry logic',
      status: 'Completed' as const
    },
    {
      id: 'run-3',
      time: '14:31:12 UTC',
      company: 'CloudScale',
      task: 'refactor(schema): partition postgres telemetry records',
      status: 'Running' as const
    },
    {
      id: 'run-4',
      time: '14:30:58 UTC',
      company: 'DevStudio',
      task: 'test(e2e): stabilize cypress checkout flakiness',
      status: 'Completed' as const
    }
  ]);

  // Minor tick effect to feel real and live
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const timeStr = `${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')}:${String(now.getUTCSeconds()).padStart(2, '0')} UTC`;
      const randomTenant = companies[Math.floor(Math.random() * companies.length)]?.name || 'TechCorp Inc.';
      const sampleTasks = [
        'chore(deps): bump @google/genai to 2.4.0 in worker sandbox',
        'refactor(cache): rotate redis connection pool credentials',
        'fix(ci): sanitize git diff headers on automated PR',
        'feat(jira): sync webhook acceptance criteria state'
      ];
      const randomTask = sampleTasks[Math.floor(Math.random() * sampleTasks.length)];

      setLiveRuns(prev => [
        {
          id: `run-${Date.now()}`,
          time: timeStr,
          company: randomTenant,
          task: randomTask,
          status: Math.random() > 0.4 ? 'Running' : 'Completed'
        },
        ...prev.slice(0, 4)
      ]);
    }, 4500);

    return () => clearInterval(timer);
  }, [companies]);

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col gap-5 sm:gap-6 max-w-7xl w-full mx-auto">
      {/* Screen Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-[#0b1c30] tracking-tight">
          Fleet Analytics & System Telemetry
        </h1>
        <p className="text-sm text-[#565e74]">
          Real-time overview of agent runs, token utilization, and infrastructure health across all active enterprise tenants.
        </p>
      </div>

      {/* 4 Key Stat Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Agent Runs */}
        <div className="bg-white border border-[#c7c4d8]/60 rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#565e74]">
            <span className="text-xs font-mono">Total Agent Runs</span>
            <span className="material-symbols-outlined text-[18px]">bolt</span>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-[#0b1c30]">142,850</div>
            <div className="flex items-center gap-1.5 mt-1 text-xs font-mono text-emerald-700">
              <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
              <span className="font-semibold">+28%</span>
              <span className="text-[#565e74] font-sans">this week</span>
            </div>
          </div>
        </div>

        {/* Active Concurrent Agents */}
        <div className="bg-white border border-[#c7c4d8]/60 rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#565e74]">
            <span className="text-xs font-mono">Active Concurrent Agents</span>
            <span className="material-symbols-outlined text-[18px]">smart_toy</span>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-[#0b1c30] flex items-baseline gap-2">
              {activeAgentsCount}
              <span className="text-xs font-mono text-[#3525cd] font-semibold">Running</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs font-mono text-[#565e74]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4f46e5] animate-pulse"></span>
              <span>85% cluster capacity</span>
            </div>
          </div>
        </div>

        {/* Total Token Usage */}
        <div className="bg-white border border-[#c7c4d8]/60 rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#565e74]">
            <span className="text-xs font-mono">Total Token Usage</span>
            <span className="material-symbols-outlined text-[18px]">data_usage</span>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-[#0b1c30]">84.6M</div>
            <div className="flex items-center gap-1.5 mt-1 text-xs font-mono text-[#565e74]">
              <span className="text-[#0b1c30] font-semibold">$1,692</span>
              <span>estimated cost</span>
            </div>
          </div>
        </div>

        {/* Auto-Merge PR Success */}
        <div className="bg-white border border-[#c7c4d8]/60 rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#565e74]">
            <span className="text-xs font-mono">Auto-Merge PR Success</span>
            <span className="material-symbols-outlined text-[18px]">merge</span>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-[#0b1c30]">94.2%</div>
            <div className="flex items-center gap-1.5 mt-1 text-xs font-mono text-[#565e74]">
              <span>Avg latency</span>
              <span className="text-[#0b1c30] font-semibold">18.4s</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Cards (2-Column Layout) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Agent Execution Activity */}
        <div className="bg-white border border-[#c7c4d8]/60 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#e5eeff]">
            <div>
              <h2 className="text-sm font-semibold text-[#0b1c30]">Agent Execution Activity</h2>
              <p className="text-xs text-[#565e74]">Daily completed and validated tasks over the past 7 days</p>
            </div>
            <span className="text-xs font-mono font-semibold text-[#3525cd] bg-[#e5eeff] px-2 py-0.5 rounded">
              Past 7 Days
            </span>
          </div>

          {/* Visual Bar Chart */}
          <div className="pt-6 pb-2 flex items-end justify-between gap-4 h-56 px-2">
            {[
              { day: 'Mon', count: '16.2k', height: '54%', active: false },
              { day: 'Tue', count: '18.4k', height: '62%', active: false },
              { day: 'Wed', count: '21.8k', height: '76%', active: false },
              { day: 'Thu', count: '24.5k', height: '86%', active: false },
              { day: 'Fri', count: '28.1k', height: '98%', active: true },
              { day: 'Sat', count: '17.6k', height: '58%', active: false },
              { day: 'Sun', count: '16.2k', height: '52%', active: false }
            ].map((col) => (
              <div key={col.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer">
                <span
                  className={`text-[11px] font-mono transition-opacity ${
                    col.active ? 'text-[#3525cd] font-bold opacity-100' : 'text-[#777587] opacity-0 group-hover:opacity-100'
                  }`}
                >
                  {col.count}
                </span>
                <div
                  className={`w-full max-w-[40px] rounded-t transition-colors ${
                    col.active ? 'bg-[#3525cd]' : 'bg-[#dae2fd] group-hover:bg-[#4f46e5]'
                  }`}
                  style={{ height: col.height }}
                ></div>
                <span
                  className={`text-xs font-mono ${
                    col.active ? 'text-[#3525cd] font-bold' : 'text-[#565e74]'
                  }`}
                >
                  {col.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Top Tenant Resource Consumers */}
        <div className="bg-white border border-[#c7c4d8]/60 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#e5eeff]">
            <div>
              <h2 className="text-sm font-semibold text-[#0b1c30]">Top Tenant Resource Consumers</h2>
              <p className="text-xs text-[#565e74]">Execution volume by assigned enterprise plan quotas</p>
            </div>
            <span className="text-xs font-mono text-[#3525cd]">View Matrix</span>
          </div>

          <div className="flex flex-col gap-4 mt-4">
            {/* TechCorp */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#0b1c30]">TechCorp Inc.</span>
                  <span className="text-[11px] font-mono text-[#565e74] bg-[#eff4ff] px-1.5 py-0.5 rounded border border-[#c7c4d8]/40">
                    20 Dev Plan
                  </span>
                </div>
                <span className="font-mono font-medium text-[#0b1c30]">38,400 runs</span>
              </div>
              <div className="w-full bg-[#eff4ff] h-2 rounded-full overflow-hidden">
                <div className="bg-[#3525cd] h-full rounded-full" style={{ width: '82%' }}></div>
              </div>
            </div>

            {/* InnoSoft */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#0b1c30]">InnoSoft</span>
                  <span className="text-[11px] font-mono text-[#565e74] bg-[#eff4ff] px-1.5 py-0.5 rounded border border-[#c7c4d8]/40">
                    50 Dev Plan
                  </span>
                </div>
                <span className="font-mono font-medium text-[#0b1c30]">24,100 runs</span>
              </div>
              <div className="w-full bg-[#eff4ff] h-2 rounded-full overflow-hidden">
                <div className="bg-[#4f46e5] h-full rounded-full" style={{ width: '54%' }}></div>
              </div>
            </div>

            {/* CloudScale */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#0b1c30]">CloudScale</span>
                  <span className="text-[11px] font-mono text-[#565e74] bg-[#eff4ff] px-1.5 py-0.5 rounded border border-[#c7c4d8]/40">
                    Enterprise 100
                  </span>
                </div>
                <span className="font-mono font-medium text-[#0b1c30]">18,900 runs</span>
              </div>
              <div className="w-full bg-[#eff4ff] h-2 rounded-full overflow-hidden">
                <div className="bg-[#4f46e5] h-full rounded-full" style={{ width: '42%' }}></div>
              </div>
            </div>

            {/* DevStudio */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#0b1c30]">DevStudio</span>
                  <span className="text-[11px] font-mono text-[#ba1a1a] bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                    Quota Warning
                  </span>
                </div>
                <span className="font-mono font-medium text-[#0b1c30]">14,200 runs</span>
              </div>
              <div className="w-full bg-[#eff4ff] h-2 rounded-full overflow-hidden">
                <div className="bg-[#ba1a1a] h-full rounded-full" style={{ width: '94%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Card: Live Agent Activity Table */}
      <section className="bg-white border border-[#c7c4d8]/60 rounded-xl shadow-sm overflow-hidden mb-6">
        <div className="p-4 flex items-center justify-between border-b border-[#e5eeff]">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-[#0b1c30]">Live Agent Activity</h2>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          </div>
          <span className="text-xs font-mono text-[#565e74]">Auto-refreshing (every 3s)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] md:min-w-0 text-left border-collapse">
            <thead>
              <tr className="bg-[#eff4ff]/60 border-b border-[#c7c4d8]/40 text-[11px] font-mono text-[#565e74] uppercase">
                <th className="py-2.5 px-4 font-semibold">Timestamp</th>
                <th className="py-2.5 px-4 font-semibold">Company</th>
                <th className="py-2.5 px-4 font-semibold">Agent Task</th>
                <th className="py-2.5 px-4 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5eeff] text-xs">
              {liveRuns.map((item) => (
                <tr key={item.id} className="hover:bg-[#f8f9ff] transition-colors">
                  <td className="py-3 px-4 font-mono text-[#565e74]">{item.time}</td>
                  <td className="py-3 px-4 font-semibold text-[#0b1c30]">{item.company}</td>
                  <td className="py-3 px-4 font-mono text-[#0b1c30]">{item.task}</td>
                  <td className="py-3 px-4 text-right">
                    {item.status === 'Running' ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono bg-[#d3e4fe] text-[#3525cd]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#3525cd] animate-pulse"></span>
                        Running
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <span className="material-symbols-outlined text-[14px]">check</span>
                        Completed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
