import { Link, NavLink } from "react-router-dom";

export default function PublicHeader() {
  return (
    <header className="sticky top-0 w-full z-50 bg-surface-container-lowest shadow-[0px_4px_12px_rgba(26,26,26,0.05)]">
      <nav className="flex justify-between items-center max-w-container-max mx-auto px-gutter py-base">
        <Link to="/" className="text-headline-md font-headline-md font-extrabold text-primary">
          SKJOLD
        </Link>
        <div className="hidden md:flex gap-md items-center">
          <a
            href="/#accueil"
            className="text-label-bold font-label-bold text-on-surface hover:text-primary transition-colors duration-200"
          >
            Hjem
          </a>
          <a
            href="/#services"
            className="text-label-bold font-label-bold text-on-surface hover:text-primary transition-colors duration-200"
          >
            Tjenester
          </a>
          <NavLink
            to="/anti-rouille"
            className={({ isActive }) =>
              `text-label-bold font-label-bold transition-colors duration-200 ${
                isActive
                  ? "text-primary border-b-2 border-primary pb-1"
                  : "text-on-surface hover:text-primary"
              }`
            }
          >
            Rustbeskyttelse
          </NavLink>
          <a
            href="/#garantie"
            className="text-label-bold font-label-bold text-on-surface hover:text-primary transition-colors duration-200"
          >
            Garanti
          </a>
          <a
            href="/#devis"
            className="text-label-bold font-label-bold text-on-surface hover:text-primary transition-colors duration-200"
          >
            Kontakt
          </a>
        </div>
        <a
          href="/#devis"
          className="bg-primary-container text-on-primary font-label-bold text-label-bold px-lg py-sm rounded-lg hover:brightness-110 active:scale-95 transition-all duration-200 shadow-sm"
        >
          Anmod om tilbud
        </a>
      </nav>
    </header>
  );
}
