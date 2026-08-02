import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AntiRouille from "./pages/AntiRouille";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminQuotes from "./pages/admin/AdminQuotes";
import AdminSubscribers from "./pages/admin/AdminSubscribers";
import AdminReviews from "./pages/admin/AdminReviews";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import LegalNotice from "./pages/LegalNotice";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/anti-rouille" element={<AntiRouille />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/legal-notice" element={<LegalNotice />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/quotes" element={<AdminQuotes />} />
        <Route path="/admin/subscribers" element={<AdminSubscribers />} />
        <Route path="/admin/reviews" element={<AdminReviews />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
