import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";
import BeforeAfterSlider from "../components/BeforeAfterSlider";

const testimonials = [
  {
    name: "Jonas Madsen",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAzM1KC-9visoB7d4amd1svRsw5gVtLB2RMTE9SDKTyicS7cmuc8utKIrICCIL0adus-RQ0fxytG1jX1nTmNVsjPzloZEz9dm6XW22jVc4a6Ub1PzEKlJWe5qh9-QX1rLlR4TZ800-4Q2Pkpm-nd7W6De4G2fUcNyBQ7npsZv5vUVe1QsUQi3ID2fGozw4DoBGx4GL5BMgLANYMjtYqy0ipio3H4PqzfMiNEVUwQ5C3NSpo_FkxSMoA7ch0MzPvTLaX-fywqmZd2Cg",
    text: "Fremragende service. Min bil blev behandlet med stor omhu. Kan varmt anbefales.",
    rating: 5,
  },
  {
    name: "Sofie Kristensen",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDrNG6a3ONo8p_2jF2ZQIxoGSsHVVehPc1CKQAZR19KuXkNddNqS4c0yN10WgAZlkvjZXS1s8G8Mv8JPG2SOqgqq_R_OJnb9hTuCzI1qQ7Fp5xHQ2EHveOTGB4cutX2xodC3m0kNENDZY2WenKka4ln-gtkBfVlPtPALFwVhdD6IJOd9GSczB-n80IyNsq-OZfL_cCJJS3ELmt2ZiafvxMfesTGtEv6MJexFW86NZiY-ZpEra8hwS0OSOD6KtSssgmqcFJTgMnlqOs",
    text: "Den danske præcision er tydelig. Fantastisk sluttresultat.",
    rating: 5,
  },
  {
    name: "Mikkel Andersen",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB9Kb2b7NG8q02a0tESXnZNRB-5OKDoE9qumURcO8iwyVylylhD76lF6h9JZrbcNOrgodCCBTY7_8Ol2TC4bG2qTMDiIp_PFXpOft3sYNLKrCzihsKnyHw4lJDIyQeSafj2UmlH8ssODGRXVrOK7Zxoi3yTrBPdzlJcNBppXE4B57zBEA9lpli4OBEi4n2V-fbSJwiqfOdvqbNCWsB2KsV6ZdmGoSswdLZrL9wA04_hxVGWQ6LGdm_UDzYNpVIuWHEO5Y4MLS0h11U",
    text: "Fremragende modtagelse og SKJOLD-certifikat, som er et stort plus.",
    rating: 5,
  },
];

function StarRow({ rating }) {
  return (
    <div className="flex text-primary">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className="material-symbols-outlined text-[18px]"
          style={{ fontVariationSettings: `'FILL' ${i < rating ? 1 : 0}` }}
        >
          star
        </span>
      ))}
    </div>
  );
}

const emptyReviewForm = {
  firstName: "",
  lastName: "",
  rating: 5,
  message: "",
};

