import { Link } from "react-router";
import { AppRoutes } from "./router";

/** Shell: minimal brand header + centered content column (Calm direction). */
export function App() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto w-full max-w-[42rem] px-4 py-3">
          <Link to="/" className="text-base font-bold text-primary">
            Simple English
          </Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[42rem] px-4 py-6 md:py-10">
        <AppRoutes />
      </main>
    </div>
  );
}
