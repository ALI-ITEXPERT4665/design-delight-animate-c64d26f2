import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis, RadialBar, RadialBarChart, PolarAngleAxis,
} from "recharts";
import { getChatbotStats, type ChatbotStats } from "@/lib/admin/chatbot-analytics.functions";

export const Route = createFileRoute("/_authenticated/admin/analytics")({
  component: AnalyticsPage,
});

function useCountUp(target: number, duration = 900) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf = 0; const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setVal(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

function StatCard({
  label, value, sub, accent = "amber", format = "int",
}: { label: string; value: number; sub?: string; accent?: "amber" | "emerald" | "sky" | "rose"; format?: "int" | "dec" | "credits" }) {
  const v = useCountUp(value);
  const display =
    format === "credits" ? v.toFixed(4)
    : format === "dec" ? v.toFixed(2)
    : Math.round(v).toLocaleString();
  const ring = {
    amber: "from-amber-500/30 to-amber-500/0 text-amber-600",
    emerald: "from-emerald-500/30 to-emerald-500/0 text-emerald-600",
    sky: "from-sky-500/30 to-sky-500/0 text-sky-600",
    rose: "from-rose-500/30 to-rose-500/0 text-rose-600",
  }[accent];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, boxShadow: "0 20px 40px -20px rgba(0,0,0,0.25)" }}
      transition={{ type: "spring", stiffness: 200, damping: 22 }}
      className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5"
    >
      <div className={`absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-br ${ring} blur-2xl`} />
      <div className="relative">
        <div className="text-[10px] uppercase tracking-[0.25em] text-neutral-500">{label}</div>
        <div className="mt-2 text-3xl font-semibold text-neutral-900 tabular-nums">{display}</div>
        {sub && <div className="mt-1 text-xs text-neutral-500">{sub}</div>}
      </div>
    </motion.div>
  );
}

const G = {
  amber: "#d97706", emerald: "#059669", sky: "#0284c7", neutral: "#171717",
};

