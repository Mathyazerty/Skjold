import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AdminSubscribers() {
  const navigate = useNavigate();
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const apiBaseUrl = import.meta.env.VITE_API_URL || "https://skjold-production-f44f.up.railway.app";

  // Data til siden med nyhedsbrev-abonnenter

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    const fetchSubscribers = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/admin/subscribers`, {
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
          setError("Kan ikke indlæse abonnenter.");
          return;
        }

        setSubscribers(
          data.map((subscriber, index) => ({
            id: subscriber.id ?? `${subscriber.email}-${index}`,
            email: subscriber.email || "",
            date: formatDate(subscriber.created_at),
          }))
        );
      } catch (err) {
        console.error("Fejl ved indlæsning af abonnenter:", err);
        setError("Netværksfejl ved indlæsning af abonnenter.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribers();
  }, [apiBaseUrl, navigate]);

  const requestDelete = (id) => {
    setDeleteTarget(id);
    setShowDeleteModal(true);
  };

  async function deleteSubscriber(id) {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Ikke autoriseret.");
      return false;
    }

    try {
      const res = await fetch(`${apiBaseUrl}/api/admin/subscribers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.message || "Kunne ikke slette abonnenten.");
        return false;
      }

      setSubscribers((subs) => subs.filter((s) => s.id !== id));
      return true;
    } catch (err) {
      console.error("Sletning af abonnent fejlede:", err);
      setError("Netværksfejl ved sletning af abonnent.");
      return false;
    }
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    const deleted = await deleteSubscriber(deleteTarget);
    if (deleted) {
      setShowDeleteModal(false);
      setDeleteTarget(null);
    }
  }

  const filtered = subscribers.filter((s) =>
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  const topbar = (
    <header className="w-full top-0 sticky z-40 shadow-[0px_4px_12px_rgba(26,26,26,0.05)] bg-surface flex justify-between items-center px-md h-20 max-w-container-max mx-auto">
      <h2 className="font-headline-md text-headline-md font-bold text-primary">
        Nyhedsbrev-abonnenter
      </h2>

      <div className="flex items-center gap-md">
        <div className="relative w-full max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
            search
          </span>
          <input
            className="w-full pl-10 pr-4 py-2 bg-surface-container border-none rounded-lg focus:ring-2 focus:ring-primary text-body-md font-body-md outline-none"
            placeholder="Søg abonnenter..."
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => {}}
            onBlur={() => {}}
          />
        </div>
      </div>
    </header>
  );

  return (
    <AdminLayout topbar={topbar}>
      <section className="p-xl max-w-7xl mx-auto w-full">

        {error ? (
          <div className="mb-md rounded-lg border border-red-200 bg-red-50 p-md text-red-700">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="mb-md rounded-lg border border-outline-variant bg-surface-container-lowest p-md text-secondary">
              Indlæser abonnenter...
            </div>
        ) : null}

        {/* Tableau principal des abonnés */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-[0px_4px_12px_rgba(26,26,26,0.05)] overflow-hidden">
              <div className="px-md py-4 border-b border-outline-variant flex justify-between items-center bg-white">
            <div className="flex items-center gap-md">
              
              <span className="font-headline-md text-headline-md text-on-surface">
                Abonnenter: {subscribers.length}
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-low">
                <tr>
                  <th className="px-md py-4 font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider">
                    E-mailadresse
                  </th>
                  <th className="px-md py-4 font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider">
                    Tilmeldingsdato
                  </th>
                  
                  <th className="px-md py-4 font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider text-right">
                    Handlinger
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {filtered.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-surface-container-low transition-colors group"
                  >
                    <td className="px-md py-4 font-body-md text-body-md font-semibold text-on-surface">
                      {s.email}
                    </td>
                    <td className="px-md py-4 font-body-md text-body-md text-secondary">
                      {s.date}
                    </td>
                    <td className="px-md py-4 text-right flex justify-end gap-2">
                      <button
                        onClick={() => requestDelete(s.id)}
                        className="p-2 text-secondary hover:text-primary transition-colors"
                        title="Slet"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
            
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-md py-lg text-center text-secondary font-body-md"
                    >
                      Ingen abonnenter fundet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h3 className="font-headline-md mb-2">Slet abonnent</h3>
            <p className="mb-4">Vil du slette denne abonnent permanent?</p>
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
