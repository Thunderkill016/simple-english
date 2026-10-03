import { Route, Routes } from "react-router";
import { LearnPage } from "../routes/LearnPage";
import { ProgressPage } from "../routes/ProgressPage";
import { ReviewPage } from "../routes/ReviewPage";
import { TodayPage } from "../routes/TodayPage";

/**
 * Declarative-mode routing (ADR-0002): URL → component, no data-router
 * machinery. The local-first data layer has no pending states to manage.
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<TodayPage />} />
      <Route path="/learn" element={<LearnPage />} />
      <Route path="/review" element={<ReviewPage />} />
      <Route path="/progress" element={<ProgressPage />} />
      <Route path="*" element={<p>Page not found.</p>} />
    </Routes>
  );
}
