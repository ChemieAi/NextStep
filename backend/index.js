const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const admin = require("firebase-admin");
const multer = require("multer");
const { getStorage } = require("firebase-admin/storage");
const path = require("path");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" })); // veya ihtiyacına göre 5mb, 10mb vs.
app.use(express.urlencoded({ extended: true }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1 * 1024 * 1024 }, // 1MB sınırı
});

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});


const bucket = getStorage().bucket();
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
// ✅ Profil fotoğrafı yükleme endpoint’i
app.post("/api/profile-image", authenticate, upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "Dosya eksik" });

    const userRef = db.collection("users").doc(req.uid);

    // 1️⃣ Storage'daki tüm eski dosyaları (her uzantıdan) sil
    const [files] = await bucket.getFiles({ prefix: `profilePictures/${req.uid}` });
    await Promise.all(
      files.map(file => file.delete().catch(() => {}))
    );

    // 2️⃣ Yeni dosya adı oluştur
    const ext = path.extname(file.originalname);
    const fileName = `profilePictures/${req.uid}${ext}`;
    const fileRef = bucket.file(fileName);

    await fileRef.save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
      },
    });

    const [url] = await fileRef.getSignedUrl({
      action: "read",
      expires: "03-01-2030",
    });

    // 3️⃣ Firestore'a güncelle
    await userRef.set({ profileImage: url }, { merge: true });

    res.status(200).json({ url });
  } catch (err) {
    console.error("Fotoğraf yüklenemedi ❌", err);
    res.status(500).json({ message: "Fotoğraf yüklenemedi", error: err });
  }
});

// ✅ Profil fotoğrafını silme endpoint’i
app.delete("/api/profile-image", authenticate, async (req, res) => {
  try {
    const userRef = db.collection("users").doc(req.uid);

    // 🔍 Firestore'dan eski URL'yi al
    const userSnap = await userRef.get();
    const existingUrl = userSnap.exists ? userSnap.data().profileImage : null;

    if (existingUrl) {
      // ✅ Dosya adını URL’den çıkart
      const decodedUrl = decodeURIComponent(existingUrl);
      const match = decodedUrl.match(/profilePictures\/(.+?)\?/);
      
      if (match) {
        const filePath = `profilePictures/${match[1]}`;
        await bucket.file(filePath).delete().catch(() => { }); // yoksa da hata vermesin
      }
    }

    // 🔁 Firestore'dan alanı sil
    await userRef.update({ profileImage: admin.firestore.FieldValue.delete() });

    res.status(200).json({ message: "Fotoğraf silindi ✅" });
  } catch (error) {
    console.error("Fotoğraf silinemedi ❌", error);
    res.status(500).json({ message: "Fotoğraf silinemedi ❌" });
  }
});

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
