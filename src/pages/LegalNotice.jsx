import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";

export default function LegalNotice() {
  return (
    <div className="min-h-screen bg-surface-container-lowest text-on-surface">
      <PublicHeader />
      <main className="max-w-container-max mx-auto px-gutter py-xl">
        <section className="bg-white rounded-[32px] border border-outline-variant p-lg shadow-sm">
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-lg">
            Juridiske oplysninger
          </h1>
          <p className="text-body-md text-secondary mb-md">
            Denne side beskriver de juridiske oplysninger om SKJOLD og vores service. Det er vigtigt for alle kunder at kende ansvar, betingelser og kontaktmuligheder.
          </p>
          <div className="space-y-lg">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-3">
                Virksomhedsoplysninger
              </h2>
              <p className="text-body-md text-secondary leading-7">
                SKJOLD Rust Protection er en dansk bilplejevirksomhed specialiseret i rustbeskyttelse og polering.
                Vores værksted arbejder efter gældende regler for kvalitet, sikkerhed og forbrugerbeskyttelse.
              </p>
            </div>
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-3">
                Ansvar og garanti
              </h2>
              <p className="text-body-md text-secondary leading-7">
                Vi yder garanti på vores rustbeskyttelsesbehandlinger i overensstemmelse med vores betingelser.
                Garantien gælder under forudsætning af, at bilen får den anbefalede vedligeholdelse og opbevares forsvarligt.
              </p>
            </div>
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-3">
                Kontaktinformation
              </h2>
              <p className="text-body-md text-secondary leading-7">
                For spørgsmål vedrørende juridiske forhold, vilkår eller persondata kan du kontakte os via kontaktformularen eller besøge vores værksted på Fynsvej 47, 5500 Middelfart.
              </p>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
