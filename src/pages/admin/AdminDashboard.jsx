import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";

const placeholderReviews = [
  {
    initials: "EJ",
    name: "Erik Johansen",
    rating: 5,
    text: "Fremragende præcision. Min bil føles som ny efter PAVA-behandling. Anbefales kraftigt!",
  },
  {
    initials: "AM",
    name: "Anette Madsen",
    rating: 4,
    text: "Meget professionel. Tilbuddet var klart, og arbejdet blev udført til tiden. Et pålideligt sted at beskytte dit køretøj.",
  },
  {
    initials: "TH",
    name: "Thomas Holm",
    rating: 5,
    text: "Keramisk polering er fantastisk. Glansen er dyb, og vand perler perfekt. Tak til teamet.",
  },
];

function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("da-DK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}


function getFilterStartDate(period) {
  const now = new Date();
  if (period === "week") {
    const day = now.getDay();
    const daysSinceMonday = (day + 6) % 7;
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - daysSinceMonday);
    return start;
  }

  if (period === "month") {
    return new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  }

  if (period === "last30") {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - 29);
    return start;
  }

  return null;
}

function parseFilterDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function isInPeriod(value, period) {
  if (period === "all") return true;
  const date = parseFilterDate(value);
  if (!date) return false;
  const start = getFilterStartDate(period);
  if (!start) return true;
  const now = new Date();
  now.setHours(23, 59, 59, 999);
  return date >= start && date <= now;
}

function filterByPeriod(items, period, dateKey = "date") {
  return items.filter((item) => isInPeriod(item[dateKey], period));
}

