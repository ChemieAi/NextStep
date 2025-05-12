const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const admin = require("firebase-admin");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Firebase Admin SDK başlatılıyor
const serviceAccount = require("./firebaseServiceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET, // opsiyonel
});

const db = admin.firestore();

// ✅ Test endpoint
app.get("/", (req, res) => {
  res.send("NextStepCV Backend çalışıyor 🚀");
});

// ✅ Örnek güvenli endpoint (kullanıcı doğrulamalı)
app.get("/secure-data", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Yetkisiz istek" });
  }

  const idToken = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Örnek: Firestore'dan veri çekme
    const userDoc = await db.doc(`users/${uid}`).get();
    return res.json({ uid, userData: userDoc.data() || null });
  } catch (error) {
    return res.status(401).json({ error: "Geçersiz token" });
  }
});

// Sunucuyu başlat
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend sunucusu ${PORT} portunda çalışıyor 🔥`);
});
