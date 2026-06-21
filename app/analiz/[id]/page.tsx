import { AnalysisDashboard } from "@/components/AnalysisDashboard";

export const metadata = {
  title: "Analiz Sonucu — Astrotek AI",
  robots: { index: false, follow: false },
};

export default function AnalysisPage({
  params,
}: {
  params: { id: string };
}) {
  return <AnalysisDashboard id={params.id} />;
}