export default function Home() {
  const [email, setEmail] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "Komplet rustbehandling",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [newsletterError, setNewsletterError] = useState("");
  const [requestError, setRequestError] = useState("");
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);
  const [reviewState, setReviewState] = useState({
    isOpen: false,
    form: emptyReviewForm,
    sent: false,
    error: "",
  });
  const [reviewSent, setReviewSent] = useState(false);
  const apiBaseUrl = import.meta.env.VITE_API_URL || "https://skjold-production-f44f.up.railway.app";
  const location = useLocation();

  useEffect(() => {
    if (location.hash === "#devis") {
      const target = document.getElementById("devis");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  const renderStarInput = (rating, onChange) => (
    <div className="flex items-center gap-2">
      {Array.from({ length: 5 }).map((_, index) => {
        const value = index + 1;
        return (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            className={`rounded-full p-2 transition-all ${
              value <= rating ? "bg-primary text-on-primary" : "bg-surface-container"
            }`}
            aria-label={`${value} etoile${value > 1 ? "s" : ""}`}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: `'FILL' ${value <= rating ? 1 : 0}` }}
            >
              star
            </span>
          </button>
        );
      })}
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRequestError("");

    if (!form.name.trim()) {
      setRequestError("Udfyld venligst dit fulde navn.");
      return;
    }

    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setRequestError("Indtast venligst en gyldig e-mailadresse.");
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/quotes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          service: form.service,
          message: form.message.trim(),
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        setRequestError(body.message || "Kunne ikke sende din forespørgsel.");
        return;
      }

      setSubmitted(true);
      setForm({
        name: "",
        email: "",
        phone: "",
        service: "Anti-rouille Complet",
        message: "",
      });
    } catch (error) {
      console.error(error);
      setRequestError("Kan ikke kontakte serveren. Prøv igen senere.");
    }
  };

  const handleNewsletter = async (e) => {
    e.preventDefault();
    setNewsletterError("");

    const trimmedEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setNewsletterError("Indtast venligst en gyldig e-mailadresse.");
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/newsletter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: trimmedEmail,
          source: "Home Page",
        }),
      });

      if (!response.ok) {
        let errorMessage = "Kunne ikke registrere din tilmelding.";
        try {
          const errorData = await response.json();
          errorMessage = errorData?.message || errorMessage;
        } catch {
          const text = await response.text();
          if (text) errorMessage = text;
        }
        setNewsletterError(errorMessage);
        return;
      }

      setEmail("");
      setNewsletterSubmitted(true);
      setShowNewsletterModal(true);
    } catch (error) {
      console.error(error);
      setNewsletterError("Kan ikke kontakte serveren. Prøv igen senere.");
    }
  };

  const closeNewsletterModal = () => {
    setShowNewsletterModal(false);
  };

  const closeReviewModal = () => {
    setReviewState({
      isOpen: false,
      form: { ...emptyReviewForm },
      sent: false,
      error: "",
    });
  };

  const openReviewModal = () => {
    setReviewState({
      isOpen: true,
      form: { ...emptyReviewForm },
      sent: false,
      error: "",
    });
  };

  const updateReviewForm = (field, value) => {
    setReviewState((prev) => ({
      ...prev,
      form: {
        ...prev.form,
        [field]: value,
      },
    }));
  };

  const handleReviewModalClick = (e) => {
    e.stopPropagation();
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!reviewState.form.firstName.trim() || !reviewState.form.lastName.trim() || !reviewState.form.message.trim()) {
      setReviewState((prev) => ({ ...prev, error: "Udfyld venligst fornavn, efternavn og besked." }));
      return;
    }

    const name = `${reviewState.form.firstName.trim()} ${reviewState.form.lastName.trim()}`;

    try {
      const response = await fetch(`${apiBaseUrl}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          rating: reviewState.form.rating,
          message: reviewState.form.message,
        }),
      });

      if (!response.ok) {
        let errorMessage = `Erreur ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData?.message || errorMessage;
        } catch {
          const text = await response.text();
          if (text) errorMessage = text;
        }
        setReviewState((prev) => ({ ...prev, error: errorMessage }));
        return;
      }

      setReviewState((prev) => ({
        ...prev,
        form: { ...emptyReviewForm },
        isOpen: false,
        error: "",
      }));
      setReviewSent(true);
    } catch (error) {
      console.error(error);
      setReviewState((prev) => ({
        ...prev,
        error: "Kan ikke kontakte serveren. Prøv igen senere.",
      }));
    }
  };
  

  const allTestimonials = [...testimonials, ...testimonials];

  return (
    <div className="bg-background text-on-surface font-body-md overflow-x-hidden">
      <PublicHeader />

      {/* Hero Section */}
      <section
        className="relative min-h-[80vh] flex items-center overflow-hidden"
        id="accueil"
      >
        <div className="absolute inset-0 z-0">
          <img
            alt="Industrial automotive workshop background"
            className="w-full h-full object-cover brightness-[0.3]"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCb2tckyU66BUqW09htmMyvzZsP-yVu7w2YYKyUTgACMira3kIRhz8Ls8uXBi7-vEckkNst_0qa-fgwi5fxrBdheIF3t7urJC-QUZX6MurvvWb9x7C5mwNcJq5-ZcF-YHLgmk5Kt3B_CsZCcb2C_N8use4zdOBq0w8S4aUIrupzLZGns62TvqpN55do9YgHGCa7jPHI-O7WmjqE2Rl2abI8ax9kYsH7fi8PIIj8YMr3VCLqWtuFfAbNhQFScUPLchvm8Uc5v1d-mak"
          />
        </div>
        <div className="relative z-10 max-w-container-max mx-auto px-gutter w-full">
          <div className="max-w-3xl">
            <h1 className="text-white font-headline-xl text-headline-xl mb-md">
              Din lokale specialist i rustbeskyttelse og polering
            </h1>
            <p className="text-surface-dim font-body-lg text-body-lg mb-lg">
              Certificeret behandling, livstidsgaranti, over 30 års
              erfaring med at passe på dit køretøj.
            </p>
            <div className="flex flex-col sm:flex-row gap-md">
              <a
                href="/#devis"
                className="bg-primary-container text-on-primary font-label-bold text-label-bold px-lg py-md rounded-lg hover:brightness-110 transition-all duration-200 text-center"
              >
                Anmod om tilbud
              </a>
              <a
                href="#services"
                className="border-2 border-white text-white font-label-bold text-label-bold px-lg py-md rounded-lg hover:bg-white hover:text-on-surface transition-all duration-200 text-center"
              >
                Se tjenester
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-xl bg-surface-container-lowest" id="services">
        <div className="max-w-[1600px] mx-auto px-gutter">
          <div className="text-center mb-xl">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">
              Vores Premium-tjenester
            </h2>
            <div className="w-16 h-1 bg-primary mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            <div className="group flex h-full flex-col justify-between bg-surface-container-lowest p-lg rounded-lg border-2 border-transparent shadow-[0px_4px_12px_rgba(26,26,26,0.05)] hover:border-primary transition-all duration-300">
              <div className="w-12 h-12 bg-primary-fixed flex items-center justify-center rounded-lg mb-md text-primary">
                <span className="material-symbols-outlined text-[32px]">
                  shield
                </span>
              </div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-sm break-words">
                Komplet rustbehandling
              </h3>
              <p className="text-secondary font-body-md text-body-md mb-md break-words">
                Total beskyttelse af chassisets komponenter og hulrum mod saltkorrosion og fugt.
              </p>
              <a
                href="/anti-rouille"
                className="text-primary font-label-bold text-label-bold inline-flex flex-wrap items-center gap-xs"
              >
                LÆS MERE
                <span className="material-symbols-outlined">
                  arrow_forward
                </span>
              </a>
            </div>
            <div className="group flex h-full flex-col justify-between bg-surface-container-lowest p-lg rounded-lg border-2 border-transparent shadow-[0px_4px_12px_rgba(26,26,26,0.05)] hover:border-primary transition-all duration-300">
              <div className="w-12 h-12 bg-primary-fixed flex items-center justify-center rounded-lg mb-md text-primary">
                <span className="material-symbols-outlined text-[32px]">
                  science
                </span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-sm break-words">
                Vedligeholdelsesbehandling
              </h3>
              <p className="text-secondary font-body-md text-body-md mb-md break-words">
                Regelmæssig opdatering af din beskyttelse for at sikre maksimal holdbarhed.
              </p>
              <a
                href="/anti-rouille"
                className="text-primary font-label-bold text-label-bold inline-flex flex-wrap items-center gap-xs"
              >
                LÆS MERE
                <span className="material-symbols-outlined">
                  arrow_forward
                </span>
              </a>
            </div>
            <div className="group flex h-full flex-col justify-between bg-surface-container-lowest p-lg rounded-lg border-2 border-transparent shadow-[0px_4px_12px_rgba(26,26,26,0.05)] hover:border-primary transition-all duration-300">
              <div className="w-12 h-12 bg-primary-fixed flex items-center justify-center rounded-lg mb-md text-primary">
                <span className="material-symbols-outlined text-[32px]">
                  build
                </span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-sm break-words">
                Speciel behandling
              </h3>
              <p className="text-secondary font-body-md text-body-md mb-md break-words">
                Skræddersyede løsninger til ældre køretøjer, erhvervskøretøjer eller udstyr udsat for ekstreme forhold.
              </p>
              <a
                href="/anti-rouille"
                className="text-primary font-label-bold text-label-bold inline-flex flex-wrap items-center gap-xs"
              >
                LÆS MERE
                <span className="material-symbols-outlined">
                  arrow_forward
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Priser efter kategori */}
      <section className="py-xl bg-surface-container-lowest" id="priser">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="text-center mb-xl">
            <h2 className="font-headline-lg text-headline-lg text-on-surface">
              Priser efter kategori
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-lg">
            {[
              { title: "Lille bil", image: "Citadine.png", anti: "fra 299 kr.", polissage: "fra 149 kr." },
              { title: "Personbil", image: "Berline.png", anti: "fra 399 kr.", polissage: "fra 199 kr." },
              { title: "SUV / Stationcar", image: "SUV.png", anti: "fra 499 kr.", polissage: "fra 249 kr." },
              { title: "Erhvervskøretøj / 4x4", image: "Utilitaire.png", anti: "fra 599 kr.", polissage: "fra 299 kr." },
            ].map((item) => (
              <div
                key={item.title}
                className="group bg-white rounded-3xl overflow-hidden border border-outline-variant shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
              >
                <div className="h-56 bg-transparent rounded-t-3xl relative overflow-hidden">
                  <img
                    src={`/${item.image}`}
                    alt={item.title}
                    className="w-full h-full object-cover object-top bg-transparent"
                  />
                </div>
                <div className="p-lg">
                  <div className="min-h-[96px]">
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-sm break-words leading-tight">
                      {item.title}
                    </h3>
                  </div>
                  <div className="w-full border-t border-outline-variant my-4" />
                  <div className="grid gap-3 min-h-[96px]">
                    <div className="flex items-center justify-between pt-4 gap-4">
                      <span className="text-label-sm text-secondary uppercase tracking-[0.12em] min-w-0 break-words pr-4">
                        Rustbeskyttelse
                      </span>
                      <span className="font-label-bold text-label-bold text-primary flex-shrink-0 pr-6 text-right">
                        {item.anti}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-4 gap-4">
                      <span className="text-label-sm text-secondary uppercase tracking-[0.12em] min-w-0 break-words pr-4">
                        Polering
                      </span>
                      <span className="font-label-bold text-label-bold text-primary flex-shrink-0 pr-6 text-right">
                        {item.polissage}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before/After Sliders */}
      <section className="py-xl bg-[#1A1A1A]" id="galerie">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="text-center mb-xl">
                <h2 className="font-headline-lg text-headline-lg text-white mb-xs">
              Synlige resultater
            </h2>
            <p className="text-surface-dim font-body-md text-body-md">
              Sammenlign effekten af vores behandlinger
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
            <BeforeAfterSlider
              afterSrc="/screen.png"
              beforeSrc="/screenRust.png"
              afterAlt="Châssis traité contre la rouille"
              beforeAlt="Châssis avant traitement, rouillé"
              label="Anti-rouille"
            />
            <BeforeAfterSlider
              afterSrc="/after-2.png"
              beforeSrc="/before-2.png"
              afterAlt="Carrosserie polie après traitement"
              beforeAlt="Peinture terne avant polissage"
              beforeFilter="grayscale sepia"
              label="Polissage carrosserie"
            />
          </div>
        </div>
      </section>

      {/* Guarantee Section */}
      <section className="py-xl bg-[#F5F5F5]" id="garantie">
        <div className="max-w-container-max mx-auto px-gutter grid grid-cols-1 md:grid-cols-2 gap-xl items-center">
          <div>
            <span className="text-primary font-label-bold text-label-bold tracking-widest mb-base block">
              TOTAL TRYGHED
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-lg">
              Livstidsgaranti mod gennemtrængende rust
            </h2>
            <div className="space-y-md">
              <div className="flex items-start gap-md">
                <span
                  className="material-symbols-outlined text-primary fill-1"
                >
                  check_circle
                </span>
                <div>
                  <p className="font-label-bold text-label-bold">
                    Officiel SKJOLD-certificering
                  </p>
                  <p className="text-secondary text-body-md">
                    Dit køretøj er registreret i den europæiske SKJOLD-database.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-md">
                <span
                  className="material-symbols-outlined text-primary fill-1"
                >
                  check_circle
                </span>
                <div>
                  <p className="font-label-bold text-label-bold">
                    Gratis årlig opfølgning
                  </p>
                  <p className="text-secondary text-body-md">
                    Årlig inspektion af beskyttelsens tilstand.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-md">
                <span
                  className="material-symbols-outlined text-primary fill-1"
                >
                  check_circle
                </span>
                <div>
                  <p className="font-label-bold text-label-bold">
                    Øget gensalgsværdi
                  </p>
                  <p className="text-secondary text-body-md">
                    Garantien kan overføres til den nye ejer.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-8 border-primary border-dotted animate-[spin_20s_linear_infinite]"></div>
              <div className="w-56 h-56 md:w-72 md:h-72 bg-primary rounded-full flex flex-col items-center justify-center text-white text-center shadow-xl transform hover:scale-105 transition-transform duration-300">
                <span className="text-label-bold font-label-bold mb-xs">
                  SKJOLD BESKYTTELSE
                </span>
                  <span className="font-headline-xl text-[48px] leading-tight font-extrabold">
                  GARANTI
                  <br />LIVSTID
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        className="py-xl bg-surface-container-lowest overflow-hidden"
        id="testimonials"
      >
        <div className="max-w-container-max mx-auto px-gutter mb-xl text-center">
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">
            Hvad vores kunder siger om os
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto mb-lg"></div>
          
        </div>
        <div className="relative w-full">
          <div className="animate-infinite-scroll gap-lg px-gutter">
            {allTestimonials.map((t, idx) => (
              <div
                key={idx}
                className="flex flex-col gap-sm p-lg bg-background rounded-lg shadow-sm w-[350px] shrink-0 border border-surface-variant"
              >
                <div className="flex items-center gap-md mb-xs">
                  <img
                    alt={t.name}
                    className="w-12 h-12 rounded-lg object-cover"
                    src={t.avatar}
                  />
                  <div>
                    <p className="font-label-bold text-label-bold text-on-surface">
                      {t.name}
                    </p>
                    <StarRow rating={t.rating} />
                  </div>
                </div>
                <p className="text-on-surface font-body-md italic leading-relaxed">
                  "{t.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="text-center mt-5">
          {reviewSent ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-lg text-red-700 text-center inline-block">
              Tak! Din anmeldelse er sendt.
            </div>
          ) : (
            <button
              type="button"
              onClick={openReviewModal}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-lg py-md text-on-primary font-label-bold text-label-bold hover:brightness-110 transition-all duration-200"
            >
              Skriv en anmeldelse
            </button>
          )}
        </div>
      </section>

      {reviewState.isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={closeReviewModal}
        >
          <div
            className="w-full max-w-[420px] rounded-[24px] bg-surface-container p-4 shadow-[0_30px_70px_rgba(0,0,0,0.16)] max-h-[calc(100vh-64px)] overflow-y-auto"
            onClick={handleReviewModalClick}
          >
            <div className="flex flex-col gap-2 pb-3 border-b border-surface-variant mb-4">
              <div>
                <p className="text-primary font-label-bold text-label-bold">
                  Skriv en anmeldelse
                </p>
                <h2 className="font-headline-lg text-headline-lg text-on-surface">
                  Din oplevelse tæller
                </h2>
              </div>
              <button
                type="button"
                onClick={closeReviewModal}
                className="self-end rounded-full p-2 text-on-surface hover:bg-surface-variant transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            {reviewState.sent ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-lg text-red-700 text-center">
                <p className="font-label-bold text-label-bold mb-0">
                  Tak! Din anmeldelse er sendt. Vi kontakter dig snart.
                </p>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleReviewSubmit}>
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="font-label-bold text-label-bold text-on-surface mb-2 block">
                        Fornavn
                      </label>
                      <input
                        required
                        type="text"
                        value={reviewState.form.firstName}
                        onChange={(e) => updateReviewForm("firstName", e.target.value)}
                        placeholder="Dit fornavn"
                        className="w-full rounded-xl border border-on-surface px-4 py-3 outline-none transition-all focus:border-primary focus:ring-0"
                      />
                    </div>
                    <div>
                      <label className="font-label-bold text-label-bold text-on-surface mb-2 block">
                        Efternavn
                      </label>
                      <input
                        required
                        type="text"
                        value={reviewState.form.lastName}
                        onChange={(e) => updateReviewForm("lastName", e.target.value)}
                        placeholder="Dit efternavn"
                        className="w-full rounded-xl border border-on-surface px-4 py-3 outline-none transition-all focus:border-primary focus:ring-0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-label-bold text-label-bold text-on-surface mb-2 block">
                      Din vurdering
                    </label>
                    {renderStarInput(reviewState.form.rating, (rating) =>
                      updateReviewForm("rating", rating)
                    )}
                  </div>
                  <div>
                    <label className="font-label-bold text-label-bold text-on-surface mb-2 block">
                      Din besked
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={reviewState.form.message}
                      onChange={(e) => updateReviewForm("message", e.target.value)}
                      placeholder="Fortæl os om din oplevelse..."
                      className="w-full rounded-[24px] border border-on-surface px-4 py-3 outline-none transition-all focus:border-primary focus:ring-0"
                    />
                  </div>
                </div>
                {reviewState.error && (
                  <p className="text-negative font-body-md">{reviewState.error}</p>
                )}
                <div className="flex flex-col gap-sm sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="submit"
                    className="w-full sm:w-auto rounded-lg bg-primary px-lg py-md text-on-primary font-label-bold text-label-bold hover:brightness-110 transition-all duration-200"
                  >
                    Send min anmeldelse
                  </button>
                  <button
                    type="button"
                    onClick={closeReviewModal}
                    className="w-full sm:w-auto rounded-lg border border-on-surface px-lg py-md text-on-surface font-label-bold text-label-bold hover:bg-surface-container transition-all duration-200"
                  >
                    Annuller
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Contact Section */}
      <section className="py-xl bg-surface-container-lowest" id="devis">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-lg">
                Klar til at beskytte dit køretøj?
              </h2>
              {submitted ? (
                <div className="p-lg bg-primary-fixed rounded-lg text-on-primary-fixed-variant font-label-bold">
                  Tak! Din forespørgsel er sendt. Vi kontakter dig snart.
                </div>
              ) : (
                <form className="space-y-md" onSubmit={handleSubmit}>
                  <div>
                      <label className="font-label-bold text-label-bold text-on-surface mb-xs block">
                      Fulde navn
                    </label>
                    <input
                      className="w-full px-md py-sm border border-on-surface rounded-lg focus:border-2 focus:border-primary focus:ring-0 outline-none transition-all"
                        placeholder="Lars Hansen"
                      type="text"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-md">
                    <div>
                      <label className="font-label-bold text-label-bold text-on-surface mb-xs block">
                        E-mail
                      </label>
                      <input
                        className="w-full px-md py-sm border border-on-surface rounded-lg focus:border-2 focus:border-primary focus:ring-0 outline-none transition-all"
                        placeholder="lars@eksempel.dk"
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className="font-label-bold text-label-bold text-on-surface mb-xs block">
                        Telefon
                      </label>
                      <input
                        className="w-full px-md py-sm border border-on-surface rounded-lg focus:border-2 focus:border-primary focus:ring-0 outline-none transition-all"
                        placeholder="+45 20 12 34 56"
                        type="tel"
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-label-bold text-label-bold text-on-surface mb-xs block">
                      Køretøjstype / Ønsket service
                    </label>
                    <select
                      className="w-full px-md py-sm border border-on-surface rounded-lg focus:border-2 focus:border-primary focus:ring-0 outline-none transition-all"
                      value={form.service}
                      onChange={(e) =>
                        setForm({ ...form, service: e.target.value })
                      }
                    >
                      <option>Komplet rustbehandling</option>
                      <option>Bilpolering</option>
                      <option>Årlig vedligeholdelse</option>
                      <option>Anden service</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-label-bold text-label-bold text-on-surface mb-xs block">
                      Besked (valgfri)
                    </label>
                    <textarea
                      className="w-full px-md py-sm border border-on-surface rounded-lg focus:border-2 focus:border-primary focus:ring-0 outline-none transition-all"
                      placeholder="Detaljer om din forespørgsel..."
                      rows="4"
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                    ></textarea>
                  </div>
                  {requestError ? (
                    <p className="text-negative font-body-md">{requestError}</p>
                  ) : null}
                  <button
                    className="w-full bg-primary-container text-on-primary font-headline-md text-headline-md py-md rounded-lg hover:brightness-110 transition-all"
                    type="submit"
                  >
                    Send forespørgsel
                  </button>
                </form>
              )}
            </div>
            <div className="space-y-lg">
              <div className="aspect-video w-full rounded-lg overflow-hidden shadow-sm">
                <iframe
                  title="Garageplacering"
                  src="https://maps.google.com/maps?q=Fynsvej%2047,5500%20Middelfart&t=k&z=15&hl=da&gl=dk&output=embed"
                  allowFullScreen
                  loading="lazy"
                  className="w-full h-full border-0"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                <div className="space-y-sm">
                  <h4 className="font-headline-md text-headline-md">
                    Adresse
                  </h4>
                  <p className="text-secondary text-body-md">
                    Fynsvej 47
                    <br />
                    SKJOLD Garage Park
                    <br />
                    5500 Middelfart
                  </p>
                </div>
                <div className="space-y-sm">
                  <h4 className="font-headline-md text-headline-md">
                    Åbningstider
                  </h4>
                  <p className="text-secondary text-body-md">
                    Man - Tor: 07:30 - 16:00
                    <br />
                    Fre: 07:30 - 14:00
                    <br />
                    Lør - Søn: Lukket
                  </p>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-xl bg-[#F5F5F5]">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="flex flex-col md:flex-row items-center justify-between gap-lg bg-surface-container-lowest p-lg rounded-lg shadow-sm">
            <div className="max-w-xl">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-xs">
                Tilmeld dig vores nyhedsbrev
              </h2>
              <p className="text-secondary text-body-md">
                Modtag vores vedligeholdelsestips og eksklusive tilbud direkte i din indbakke.
              </p>
            </div>
            {newsletterSubmitted ? (
              <p className="font-label-bold text-primary">
                Tak for din tilmelding!
              </p>
            ) : (
              <form
                className="flex flex-col sm:flex-row w-full md:w-auto gap-sm"
                onSubmit={handleNewsletter}
              >
                <input
                  className="px-md py-sm border border-on-surface rounded-lg focus:border-2 focus:border-primary focus:ring-0 outline-none transition-all min-w-[280px]"
                  placeholder="Din e-mailadresse"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  className="bg-primary-container text-on-primary font-label-bold text-label-bold px-lg py-sm rounded-lg hover:brightness-110 active:scale-95 transition-all duration-200 shadow-sm whitespace-nowrap"
                  type="submit"
                >
                  Tilmeld
                </button>
              </form>
            )}
            {newsletterError ? (
              <p className="text-sm text-red-600 mt-2">{newsletterError}</p>
            ) : null}
            {showNewsletterModal ? (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-md">
                <div className="bg-white rounded-xl p-lg shadow-xl max-w-md w-full text-center">
                  <div className="flex justify-center mb-sm">
                    <span className="material-symbols-outlined text-primary text-[48px]">
                      check_circle
                    </span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-xs">
                    Tilmelding lykkedes
                  </h3>
                  <p className="text-secondary text-body-md mb-md">
                    Tak, din adresse er blevet registreret i vores nyhedsbrev.
                  </p>
                  <button
                    className="bg-primary-container text-on-primary font-label-bold text-label-bold px-lg py-sm rounded-lg hover:brightness-110 transition-all"
                    onClick={closeNewsletterModal}
                    type="button"
                  >
                    Luk
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
