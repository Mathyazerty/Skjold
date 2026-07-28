import { NavLink, useNavigate } from "react-router-dom";

const navItems = [
  { to: "/admin/dashboard", icon: "dashboard", label: "Kontrolpanel" },
  { to: "/admin/quotes", icon: "request_quote", label: "Forespørgsler" },
  { to: "/admin/subscribers", icon: "group", label: "Abonnenter" },
  { to: "/admin/reviews", icon: "rate_review", label: "Anmeldelser" },
];

export default function AdminLayout({ children, topbar }) {
  const navigate = useNavigate();

  return (
    <div className="text-on-surface min-h-screen bg-background">
      {/* SideNavBar */}
      <aside className="h-screen w-64 fixed left-0 top-0 bg-surface-container-low border-r border-outline-variant flex flex-col py-lg z-50">
        <div className="px-md mb-lg">
          <div className="flex items-center gap-sm mb-md">
            <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-lg">
              <span className="material-symbols-outlined text-on-primary fill-1">
                shield
              </span>
            </div>
            <div>
              <h1 className="font-headline-md text-headline-md text-primary tracking-tight">
                Skjold Admin
              </h1>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-sm space-y-xs">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-sm rounded-lg px-md py-sm font-label-bold text-label-bold transition-all duration-200 ${
                  isActive
                    ? "bg-primary-container text-on-primary-container border-l-4 border-primary"
                    : "text-secondary hover:bg-surface-variant"
                }`
              }
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontVariationSettings: "'FILL' 0",
                }}
              >
                {item.icon}
              </span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-sm pt-lg mt-auto border-t border-outline-variant space-y-xs">
          <button
            onClick={() => navigate("/admin/login")}
            className="w-full flex items-center gap-sm text-error px-md py-sm hover:bg-error-container rounded-lg font-label-bold text-label-bold transition-all duration-200"
          >
            <span className="material-symbols-outlined">logout</span>
            Log ud
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-64 min-h-screen flex flex-col">
        {topbar}
        <div className="flex-grow">{children}</div>
        <footer className="w-full py-md mt-xl border-t border-outline-variant bg-background">
          <div className="flex flex-col md:flex-row justify-between items-center px-lg max-w-container-max mx-auto gap-md">
            <p className="font-label-sm text-label-sm text-on-secondary-container opacity-80">
              © 2024 PAVA Rust Protection. Danish Craftsmanship.
            </p>
            <div className="flex gap-md">
              <a
                className="font-label-sm text-label-sm text-on-secondary-container hover:text-primary transition-colors"
                href="#"
              >
                Fortrolighedspolitik
              </a>
              <a
                className="font-label-sm text-label-sm text-on-secondary-container hover:text-primary transition-colors"
                href="#"
              >
                Vilkår og betingelser
              </a>
              <a
                className="font-label-sm text-label-sm text-on-secondary-container hover:text-primary transition-colors"
                href="#"
              >
                Kontakt Support
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
