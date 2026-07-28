import jwt from "jsonwebtoken";

export function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Token manquant" });
  }

  try {
    const decoded = jwt.verify(token, "SECRET_KEY_CHANGE_ME");
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Token invalide" });
  }
}
