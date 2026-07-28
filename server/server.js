import express from "express";
import cors from "cors";
import { db } from "./db.js";
import { auth } from "./auth.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();
app.use(cors());
app.use(express.json());

const ensureSubscribersTable = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS subscribers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      source VARCHAR(100) DEFAULT 'Home Page',
      status VARCHAR(20) DEFAULT 'Active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
};

const ensureDevisTable = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS devis (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nom VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      telephone VARCHAR(50),
      service VARCHAR(255) NOT NULL,
      message TEXT,
      status VARCHAR(50) NOT NULL DEFAULT 'Nouveau',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
};

await ensureSubscribersTable();
await ensureDevisTable();

app.get("/", (req, res) => {
  res.send("API OK");
});

app.get("/api/admin/quotes", auth, async (req, res) => {
  const [rows] = await db.query("SELECT * FROM devis ORDER BY created_at DESC");
  res.json(rows);
});

app.get("/api/admin/subscribers", auth, async (req, res) => {
  const [rows] = await db.query("SELECT * FROM subscribers ORDER BY created_at DESC");
  res.json(rows);
});

app.get("/api/admin/reviews", auth, async (req, res) => {
  const [rows] = await db.query("SELECT * FROM avis ORDER BY created_at DESC");
  res.json(rows);
});

app.delete("/api/admin/reviews/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("DELETE FROM avis WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Anmeldelse ikke fundet" });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: "Kunne ikke slette anmeldelsen" });
  }
});

app.delete("/api/admin/quotes/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("DELETE FROM devis WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Forespørgsel ikke fundet" });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: "Kunne ikke slette forespørgslen" });
  }
});

app.delete("/api/admin/subscribers/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("DELETE FROM subscribers WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Abonnent ikke fundet" });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: "Kunne ikke slette abonnenten" });
  }
});

app.post("/api/reviews", async (req, res) => {
  const { name, rating, message } = req.body;

  if (!name || typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ success: false, message: "Angiv venligst et gyldigt navn." });
  }

  if (!message || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ success: false, message: "Angiv venligst en besked." });
  }

  try {
    await db.query(
      "INSERT INTO avis (`nom`, `note`, `message`) VALUES (?, ?, ?)",
      [name.trim(), rating || 5, message.trim()]
    );

    res.status(201).json({ success: true, message: "Anmeldelse gemt." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Kunne ikke gemme anmeldelsen." });
  }
});

app.post("/api/newsletter", async (req, res) => {
  const email = String(req.body?.email || "").trim().toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: "Angiv venligst en gyldig e-mailadresse." });
  }

  try {
    await db.query("INSERT IGNORE INTO subscribers (email) VALUES (?)", [email]);
    res.status(201).json({ success: true, message: "Tilmelding registreret." });
  } catch (error) {
    console.error("Newsletter save failed:", error);
    res.status(500).json({ success: false, message: "Kunne ikke registrere din tilmelding lige nu." });
  }
});

app.post("/api/quotes", async (req, res) => {
  const name = String(req.body?.name || "").trim();
  const email = String(req.body?.email || "").trim();
  const phone = String(req.body?.phone || "").trim();
  const service = String(req.body?.service || "").trim();
  const message = String(req.body?.message || "").trim();

  if (!name) {
    return res.status(400).json({ success: false, message: "Angiv venligst et navn." });
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: "Angiv venligst en gyldig e-mailadresse." });
  }

  if (!service) {
    return res.status(400).json({ success: false, message: "Angiv venligst en service." });
  }

  try {
    await db.query(
      "INSERT INTO devis (`nom`, `email`, `telephone`, `service`, `message`) VALUES (?, ?, ?, ?, ?)",
      [name, email, phone, service, message]
    );
    res.status(201).json({ success: true, message: "Forespørgsel registreret." });
  } catch (error) {
    console.error("Quote save failed:", error);
    res.status(500).json({ success: false, message: "Kunne ikke registrere forespørgslen." });
  }
});

app.post("/api/admin/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM admin WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: "Forkert e-mail" });
    }

    const admin = rows[0];
    const isValid = await bcrypt.compare(password, admin.password);

    if (!isValid) {
      return res.status(401).json({ success: false, message: "Forkert adgangskode" });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      "SECRET_KEY_CHANGE_ME",
      { expiresIn: "2h" }
    );

    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, message: "Serverfejl" });
  }
});

app.listen(3000, () => {
  console.log("API running on http://localhost:3000");
});

