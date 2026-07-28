import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-surface-container-lowest text-on-surface">
      <PublicHeader />
      <main className="max-w-container-max mx-auto px-gutter py-xl">
        <section className="bg-white rounded-[32px] border border-outline-variant p-lg shadow-sm">
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-lg">
            Fortrolighedspolitik
          </h1>
          <p className="text-body-md text-secondary mb-md">
            SKJOLD beskytter dine oplysninger med samme omhu, som vi beskytter bilen.
            Denne fortrolighedspolitik forklarer, hvilke data vi indsamler, og hvordan vi bruger dem.
          </p>
          <div className="space-y-lg">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-3">
                Hvad vi indsamler
              </h2>
              <p className="text-body-md text-secondary leading-7">
                Når du udfylder kontaktformularen eller tilmelder dig nyhedsbrevet, indsamler vi navn, e-mailadresse, telefonnummer og den besked, du sender.
                Disse oplysninger bruges kun til at svare på din forespørgsel og til at sende relevante tilbud og information om vores service.
              </p>
            </div>
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-3">
                Hvorfor vi bruger dine oplysninger
              </h2>
              <p className="text-body-md text-secondary leading-7">
                Vi behandler dine oplysninger for at kunne kontakte dig med et tilbud, bekræfte booking, eller besvare dine spørgsmål.
                Vi gemmer ikke følsomme data længere end nødvendigt, og vi deler dem ikke med tredjepart uden dit samtykke.
              </p>
            </div>
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-3">
                Sikkerhed og opbevaring
              </h2>
              <p className="text-body-md text-secondary leading-7">
                Dine oplysninger opbevares sikkert i vores systemer. Vi anvender grundlæggende tekniske og organisatoriske foranstaltninger for at beskytte data mod uautoriseret adgang.
                Hvis du ønsker at få dine data slettet, kan du kontakte os direkte via kontaktformularen.
              </p>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
