import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type ChatbotStats = {
  totals: {
    today: number;
    week: number;
    month: number;
    year: number;
    allTime: number;
    creditsToday: number;
    creditsMonth: number;
    creditsYear: number;
    creditsAllTime: number;
    tokensAllTime: number;
    sessionsAllTime: number;
    avgMsgsPerSession: number;
    avgCreditsPerMsg: number;
  };
  daily: Array<{ date: string; requests: number; credits: number }>;
  monthly: Array<{ month: string; requests: number; credits: number }>;
  hourly: Array<{ hour: number; requests: number }>;
  topDays: Array<{ date: string; requests: number }>;
  recent: Array<{ created_at: string; model: string; total_tokens: number; credits: number }>;
  creditsBalance: number | null;
  forecast: {
    burnPerDay: number;
    daysRemaining: number | null;
    usersRemainingDaily: number | null;
    usersRemainingMonthly: number | null;
    usersRemainingYearly: number | null;
    avgMsgsPerUser: number;
  };
};

export const getChatbotStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<ChatbotStats> => {
    const { data: isOwner } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "owner",
    });
    if (!isOwner) throw new Error("Forbidden");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: rows } = await supabaseAdmin
      .from("chatbot_events")
      .select("created_at,model,prompt_tokens,completion_tokens,total_tokens,credits,message_count,session_id")
      .order("created_at", { ascending: false })
      .limit(50000);

    const events = rows ?? [];
    const now = new Date();
    const startOfDay = new Date(now); startOfDay.setHours(0, 0, 0, 0);
    const startOfWeek = new Date(now); startOfWeek.setDate(now.getDate() - 6); startOfWeek.setHours(0,0,0,0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    let today = 0, week = 0, month = 0, year = 0;
    let creditsToday = 0, creditsMonth = 0, creditsYear = 0, creditsAllTime = 0, tokensAllTime = 0;
    const sessions = new Set<string>();
    const dailyMap = new Map<string, { requests: number; credits: number }>();
    const monthlyMap = new Map<string, { requests: number; credits: number }>();
    const hourly = Array.from({ length: 24 }, (_, h) => ({ hour: h, requests: 0 }));

    for (const e of events) {
      const t = new Date(e.created_at as string);
      const c = Number(e.credits ?? 0);
      creditsAllTime += c;
      tokensAllTime += Number(e.total_tokens ?? 0);
      if (e.session_id) sessions.add(e.session_id as string);
      if (t >= startOfDay) { today++; creditsToday += c; }
      if (t >= startOfWeek) { week++; }
      if (t >= startOfMonth) { month++; creditsMonth += c; }
      if (t >= startOfYear) { year++; creditsYear += c; }

      const dKey = t.toISOString().slice(0, 10);
      const d = dailyMap.get(dKey) ?? { requests: 0, credits: 0 };
      d.requests++; d.credits += c;
      dailyMap.set(dKey, d);

      const mKey = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}`;
      const m = monthlyMap.get(mKey) ?? { requests: 0, credits: 0 };
      m.requests++; m.credits += c;
      monthlyMap.set(mKey, m);

      hourly[t.getHours()].requests++;
    }

    // Build last 30 days including zero-days
    const daily: Array<{ date: string; requests: number; credits: number }> = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(startOfDay); d.setDate(d.getDate() - i);
      const k = d.toISOString().slice(0, 10);
      const v = dailyMap.get(k) ?? { requests: 0, credits: 0 };
      daily.push({ date: k, requests: v.requests, credits: Number(v.credits.toFixed(4)) });
    }

    const monthly = Array.from(monthlyMap.entries())
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .slice(-12)
      .map(([month, v]) => ({ month, requests: v.requests, credits: Number(v.credits.toFixed(4)) }));

    const topDays = Array.from(dailyMap.entries())
      .map(([date, v]) => ({ date, requests: v.requests }))
      .sort((a, b) => b.requests - a.requests)
      .slice(0, 7);

    const recent = events.slice(0, 15).map((e) => ({
      created_at: e.created_at as string,
      model: (e.model as string) ?? "google/gemini-3-flash-preview",
      total_tokens: Number(e.total_tokens ?? 0),
      credits: Number(e.credits ?? 0),
    }));

    const sessionsAllTime = sessions.size || Math.max(1, Math.round(events.length / 4));
    const avgMsgsPerSession = events.length ? events.length / sessionsAllTime : 0;
    const avgCreditsPerMsg = events.length ? creditsAllTime / events.length : 0.006;

    // Burn/forecast — use last 14 days avg
    const last14 = daily.slice(-14);
    const burnPerDay = last14.reduce((s, d) => s + d.credits, 0) / 14 || 0;

    // Credits balance — best-effort via AI Gateway (may not be exposed). Leave null if unknown.
    let creditsBalance: number | null = null;
    try {
      const key = process.env.LOVABLE_API_KEY;
      if (key) {
        const res = await fetch("https://ai.gateway.lovable.dev/v1/credits", {
          headers: { "Lovable-API-Key": key },
        });
        if (res.ok) {
          const j: any = await res.json().catch(() => null);
          const bal = j?.balance ?? j?.credits ?? j?.available;
          if (typeof bal === "number") creditsBalance = bal;
        }
      }
    } catch { /* ignore */ }

    const avgMsgsPerUser = Math.max(1, avgMsgsPerSession || 3.5);
    const costPerUser = avgCreditsPerMsg * avgMsgsPerUser;
    const remaining = creditsBalance ?? 2500 - creditsAllTime;
    const usersRemaining = costPerUser > 0 ? Math.floor(remaining / costPerUser) : null;

    return {
      totals: {
        today, week, month, year, allTime: events.length,
        creditsToday: +creditsToday.toFixed(4),
        creditsMonth: +creditsMonth.toFixed(4),
        creditsYear: +creditsYear.toFixed(4),
        creditsAllTime: +creditsAllTime.toFixed(4),
        tokensAllTime,
        sessionsAllTime,
        avgMsgsPerSession: +avgMsgsPerSession.toFixed(2),
        avgCreditsPerMsg: +avgCreditsPerMsg.toFixed(6),
      },
      daily, monthly, hourly, topDays, recent,
      creditsBalance,
      forecast: {
        burnPerDay: +burnPerDay.toFixed(4),
        daysRemaining: burnPerDay > 0 ? Math.floor(remaining / burnPerDay) : null,
        usersRemainingDaily: usersRemaining !== null && burnPerDay > 0 ? Math.floor(usersRemaining / Math.max(1, (usersRemaining / 365))) : usersRemaining,
        usersRemainingMonthly: usersRemaining !== null ? Math.floor(usersRemaining / 12) : null,
        usersRemainingYearly: usersRemaining,
        avgMsgsPerUser: +avgMsgsPerUser.toFixed(2),
      },
    };
  });
