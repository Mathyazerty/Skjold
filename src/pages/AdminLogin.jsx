import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  // Formulaire de connexion à l'administration
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Login-fejl");
        setLoading(false);
        return;
      }

      // Sauvegarder le token dans localStorage
      localStorage.setItem("token", data.token);
      
      // Naviguer au dashboard
      navigate("/admin/dashboard");
    } catch (err) {
      setError("Netværksfejl: " + err.message);
      setLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col min-h-screen relative"
      style={{ backgroundColor: "#F5F5F5", fontFamily: "'Inter', sans-serif" }}
    >
      {/* Arrière-plan décoratif de la page login */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(#1A1A1A 0.5px, transparent 0.5px)",
            backgroundSize: "24px 24px",
          }}
        ></div>
        <div className="absolute bottom-[-10%] right-[-5%] font-black text-on-surface opacity-[0.02] text-[20vw] leading-none select-none">
          SKJOLD
        </div>
      </div>

      <main className="flex-grow flex items-center justify-center px-md py-xl">
        <div className="w-full max-w-[440px] bg-surface-container-lowest login-card-shadow border border-surface-variant p-lg flex flex-col gap-lg">
          {/* Bloc identité du panneau admin */}
          <div className="flex flex-col items-center gap-sm">
            <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-base">
              <span
                className="material-symbols-outlined text-white text-[32px] fill-1"
              >
                shield
              </span>
            </div>
            <h1 className="font-headline-md text-headline-md text-on-surface">
              SKJOLD Admin
            </h1>
            <p className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">
              Administratorpanel
            </p>
          </div>

          {/* Formulaire de connexion */}
          <form className="flex flex-col gap-md" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-xs">
                <label
                className="font-label-bold text-label-bold transition-colors"
                style={{ color: emailFocused ? "#9e0000" : "#1a1c1c" }}
                htmlFor="email"
              >
                E-mail
              </label>
              <input
                className="w-full px-md py-sm border border-on-surface bg-white focus:ring-0 focus:border-primary transition-all duration-200 outline-none font-body-md text-body-md"
                id="email"
                name="email"
                placeholder="admin@skjold.dk"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
              />
            </div>
            <div className="flex flex-col gap-xs">
              <div className="flex justify-between items-center">
                <label
                  className="font-label-bold text-label-bold transition-colors"
                  style={{ color: passwordFocused ? "#9e0000" : "#1a1c1c" }}
                  htmlFor="password"
                >
                  Adgangskode
                </label>
                
              </div>
              <input
                className="w-full px-md py-sm border border-on-surface bg-white focus:ring-0 focus:border-primary transition-all duration-200 outline-none font-body-md text-body-md"
                id="password"
                name="password"
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
              />
            </div>
            {error && (
              <div className="bg-error-container text-on-error-container p-md rounded-lg font-body-sm text-body-sm">
                {error}
              </div>
            )}
            <button
              className="w-full bg-primary-container text-on-primary font-label-bold text-label-bold py-md px-lg hover:bg-primary transition-all duration-200 ease-in-out active:scale-[0.98] mt-sm disabled:opacity-50"
              type="submit"
              disabled={loading}
            >
              {loading ? "Logger ind..." : "Log ind"}
            </button>
          </form>

          <div className="flex items-center justify-center gap-sm pt-md border-t border-surface-variant">
            
            
          </div>
        </div>
      </main>
    </div>
  );
}
