import { useState, useEffect } from "react";
import AdminLayout from "../../components/AdminLayout";

function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value).slice(0, 10);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear());
  return `${day}/${month}/${year}`;
}

function StarRow({ rating }) {
  return (
    <div className="flex text-primary gap-0.5 mt-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className="material-symbols-outlined"
          style={{ fontVariationSettings: `'FILL' ${i < rating ? 1 : 0}` }}
        >
          star
        </span>
      ))}
    </div>
  );
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return; // if not logged in, admin layout will redirect elsewhere

    const fetchReviews = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/admin/reviews", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          setError("Fejl ved indlæsning af anmeldelser.");
          setLoading(false);
          return;
        }

        const data = await res.json();
        if (!Array.isArray(data)) {
          setError("Ugyldigt svar fra serveren.");
          setLoading(false);
          return;
        }

        setReviews(
          data.map((r, i) => ({
            id: r.id ?? `${r.nom}-${i}`,
            name: r.nom || "Anonyme",
            avatar: r.avatar || null,
            rating: Number(r.note) || 0,
            date: r.created_at || null,
            text: r.message || "",
            location: r.location || null,
            certified: !!r.certified,
          }))
        );
      } catch (e) {
        console.error("fetch admin reviews failed", e);
        setError("Netværksfejl ved indlæsning af anmeldelser.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  

  const dismiss = (id) => {
    // open modal to confirm deletion
    requestDelete(id);
  };

  async function deleteReview(id) {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Ikke autoriseret.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/admin/reviews/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.message || "Kunne ikke slette anmeldelsen.");
        return;
      }

      // remove from UI
      setReviews((rs) => rs.filter((r) => r.id !== id));
    } catch (e) {
      console.error("delete review failed", e);
      setError("Netværksfejl ved sletning.");
    }
  }

  function requestDelete(id) {
    setDeleteTarget(id);
    setShowDeleteModal(true);
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    await deleteReview(deleteTarget);
    setShowDeleteModal(false);
    setDeleteTarget(null);
  }

  const filtered = reviews.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.text.toLowerCase().includes(search.toLowerCase())
  );

  const topbar = (
    <header className="w-full top-0 sticky z-40 shadow-[0px_4px_12px_rgba(26,26,26,0.05)] bg-surface flex justify-between items-center px-md h-20 max-w-container-max mx-auto">
      <h2 className="font-headline-md text-headline-md font-bold text-primary">
        Kundeanmeldelser
      </h2>
      <div className="flex items-center gap-md">
        <div className="relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-secondary">
            <span className="material-symbols-outlined">search</span>
          </span>
            <input
            className="pl-10 pr-4 py-2 bg-surface-container border-none rounded-lg focus:ring-2 focus:ring-primary w-64 font-body-md text-body-md"
            placeholder="Søg anmeldelser..."
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

    </header>
  );

  return (
    <AdminLayout topbar={topbar}>
      <div className="p-xl flex-grow">
        <div className="max-w-container-max mx-auto">
        

          <div className="grid grid-cols-1 gap-gutter">
            {filtered.map((r) => (
              <div
                key={r.id}
                className="review-card bg-surface-container-lowest p-md border-2 border-transparent shadow-[0px_4px_12px_rgba(26,26,26,0.05)] rounded-lg"
              >
                <div className="flex justify-between items-start mb-md">
                  <div className="flex gap-md">
                      {r.avatar ? (
                        <img
                          alt={r.name}
                          className="w-14 h-14 rounded-full object-cover"
                          src={r.avatar}
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-primary">
                          {getInitials(r.name)}
                        </div>
                      )}
                    <div>
                      <h3 className="font-headline-md text-headline-md text-on-surface">
                        {r.name}
                      </h3>
                      <StarRow rating={r.rating} />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-label-sm text-label-sm text-secondary mb-xs">
                      {formatDate(r.date)}
                    </p>
                  </div>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant mb-lg italic whitespace-pre-wrap break-words leading-relaxed">
                  "{r.text}"
                </p>
                <div className="flex justify-end items-center pt-md border-t border-outline-variant">
                  <button
                    onClick={() => requestDelete(r.id)}
                    className="flex items-center gap-xs text-secondary font-label-bold text-label-bold hover:text-error"
                  >
                    <span className="material-symbols-outlined">delete</span>
                    Slet
                  </button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-xl text-secondary font-body-md">
                Ingen anmeldelser fundet.
              </div>
            )}
          </div>
        </div>
      </div>
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-surface p-6 rounded-lg w-full max-w-md">
            <h3 className="font-headline-md mb-2">Slet anmeldelse</h3>
            <p className="mb-4">Vil du slette denne anmeldelse permanent?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteTarget(null);
                }}
                className="px-4 py-2 rounded-lg border"
              >
                Annuller
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-lg bg-error text-white"
              >
                Slet
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