function sortQuotes(quotes, sortKey, dateKey = "date") {
  return [...quotes].sort((a, b) => {
    const aDate = parseFilterDate(a[dateKey]);
    const bDate = parseFilterDate(b[dateKey]);

    if (sortKey === "dateAsc") {
      return (aDate?.getTime() || 0) - (bDate?.getTime() || 0);
    }

    return (bDate?.getTime() || 0) - (aDate?.getTime() || 0);
  });
}

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

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState([]);
  const [quotesLoading, setQuotesLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [subscribersPreview, setSubscribersPreview] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState("");
  const [periodFilter, setPeriodFilter] = useState("last30");
  const [quoteSort, setQuoteSort] = useState("dateDesc");

  // Données de la section "Demandes de devis"

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    const fetchQuotes = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/admin/quotes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          localStorage.removeItem("token");
          navigate("/admin/login");
          return;
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          setQuotes(
            data.map((quote) => ({
              id: quote.id,
              name: quote.nom || "Anonyme",
              email: quote.email || "",
              service: quote.service || "",
              message: quote.message || "",
              rawDate: quote.created_at,
              date: quote.created_at,
            }))
          );
        }
      } catch (error) {
        console.error("Erreur lors du chargement des devis :", error);
      } finally {
        setQuotesLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/admin/reviews", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          localStorage.removeItem("token");
          navigate("/admin/login");
          return;
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          setReviewsError("Kan ikke indlæse anmeldelser.");
          return;
        }

        setReviews(
          data.map((review, index) => ({
            id: review.id ?? `${review.nom}-${index}`,
            initials: getInitials(review.nom),
            name: review.nom || "Anonyme",
            rating: Number(review.note) || 0,
            text: review.message || "",
            rawDate: review.created_at,
            date: formatDate(review.created_at),
          }))
        );
      } catch (error) {
        console.error("Fejl ved indlæsning af anmeldelser:", error);
        setReviewsError("Netværksfejl ved indlæsning af anmeldelser.");
      } finally {
        setReviewsLoading(false);
      }
    };

    const fetchSubscribers = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/admin/subscribers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          return;
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          return;
        }

        setSubscribersPreview(
          data.slice(0, 3).map((subscriber, index) => ({
            id: subscriber.id ?? `${subscriber.email}-${index}`,
            email: subscriber.email || "",
            rawDate: subscriber.created_at,
          }))
        );
      } catch (error) {
        console.error("Fejl ved indlæsning af abonnenter:", error);
      }
    };

    fetchQuotes();
    fetchReviews();
    fetchSubscribers();
  }, [navigate]);

  // Actions simples pour la gestion des devis
  const markTreated = (id) => {
    setQuotes((qs) =>
      qs.map((q) => (q.id === id ? { ...q, status: "Traité" } : q))
    );
  };

  const filteredQuotes = sortQuotes(
    filterByPeriod(quotes, periodFilter, "rawDate"),
    quoteSort,
    "rawDate"
  );

  const filteredReviews = filterByPeriod(reviews, periodFilter, "rawDate");
  const displayedReviews = reviewsLoading ? placeholderReviews : filteredReviews;

  const filteredSubscribers = filterByPeriod(subscribersPreview, periodFilter, "rawDate");
  const previewSubscribers = filteredSubscribers.slice(0, 3);

  const periodLabels = {
    last30: "Sidste 30 dage",
    week: "Denne uge",
    month: "Denne måned",
    all: "Vis alle",
  };

  const topbar = (
    <header className="w-full top-0 sticky z-40 shadow-[0px_4px_12px_rgba(26,26,26,0.05)] bg-surface flex justify-between items-center px-md h-20 max-w-container-max mx-auto">
      <h2 className="font-headline-md text-headline-md font-bold text-primary">
        Kontrolpanel
      </h2>
      <div className="flex items-center gap-md">
        <label className="flex items-center gap-xs px-md py-sm bg-surface-container rounded-lg font-label-bold text-label-bold text-on-surface-variant border border-transparent hover:border-outline transition-all cursor-pointer">
          <span className="material-symbols-outlined">calendar_today</span>
          <select
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value)}
            className="bg-transparent outline-none text-left text-label-bold appearance-none cursor-pointer"
          >
            <option value="week">Denne uge</option>
            <option value="last30">Sidste 30 dage</option>
            <option value="all">Vis alle</option>
          </select>
          <span className="material-symbols-outlined">expand_more</span>
        </label>
        
      </div>
    </header>
  );

  return (
    <AdminLayout topbar={topbar}>
      <div className="p-lg max-w-container-max mx-auto space-y-lg">
        {/* Section principale : demandes de devis */}
        <section className="bg-surface rounded-xl shadow-[0px_4px_12px_rgba(26,26,26,0.05)] overflow-hidden border border-outline-variant">
          <div className="p-md border-b border-outline-variant space-y-md">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-sm">
              <h3 className="font-headline-md text-headline-md text-on-surface">
                Forespørgsler
              </h3>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th className="px-md py-md font-label-bold text-label-bold text-secondary uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-md py-md font-label-bold text-label-bold text-secondary uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-md py-md font-label-bold text-label-bold text-secondary uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-md py-md font-label-bold text-label-bold text-secondary uppercase tracking-wider">
                    Message
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {filteredQuotes.map((q) => (
                  <tr key={q.id} className="table-row-hover transition-colors">
                    <td className="px-md py-md font-body-md text-body-md">
                      {formatDate(q.date)}
                    </td>
                    <td className="px-md py-md">
                      <div className="flex flex-col">
                        <span className="font-label-bold text-label-bold text-on-surface">
                          {q.name}
                        </span>
                        <span className="font-label-sm text-label-sm text-secondary">
                          {q.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-md py-md font-body-md text-body-md">
                      {q.service}
                    </td>
                    <td className="px-md py-md font-body-md text-body-md max-w-xs whitespace-normal break-words align-top">
                      {q.message}
                    </td>
                  </tr>
                ))}
                {filteredQuotes.length === 0 && (
                  <tr>
                      <td colSpan={4} className="px-md py-lg text-center text-secondary font-body-md">
                      Ingen forespørgsler i øjeblikket.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Colonnes secondaires : newsletter et avis clients */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg items-start">
          {/* Bloc newsletter */}
          <section className="lg:col-span-1 bg-surface rounded-xl shadow-[0px_4px_12px_rgba(26,26,26,0.05)] border border-outline-variant h-full">
            <div className="p-md border-b border-outline-variant">
              <h3 className="font-headline-md text-headline-md text-on-surface">
                Nyhedsbrev
              </h3>
            </div>
            <div className="p-md space-y-md">
              {previewSubscribers.length > 0 ? (
                previewSubscribers.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-sm bg-surface-container-low rounded-lg border border-outline-variant"
                  >
                    <div className="flex flex-col">
                      <span className="font-label-bold text-label-bold">
                        {s.email}
                      </span>
                      <span className="font-label-sm text-label-sm text-secondary">
                        Tilmeldt {formatDate(s.rawDate)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-secondary">
                  Ingen abonnenter registreret i øjeblikket.
                </p>
              )}
              
            </div>
          </section>

          {/* Bloc avis clients */}
          <section className="lg:col-span-2 space-y-md">
            <div className="flex justify-between items-center">
              <h3 className="font-headline-md text-headline-md text-on-surface">
                Seneste kundeanmeldelser
              </h3>
              
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              {displayedReviews.map((r) => (
                <div
                  key={r.id ?? r.name}
                  className="bg-surface p-md rounded-xl shadow-[0px_4px_12px_rgba(26,26,26,0.05)] border border-outline-variant relative overflow-hidden group hover:border-primary transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-sm">
                    <div className="flex items-center gap-sm">
                      <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-primary">
                        {r.initials}
                      </div>
                      <span className="font-label-bold text-label-bold">
                        {r.name}
                      </span>
                    </div>
                    <StarRow rating={r.rating} />
                  </div>
                  {r.date && (
                    <p className="font-label-sm text-label-sm text-secondary mb-sm">
                      {r.date}
                    </p>
                  )}
                  <p className="font-body-md text-body-md text-secondary italic whitespace-pre-wrap break-words leading-relaxed">
                    "{r.text}"
                  </p>
                </div>
              ))}
            </div>
            {reviewsError && (
              <div className="text-center py-xl text-error font-label-bold">
                {reviewsError}
              </div>
            )}
            {filteredReviews.length === 0 && !reviewsLoading && (
                <div className="text-center py-xl text-secondary font-body-md">
                Ingen kundeanmeldelser fundet.
              </div>
            )}
          </section>
        </div>
      </div>
    </AdminLayout>
  );
}