function AnalyticsPage() {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["chatbot-stats"],
    queryFn: () => getChatbotStats(),
    refetchInterval: 15_000,
    staleTime: 10_000,
  });

  if (isLoading || !data) {
    return <div className="p-8 text-sm text-neutral-500">Loading live analytics…</div>;
  }
  const s: ChatbotStats = data;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="text-[11px] tracking-[0.4em] uppercase text-amber-600">Live · Uppal Concierge</div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-semibold text-neutral-900">Chatbot Analytics</h1>
          <p className="mt-1 text-sm text-neutral-500">Realtime AI Gateway usage, credit burn, and predictive capacity.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-700 border border-emerald-200">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            {isFetching ? "Refreshing" : "Live · 15s"}
          </span>
          <button onClick={() => refetch()} className="rounded-md border border-neutral-300 px-3 py-1.5 text-xs hover:bg-neutral-50">Refresh</button>
        </div>
      </div>

      {/* Top stat grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Requests · Today" value={s.totals.today} accent="amber" />
        <StatCard label="Requests · This Month" value={s.totals.month} accent="sky" />
        <StatCard label="Requests · This Year" value={s.totals.year} accent="emerald" />
        <StatCard label="Requests · All-Time" value={s.totals.allTime} accent="rose" />
        <StatCard label="Credits Burned Today" value={s.totals.creditsToday} accent="amber" format="credits" />
        <StatCard label="Credits · Month" value={s.totals.creditsMonth} accent="sky" format="credits" />
        <StatCard label="Credits · Year" value={s.totals.creditsYear} accent="emerald" format="credits" />
        <StatCard label="Credits · All-Time" value={s.totals.creditsAllTime} accent="rose" format="credits" />
      </div>

      {/* Trend + burn chart */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-neutral-200 bg-white p-5"
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-xs uppercase tracking-widest text-neutral-500">Last 30 Days</div>
            <div className="text-lg font-semibold text-neutral-900">Requests & Credit Burn</div>
          </div>
          <div className="text-xs text-neutral-500">Avg burn/day · <span className="font-semibold text-neutral-900">{s.forecast.burnPerDay.toFixed(4)} cr</span></div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={s.daily}>
              <defs>
                <linearGradient id="gReq" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={G.amber} stopOpacity={0.5} />
                  <stop offset="100%" stopColor={G.amber} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gCr" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={G.sky} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={G.sky} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="date" tickFormatter={(d) => d.slice(5)} fontSize={11} stroke="#999" />
              <YAxis yAxisId="l" fontSize={11} stroke="#999" />
              <YAxis yAxisId="r" orientation="right" fontSize={11} stroke="#999" />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eee", fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area yAxisId="l" type="monotone" dataKey="requests" name="Requests" stroke={G.amber} fill="url(#gReq)" strokeWidth={2} isAnimationActive animationDuration={900} />
              <Area yAxisId="r" type="monotone" dataKey="credits" name="Credits" stroke={G.sky} fill="url(#gCr)" strokeWidth={2} isAnimationActive animationDuration={900} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Forecast + hourly */}
      <div className="grid lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 rounded-2xl border border-neutral-200 bg-gradient-to-br from-neutral-900 to-neutral-800 text-white p-5">
          <div className="text-[10px] uppercase tracking-[0.3em] text-amber-400">Predictive Capacity</div>
          <div className="mt-2 text-lg font-semibold">User Forecast</div>
          <p className="mt-1 text-xs text-white/60">
            Based on {s.totals.avgMsgsPerSession.toFixed(1)} msgs/session · {s.totals.avgCreditsPerMsg.toFixed(6)} credits/msg
          </p>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <ForecastCell label="Daily" value={s.forecast.usersRemainingDaily} />
            <ForecastCell label="Monthly" value={s.forecast.usersRemainingMonthly} />
            <ForecastCell label="Yearly" value={s.forecast.usersRemainingYearly} />
          </div>
          <div className="mt-4 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart innerRadius="55%" outerRadius="100%" data={[{
                name: "burn", value: Math.min(100, (s.totals.creditsAllTime / (s.creditsBalance ?? 2500)) * 100),
                fill: "#f59e0b",
              }]} startAngle={220} endAngle={-40}>
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar background={{ fill: "rgba(255,255,255,0.08)" }} dataKey="value" cornerRadius={20} isAnimationActive animationDuration={1200} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center -mt-32 relative pointer-events-none">
            <div className="text-3xl font-semibold tabular-nums">{s.totals.creditsAllTime.toFixed(2)}</div>
            <div className="text-[10px] uppercase tracking-widest text-white/60">of {(s.creditsBalance ?? 2500).toLocaleString()} cr</div>
          </div>
          <div className="mt-24 text-xs text-white/70">
            {s.forecast.daysRemaining !== null
              ? <>~<span className="font-semibold text-amber-300">{s.forecast.daysRemaining}</span> days runway at current burn</>
              : <>Insufficient data for runway forecast</>}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-2 rounded-2xl border border-neutral-200 bg-white p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-xs uppercase tracking-widest text-neutral-500">Peak Hours</div>
              <div className="text-lg font-semibold text-neutral-900">Requests by Hour of Day</div>
            </div>
            <div className="text-xs text-neutral-500">{s.totals.sessionsAllTime.toLocaleString()} sessions · avg {s.totals.avgMsgsPerSession.toFixed(2)} msgs</div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={s.hourly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="hour" fontSize={11} stroke="#999" tickFormatter={(h) => `${h}:00`} />
                <YAxis fontSize={11} stroke="#999" />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eee", fontSize: 12 }} labelFormatter={(h) => `${h}:00`} />
                <Bar dataKey="requests" radius={[8,8,0,0]} isAnimationActive animationDuration={900}>
                  {s.hourly.map((h, i) => {
                    const max = Math.max(...s.hourly.map((x) => x.requests), 1);
                    const intensity = h.requests / max;
                    const color = `hsl(${35 - intensity * 20}, 90%, ${65 - intensity * 25}%)`;
                    return <Cell key={i} fill={color} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Monthly + top days */}
      <div className="grid lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 rounded-2xl border border-neutral-200 bg-white p-5">
          <div className="text-xs uppercase tracking-widest text-neutral-500">Monthly Trend</div>
          <div className="text-lg font-semibold text-neutral-900 mb-3">Requests · Credits · 12 months</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={s.monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="month" fontSize={11} stroke="#999" />
                <YAxis yAxisId="l" fontSize={11} stroke="#999" />
                <YAxis yAxisId="r" orientation="right" fontSize={11} stroke="#999" />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eee", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line yAxisId="l" type="monotone" dataKey="requests" name="Requests" stroke={G.emerald} strokeWidth={2.5} dot={{ r: 3 }} isAnimationActive animationDuration={1000} />
                <Line yAxisId="r" type="monotone" dataKey="credits" name="Credits" stroke={G.amber} strokeWidth={2.5} dot={{ r: 3 }} isAnimationActive animationDuration={1000} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-neutral-200 bg-white p-5">
          <div className="text-xs uppercase tracking-widest text-neutral-500">Top Peak Days</div>
          <div className="text-lg font-semibold text-neutral-900 mb-3">Highest traffic sessions</div>
          <ul className="space-y-2">
            {s.topDays.length === 0 && <li className="text-sm text-neutral-500">No data yet.</li>}
            {s.topDays.map((d, i) => {
              const max = s.topDays[0]?.requests || 1;
              return (
                <li key={d.date} className="flex items-center gap-3">
                  <div className="w-14 text-xs text-neutral-500 tabular-nums">{d.date.slice(5)}</div>
                  <div className="flex-1 h-6 rounded-md bg-neutral-100 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: `${(d.requests / max) * 100}%` }}
                      transition={{ duration: 0.8, delay: i * 0.05 }}
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-600"
                    />
                  </div>
                  <div className="w-12 text-right text-sm font-semibold tabular-nums">{d.requests}</div>
                </li>
              );
            })}
          </ul>
        </motion.div>
      </div>

      {/* Recent */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
        <div className="p-5 border-b border-neutral-200">
          <div className="text-xs uppercase tracking-widest text-neutral-500">Recent Requests</div>
          <div className="text-lg font-semibold text-neutral-900">Last 15 chatbot calls</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-xs uppercase tracking-wider text-neutral-500">
              <tr>
                <th className="text-left px-5 py-2">Time</th>
                <th className="text-left px-5 py-2">Model</th>
                <th className="text-right px-5 py-2">Tokens</th>
                <th className="text-right px-5 py-2">Credits</th>
              </tr>
            </thead>
            <tbody>
              {s.recent.length === 0 && (
                <tr><td className="px-5 py-6 text-neutral-500" colSpan={4}>No chatbot events yet. Send a message to Uppal Concierge to populate.</td></tr>
              )}
              {s.recent.map((r, i) => (
                <tr key={i} className="border-t border-neutral-100 hover:bg-amber-50/30 transition-colors">
                  <td className="px-5 py-2 text-neutral-700 tabular-nums">{new Date(r.created_at).toLocaleString("en-GB")}</td>
                  <td className="px-5 py-2 text-neutral-600">{r.model}</td>
                  <td className="px-5 py-2 text-right tabular-nums">{r.total_tokens.toLocaleString()}</td>
                  <td className="px-5 py-2 text-right tabular-nums font-medium text-amber-700">{r.credits.toFixed(6)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

function ForecastCell({ label, value }: { label: string; value: number | null }) {
  const v = useCountUp(value ?? 0);
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-3">
      <div className="text-[10px] uppercase tracking-widest text-white/50">{label}</div>
      <div className="mt-1 text-xl font-semibold tabular-nums">{value === null ? "—" : Math.round(v).toLocaleString()}</div>
      <div className="text-[10px] text-white/40">users</div>
    </div>
  );
}
