const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const admin = require("firebase-admin");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" })); // veya ihtiyacına göre 5mb, 10mb vs.

const serviceAccount = require("./firebaseServiceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// ✅ Middleware: Kullanıcı token’ını doğrula
const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Yetkisiz erişim" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = await admin.auth().verifyIdToken(token);
        req.uid = decoded.uid; // 🔑 UID artık her endpointte erişilebilir
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token geçersiz" });
    }
};

// ✅ CV kaydetme endpoint’i
app.post("/api/cv", authenticate, async (req, res) => {
    const cvData = req.body;

    try {
        const ref = db.collection("users").doc(req.uid).collection("cvs").doc("main");
        await ref.set({ ...cvData, updatedAt: new Date() }, { merge: true });
        return res.status(200).json({ message: "CV kaydedildi ✅" });
    } catch (error) {
        return res.status(500).json({ message: "CV kaydedilemedi ❌", error });
    }
});

// ✅ CV verisini getirme endpoint’i
app.get("/api/cv", authenticate, async (req, res) => {
    try {
        const ref = db.collection("users").doc(req.uid).collection("cvs").doc("main");
        const docSnap = await ref.get();

        if (!docSnap.exists) {
            return res.status(404).json({ message: "CV verisi bulunamadı" });
        }

        return res.status(200).json(docSnap.data());
    } catch (error) {
        return res.status(500).json({ message: "CV verisi alınamadı ❌", error });
    }
});

app.get("/", (req, res) => {
  res.send("NextStepCV Backend çalışıyor ✅");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend çalışıyor: http://localhost:${PORT}`));
