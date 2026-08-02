import { Link } from "react-router-dom";
import { useState } from "react";
import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";
import FaqItem from "../components/FaqItem";

const steps = [
  {
    num: "01",
    title: "Højtryksvask",
    desc: "Komplet rengøring for at fjerne vejrester.",
  },
  {
    num: "02",
    title: "Termisk tørring",
    desc: "Fjernelse af fugt med varm luft.",
  },
  {
    num: "03",
    title: "Detaljeret inspektion",
    desc: "Nøje undersøgelse af kritiske områder.",
  },
  {
    num: "04",
    title: "Hulrumsindsprøjtning",
    desc: "Beskyttelse af indvendige kasseprofiler og døre.",
  },
  {
    num: "05",
    title: "Overfladebeskyttelse",
    desc: "Beskyttende lag på hele chassiset.",
  },
  {
    num: "06",
    title: "Kvalitetskontrol",
    desc: "Endelig kontrol og garantiattest.",
  },
];

const sidebarLinks = [
  "Komplet rustbehandling",
  "Vedligeholdelsesbehandling",
  "Speciel behandling",
];

export default function AntiRouille() {
  const [activeLabel, setActiveLabel] = useState(sidebarLinks[0]);

  const labelContent = {
    "Komplet rustbehandling": {
        title: "Komplet rustbehandling",
        sections: [
          {
            text: `Komplet rustbehandling er den mest effektive løsning til at beskytte chassiset og følsomme områder af et køretøj over tid. Den er primært rettet mod nyere eller velholdte biler, der endnu ikke har synlig korrosion.

                  Denne behandling giver en integreret beskyttelse mod fugt, salt, grusstød og almindelig slitage.`,
          },
          {
            subtitle: "Hvorfor vælge en komplet behandling?",
            text: `Med tiden udsættes dele under køretøjet for barske forhold: våde veje, saltsprøjt om vinteren, støv, mudder og temperaturændringer.
                    Selv på en ny bil kan korrosion begynde at udvikle sig i indvendige hulrum eller skjulte områder.
                    En komplet behandling forhindrer disse problemer ved at påføre et beskyttende lag over alle sårbare overflader.`,
          },

          {
            subtitle: "Omfattede områder",
            text: `Behandlingen dækker alle eksponerede elementer:`,
            items: [
              "chassis",
              "skærmkanter",
              "indre hulrum",
              "hulrum",
              "siderør",
              "langsgående bjælker",
              "døre",
            ],
          },
          {
            subtitle: "Fordele ved komplet behandling",
            text: `Denne behandling tilbyder flere fordele:`,
            items: [
              "langvarig beskyttelse",
              "forebyggelse af korrosion før den opstår",
              "forlængelse af køretøjets levetid",
              "reduktion af fremtidige vedligeholdelsesomkostninger",
              "forbedring af gensalgsværdien",
            ],
          },
        ],
      },
      "Vedligeholdelsesbehandling": {
        title: "Vedligeholdelsesbehandling",
        sections: [
          {
            text:
              `Vedligeholdelsesbehandling er en regelmæssig indsats designet til at bevare effektiviteten af en allerede installeret rustbeskyttelse. Modsat en komplet behandling, som etablerer en initial barriere mod korrosion, har vedligeholdelse til formål at styrke, opdatere og forlænge denne beskyttelse over tid.
  Den henvender sig primært til køretøjer, der tidligere har fået professionel rustbeskyttelse, og hvis ejere ønsker optimal holdbarhed.`,
          },

          {
            subtitle: "Hvorfor vedligeholdelse?",
            text:
              `Selv efter en komplet behandling vil rustbeskyttelsen slide over tid: grusstød, temperaturvariationer, fugt, saltsprøjt og højtryksvask kan svække beskyttelsen.
              Over tid kan visse områder blive sårbare eller miste effekt.

              Vedligeholdelse gør det muligt at:`,

            items: [
              "kontrollere tilstanden af den eksisterende beskyttelse",
              "rette op på svækkede områder",
              "genanvende produktet på udsatte dele",
              "forlænge den oprindelige behandlings levetid",
            ],
          },
          {
            subtitle: "Hvor ofte bør man vedligeholde?",
            text:
              `Frekvensen afhænger af kørselsmønsteret, men generelt anbefales:`,

            items: [
              "hver 12-24 måned ved almindelig brug",
              "årligt for køretøjer udsat for salt eller fugt",
              "efter et sammenstød, slag eller udskiftning af chassisdele",
              "når tegn på slid opstår (tørre områder, afskalning, usædvanlige metalliske lyde)",
            ],
          },
          {
            subtitle: "Fordele ved vedligeholdelse",
            text:
              `Regelmæssig vedligeholdelse giver:`,

            items: [
              "forlænget effektivitet af den komplette behandling",
              "forebyggelse af korrosion i svækkede områder",
              "reduktion af langsigtede reparationsomkostninger",
              "opretholdelse af køretøjets værdi",
              "sikring af konstant beskyttelse, selv under hårde forhold",
            ],
          },
        ],
      },
      "Speciel behandling": {
  title: "Speciel behandling",
  sections: [
    {
      text: "Speciel behandling er en avanceret indsats målrettet køretøjer med særlige behov: allerede synlig korrosion, intensiv brug, udsættelse for ekstreme forhold eller særlige karakteristika pga. alder eller type. Modsat standard- eller vedligeholdelsesbehandlinger sigter denne behandling mod at korrigere, stabilisere og styrke beskyttelsen af allerede svækkede eller svært tilgængelige områder.",
    },
    {
      subtitle: "Hvilke køretøjer?",
      text: "Denne behandling henvender sig primært til:",
      items: [
        "gamle køretøjer, hvor chassiset er begyndt at oxidere",
        "erhvervskøretøjer med intensiv brug",
        "4x4, SUV'er og terrængående køretøjer udsat for mudder, fugt eller stød",
        "køretøjer, der har fået skader eller reparationer på chassiset",
        "biler, der kører i ekstreme miljøer (kystområder, saltsprøjt, byggepladser)",
      ],
    },
          {
            subtitle: "Hvorfor speciel behandling?",
            text:
              `Med tiden kan nogle køretøjer udvikle mere fremskreden eller lokaliseret korrosion.
  I sådanne tilfælde kan en klassisk behandling ikke sikre optimal beskyttelse, da den ikke retter op på allerede eksisterende skader.

  Speciel behandling muliggør:`,

            items: [
              "at stoppe korrosionsudbredelsen",
              "at styrke svækkede områder",
              "at behandle svært tilgængelige overflader",
              "at påføre mere holdbare og tilpassede produkter",
              "at forlænge levetiden for et allerede udsat køretøj",
            ],
          },
          {
            subtitle: "Fordele ved speciel behandling",
            text:
              `Denne behandling tilbyder:`,

            items: [
              "korrektion af allerede påvirkede områder",
              "forstærket beskyttelse for risikokøretøjer",
              "markant forlænget chassislevetid",
              "forbedret modstand mod ekstreme forhold",
              "en skræddersyet løsning afhængig af køretøjets type og tilstand",
            ],
          },
        ],
      },
    
  };

  const activeContent = labelContent[activeLabel];

  return (
    <div className="bg-background text-on-surface font-body-md selection:bg-primary-container selection:text-on-primary-container">
      <PublicHeader />

      {/* Compact Hero Header */}
      <section className="bg-surface-container-low border-b border-outline-variant">
        <div className="max-w-container-max mx-auto px-gutter py-lg">
          <nav aria-label="Breadcrumb" className="flex mb-xs">
            <ol className="inline-flex items-center space-x-1 md:space-x-3 text-label-sm">
              <li className="inline-flex items-center text-secondary">
                <Link className="hover:text-primary" to="/#services">
                  Tjenester
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="material-symbols-outlined text-[16px] text-outline mx-xs">
                    chevron_right
                  </span>
                  <span className="text-on-surface font-medium">
                    Anti-rustbehandling
                  </span>
                </div>
              </li>
            </ol>
          </nav>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">
            Anti-rustbehandling
          </h1>
        </div>
      </section>

      {/* Hovedindhold med sidepanel */}
      <main className="max-w-container-max mx-auto px-gutter py-xl">
        <div className="flex flex-col lg:flex-row gap-lg">
          {/* Vertical Side Navigation */}
          <aside className="w-full lg:w-1/3 xl:w-1/4">
            <nav className="flex flex-col border border-surface-container-high rounded overflow-hidden">
              {sidebarLinks.map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setActiveLabel(label)}
                  className={`text-left p-md font-label-bold border-b border-surface-container-high last:border-b-0 transition-colors ${
                    activeLabel === label
                      ? "bg-amber-400 text-on-primary"
                      : "bg-surface-container-low text-on-surface hover:bg-surface-container"
                  }`}
                >
                  {label}
                </button>
              ))}
            </nav>
            <div className="mt-lg p-lg bg-surface-container text-on-surface rounded-lg">
              <h3 className="font-headline-md text-headline-md mb-sm">
                Har du brug for hjælp?
              </h3>
              <p className="font-body-md text-body-md text-secondary mb-md">
                Vores eksperter er klar til at besvare dine spørgsmål om beskyttelse af dit køretøj.
              </p>
              <Link
                to={{ pathname: "/", hash: "#devis" }}
                className="w-full block text-center bg-primary text-on-primary py-sm rounded font-label-bold"
              >
                Kontakt os
              </Link>
            </div>
          </aside>

          {/* Serviceindhold */}
          <article className="w-full lg:w-2/3 xl:w-3/4">
            <div className="max-w-3xl">
              <h2 className="font-headline-xl text-headline-xl text-on-surface mb-md">
                {activeContent.title}
              </h2>
              <div className="prose prose-lg max-w-none text-secondary space-y-md mb-xl">
                {activeContent.sections
                  ? activeContent.sections.map((s, i) => (
                      <div key={i} className="mb-md">
                        {s.subtitle && (
                          <h3 className="font-headline-md text-headline-md text-on-surface mb-xs">
                            {s.subtitle}
                          </h3>
                        )}
                        {s.text && (
                          <>
                            {s.text.split(/\n\s*\n/).map((paragraph, pIndex) => (
                              <p key={pIndex} className="font-body-lg text-body-lg">
                                {paragraph.split(/\n/).map((line, lineIndex) => (
                                  <>
                                    {lineIndex > 0 && <br />}
                                    {line.trim()}
                                  </>
                                ))}
                              </p>
                            ))}
                          </>
                        )}
                        {s.items && (
                          <ul className="ml-6 list-disc space-y-2 text-body-lg text-body-lg text-secondary">
                            {s.items.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))
                  : activeContent.description ? (
                      <p className="font-body-lg text-body-lg">
                        {activeContent.description}
                      </p>
                    ) : null}
              </div>

              {/* Process Recap */}
              <div className="bg-surface-container-lowest p-lg rounded-xl border border-surface-container-high mb-xl">
                <h3 className="font-headline-md text-headline-md text-on-surface mb-lg text-center">
                  Vores 6-trins proces
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                  {steps.map((step) => (
                    <div key={step.num} className="flex gap-md">
                      <span className="font-headline-md text-surface-dim">
                        {step.num}
                      </span>
                      <div>
                        <p className="font-label-bold text-on-surface">
                          {step.title}
                        </p>
                        <p className="text-sm text-secondary">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </article>
        </div>
      </main>

      {/* FAQ */}
      <section className="py-xl px-gutter max-w-3xl mx-auto border-t border-surface-container-high">
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xl text-center">
          Ofte stillede spørgsmål
        </h2>
        <div className="space-y-sm">
          <FaqItem
            question="Hvor lang tid tager behandlingen?"
            answer="En komplet behandling tager normalt en hel dag. Tørreprocessen er den længste, men afgørende for holdbarheden."
          />
          <FaqItem
            question="Hvor ofte skal behandlingen gentages?"
            answer="For optimal beskyttelse anbefaler vi årlig inspektion og fornyelse hver 2-3 år afhængigt af kørsel og forhold."
          />
          <FaqItem
            question="Hvad koster en komplet behandling?"
            answer="Prisen varierer efter køretøjets størrelse. Vores priser starter fra 350 kr. for en komplet chassisbehandling. Kontakt os for et præcist tilbud."
<<<<<<< HEAD
          />
=======
>>>>>>> 2a44582 (Fix AntiRouille page Danish text and syntax)
          />
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
