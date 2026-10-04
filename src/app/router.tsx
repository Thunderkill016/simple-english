import { Route, Routes } from "react-router";
import { LearnPage } from "../routes/LearnPage";
import { LessonPage } from "../routes/LessonPage";

/**
 * Declarative-mode routing: one lesson, two screens.
 * `/` is the Learn page (the only place to start).
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LearnPage />} />
      <Route path="/learn" element={<LearnPage />} />
      <Route path="/learn/lesson-1" element={<LessonPage />} />
      <Route path="*" element={<p>Page not found.</p>} />
    </Routes>
  );
}
