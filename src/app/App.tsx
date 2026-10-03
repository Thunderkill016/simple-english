import { Link, NavLink } from "react-router";
import { AppRoutes } from "./router";

const navItems = [
  { to: "/", label: "Today", end: true },
  { to: "/learn", label: "Learn", end: false },
  { to: "/review", label: "Review", end: false },
  { to: "/progress", label: "Progress", end: false },
];

export function App() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-between gap-2 px-4 py-3">
          <Link to="/" className="font-bold text-sky-800">
            Simple English
          </Link>
          <nav aria-label="Main" className="flex gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "bg-slate-100 text-slate-900" : ""}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-6">
        <AppRoutes />
      </main>
    </div>
  );
}
