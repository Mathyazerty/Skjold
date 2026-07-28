export default function PublicFooter() {
  return (
    <footer className="bg-inverse-surface border-t-2 border-primary text-surface-dim">
      <div className="max-w-container-max mx-auto px-gutter py-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-lg">
        <div className="space-y-base">
          <div className="text-headline-md font-headline-md font-extrabold text-surface-container-lowest">
            SKJOLD
          </div>
          <p className="text-surface-dim font-body-md text-body-md max-w-xs">
            Skandinavisk ekspertise i bilbeskyttelse i over 30 år.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-lg">
          <div className="flex flex-col gap-sm">
            <span className="font-label-bold text-label-bold text-surface-container-lowest uppercase tracking-wider">
              Links
            </span>
              <a
                className="text-label-bold font-label-bold text-surface-dim hover:text-surface-container-lowest transition-colors"
                href="/#accueil"
              >
                Hjem
              </a>
              <a
                className="text-label-bold font-label-bold text-surface-dim hover:text-surface-container-lowest transition-colors"
                href="/#services"
              >
                Tjenester
              </a>
              <a
                className="text-label-bold font-label-bold text-surface-dim hover:text-surface-container-lowest transition-colors"
                href="/admin/login"
              >
                Admin
              </a>
          </div>
          <div className="flex flex-col gap-sm">
            <span className="font-label-bold text-label-bold text-surface-container-lowest uppercase tracking-wider">
              Juridisk
            </span>
              <a
                className="text-label-bold font-label-bold text-surface-dim hover:text-surface-container-lowest transition-colors"
                href="/privacy-policy"
              >
                Fortrolighedspolitik
              </a>
              <a
                className="text-label-bold font-label-bold text-surface-dim hover:text-surface-container-lowest transition-colors"
                href="/legal-notice"
              >
                Juridiske oplysninger
              </a>
          </div>
          
        </div>
      </div>
      <div className="max-w-container-max mx-auto px-gutter py-md border-t border-surface-dim/10 text-center">
          <p className="text-label-sm font-label-sm">
          © 2024 SKJOLD Rust Protection. Alle rettigheder forbeholdes.
        </p>
      </div>
    </footer>
  );
}
