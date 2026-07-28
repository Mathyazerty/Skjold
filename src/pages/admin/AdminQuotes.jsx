import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";

  const initialQuotes = [
  {
    id: 1,
    date: "24 Oct, 2023",
    name: "Morten Andersen",
    email: "m.andersen@email.dk",
    service: "Komplet beskyttelse",
    message: "Ønsker behandling til en Volvo XC90...",
    
  },
  {
    id: 2,
    date: "23 Oct, 2023",
    name: "Søren Nielsen",
    email: "soren@nielsen-arch.com",
    service: "Keramisk polering",
    message: "Prisforespørgsel for en flåde på 3 køretøjer.",
    
  },
  {
    id: 3,
    date: "22 Oct, 2023",
    name: "Freja Jensen",
    email: "freja.j@gmail.com",
    service: "Hulrumsinjektion",
    message: "Årlig kontrol påkrævet.",
    
  },
];


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

export default function AdminQuotes() {
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState(initialQuotes);
  const [search, setSearch] = useState("");
  const [quotesLoading, setQuotesLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

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
            data.map((q) => ({
              id: q.id,
              date: formatDate(q.created_at),
              name: q.nom || "Anonyme",
              email: q.email || "",
              service: q.service || "",
              message: q.message || "",
              
            }))
          );
        }
      } catch (error) {
        console.error("Erreur chargement devis :", error);
      } finally {
        setQuotesLoading(false);
      }
    };

    fetchQuotes();
  }, [navigate]);

 

  const requestDelete = (id) => {
    setDeleteTarget(id);
    setShowDeleteModal(true);
  };

  async function deleteQuote(id) {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Ikke autoriseret.");
      return false;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/admin/quotes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.message || "Kunne ikke slette forespørgslen.");
        return false;
      }

      setQuotes((qs) => qs.filter((q) => q.id !== id));
      return true;
    } catch (e) {
      console.error("Sletning af forespørgsel fejlede:", e);
      setError("Netværksfejl ved sletning af forespørgsel.");
      return false;
    }
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    const deleted = await deleteQuote(deleteTarget);
    if (deleted) {
      setShowDeleteModal(false);
      setDeleteTarget(null);
    }
  }

  const filtered = quotes.filter(
    (q) =>
      q.name.toLowerCase().includes(search.toLowerCase()) ||
      q.email.toLowerCase().includes(search.toLowerCase()) ||
      q.service.toLowerCase().includes(search.toLowerCase())
  );

  const topbar = (
    <header className="w-full top-0 sticky z-40 shadow-[0px_4px_12px_rgba(26,26,26,0.05)] bg-surface flex justify-between items-center px-md h-20 max-w-container-max mx-auto">
      <h2 className="font-headline-md text-headline-md font-bold text-primary">
        Forespørgsler på tilbud
      </h2>
      <div className="flex items-center gap-md">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
            search
          </span>
            <input
            className="pl-10 pr-4 py-2 bg-surface-container border-none rounded-lg focus:ring-2 focus:ring-primary w-64 font-body-md text-body-md outline-none"
            placeholder="Søg..."
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
      <div className="p-lg max-w-container-max mx-auto space-y-lg">
        <section className="bg-surface rounded-xl shadow-[0px_4px_12px_rgba(26,26,26,0.05)] overflow-hidden border border-outline-variant">
          <div className="p-md border-b border-outline-variant flex justify-between items-center">
            <h3 className="font-headline-md text-headline-md text-on-surface">
              Forespørgsler
            </h3>
            
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
                
                  <th className="px-md py-md font-label-bold text-label-bold text-secondary uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {filtered.map((q) => (
                  <tr key={q.id} className="table-row-hover transition-colors">
                    <td className="px-md py-md font-body-md text-body-md">
                      {q.date}
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
                    
                    <td className="px-md py-md text-right">
                      <div className="flex justify-end gap-xs">
                        <button
                          onClick={() => requestDelete(q.id)}
                          className="p-sm text-secondary hover:bg-surface-variant rounded-lg transition-colors"
                          title="Slet"
                        >
                          <span className="material-symbols-outlined">
                            delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                      <td
                      colSpan={6}
                      className="px-md py-lg text-center text-secondary font-body-md"
                    >
                      Ingen forespørgsler fundet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {error ? (
            <div className="mt-md rounded-lg border border-red-200 bg-red-50 p-md text-red-700">
              {error}
            </div>
          ) : null}
        </section>
      </div>
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h3 className="font-headline-md mb-2">Slet forespørgsel</h3>
            <p className="mb-4">Vil du slette denne forespørgsel permanent?</p>
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
