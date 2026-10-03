import { Link, NavLink, useLocation, useSearchParams } from "react-router";
import { getLesson } from "../content/curriculum";
import { AppRoutes } from "./router";

const navItems = [
  { to: "/", label: "Today", end: true },
  { to: "/learn", label: "Learn", end: false },
  { to: "/review", label: "Review", end: false },
  { to: "/progress", label: "Progress", end: false },
];

function navClass({ isActive }: { isActive: boolean }) {
  return `nav-item ${isActive ? "nav-item-active" : ""}`;
}

/**
 * Shell: mobile = minimal brand header + bottom nav; md+ = compact left
 * sidebar. During an actual lesson all top-level navigation disappears —
 * the lesson provides its own way out (focus mode, §19 of the design spec).
 */
export function App() {
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const lessonId = pathname === "/learn" ? params.get("lesson") : null;
  const focusLesson = lessonId ? getLesson(lessonId) : undefined;

  if (focusLesson) {
    return (
      <main className="mx-auto w-full max-w-[42rem] px-4 py-6 md:py-10">
        <AppRoutes />
      </main>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Mobile brand header */}
      <header className="border-b border-border bg-surface md:hidden">
        <div className="mx-auto max-w-[42rem] px-4 py-3">
          <Link to="/" className="text-base font-bold text-primary">
            Simple English
          </Link>
        </div>
      </header>

      {/* Desktop sidebar */}
      <div className="fixed inset-y-0 left-0 hidden w-52 flex-col gap-6 border-r border-border bg-surface px-4 py-6 md:flex">
        <Link to="/" className="px-3 text-base font-bold text-primary">
          Simple English
        </Link>
        <nav aria-label="Main" className="flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={navClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="md:pl-52">
        <main className="mx-auto w-full max-w-[42rem] px-4 py-6 pb-24 md:py-10 md:pb-10">
          <AppRoutes />
        </main>
      </div>

      {/* Mobile bottom navigation — persistent on top-level screens only */}
      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        <div className="grid grid-cols-4 gap-1 px-2 py-2">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={navClass}>
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
