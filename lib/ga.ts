import { BetaAnalyticsDataClient } from "@google-analytics/data";

// GA4 Data API — süperadmin paneline canlı trafik verisi çeker.
// Kurulum (env): GA_PROPERTY_ID (sayısal property id), GA_SA_CLIENT_EMAIL,
// GA_SA_PRIVATE_KEY (servis hesabı JSON'undan). Yoksa configured=false döner.

const PROPERTY_ID = process.env.GA_PROPERTY_ID;
const CLIENT_EMAIL = process.env.GA_SA_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.GA_SA_PRIVATE_KEY?.replace(/\\n/g, "\n");

export const gaConfigured = Boolean(PROPERTY_ID && CLIENT_EMAIL && PRIVATE_KEY);

let client: BetaAnalyticsDataClient | null = null;
function getClient(): BetaAnalyticsDataClient | null {
  if (!gaConfigured) return null;
  if (!client)
    client = new BetaAnalyticsDataClient({
      credentials: { client_email: CLIENT_EMAIL, private_key: PRIVATE_KEY },
    });
  return client;
}

export interface GaStats {
  configured: boolean;
  error?: string;
  realtimeUsers: number;
  summary: {
    users7d: number;
    users28d: number;
    pageViews28d: number;
    sessions28d: number;
  };
  daily: { date: string; users: number }[];
  topPages: { path: string; views: number }[];
  sources: { source: string; sessions: number }[];
}

const EMPTY: Omit<GaStats, "configured" | "error"> = {
  realtimeUsers: 0,
  summary: { users7d: 0, users28d: 0, pageViews28d: 0, sessions28d: 0 },
  daily: [],
  topPages: [],
  sources: [],
};

const num = (v: string | null | undefined) => Number(v ?? 0) || 0;
// GA tarih "20260629" → "06-29"
const fmtDate = (d: string) =>
  d.length === 8 ? `${d.slice(4, 6)}-${d.slice(6, 8)}` : d;

export async function getGaStats(): Promise<GaStats> {
  if (!gaConfigured) return { configured: false, ...EMPTY };
  const c = getClient()!;
  const property = `properties/${PROPERTY_ID}`;

  try {
    const [realtime, s7, s28, daily, pages, sources] = await Promise.all([
      c.runRealtimeReport({ property, metrics: [{ name: "activeUsers" }] }),
      c.runReport({
        property,
        dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
        metrics: [{ name: "activeUsers" }],
      }),
      c.runReport({
        property,
        dateRanges: [{ startDate: "28daysAgo", endDate: "today" }],
        metrics: [
          { name: "activeUsers" },
          { name: "screenPageViews" },
          { name: "sessions" },
        ],
      }),
      c.runReport({
        property,
        dateRanges: [{ startDate: "13daysAgo", endDate: "today" }],
        dimensions: [{ name: "date" }],
        metrics: [{ name: "activeUsers" }],
        orderBys: [{ dimension: { dimensionName: "date" } }],
      }),
      c.runReport({
        property,
        dateRanges: [{ startDate: "28daysAgo", endDate: "today" }],
        dimensions: [{ name: "pagePath" }],
        metrics: [{ name: "screenPageViews" }],
        orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
        limit: 8,
      }),
      c.runReport({
        property,
        dateRanges: [{ startDate: "28daysAgo", endDate: "today" }],
        dimensions: [{ name: "sessionDefaultChannelGroup" }],
        metrics: [{ name: "sessions" }],
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
        limit: 6,
      }),
    ]);

    return {
      configured: true,
      realtimeUsers: num(realtime[0].rows?.[0]?.metricValues?.[0]?.value),
      summary: {
        users7d: num(s7[0].rows?.[0]?.metricValues?.[0]?.value),
        users28d: num(s28[0].rows?.[0]?.metricValues?.[0]?.value),
        pageViews28d: num(s28[0].rows?.[0]?.metricValues?.[1]?.value),
        sessions28d: num(s28[0].rows?.[0]?.metricValues?.[2]?.value),
      },
      daily: (daily[0].rows ?? []).map((r) => ({
        date: fmtDate(r.dimensionValues?.[0]?.value ?? ""),
        users: num(r.metricValues?.[0]?.value),
      })),
      topPages: (pages[0].rows ?? []).map((r) => ({
        path: r.dimensionValues?.[0]?.value ?? "/",
        views: num(r.metricValues?.[0]?.value),
      })),
      sources: (sources[0].rows ?? []).map((r) => ({
        source: r.dimensionValues?.[0]?.value ?? "—",
        sessions: num(r.metricValues?.[0]?.value),
      })),
    };
  } catch (e) {
    return { configured: true, error: (e as Error).message, ...EMPTY };
  }
}
