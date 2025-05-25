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

    const ext = path.extname(file.originalname).toLowerCase(); // örn: .jpg
    const baseName = `profilePictures/${req.uid}`;
    const fileName = `${baseName}${ext}`;
    const fileRef = bucket.file(fileName);

    // ✅ Önceki formatlardaki dosyaları sil (.jpg, .jpeg, .png, .webp)
    const possibleExts = [".jpg", ".jpeg", ".png", ".webp"];
    await Promise.all(
      possibleExts.map(async (e) => {
        if (e !== ext) {
          const oldFile = bucket.file(`${baseName}${e}`);
          try {
            const [exists] = await oldFile.exists();
            if (exists) await oldFile.delete();
          } catch (err) {
            console.warn(`Silinemedi: ${baseName}${e}`, err.message);
          }
        }
      })
    );

    // 📤 Yeni dosyayı yükle
    await fileRef.save(file.buffer, {
      metadata: { contentType: file.mimetype },
    });

    // 🔗 URL oluştur
    const [url] = await fileRef.getSignedUrl({
      action: "read",
      expires: "03-01-2030",
    });

    // 🔄 Firestore güncelle (istenirse)
    await db.collection("users").doc(req.uid).set({ profileImage: url }, { merge: true });

    res.status(200).json({ url });
  } catch (err) {
    console.error("Fotoğraf yüklenemedi ❌", err);
    res.status(500).json({ message: "Fotoğraf yüklenemedi", error: err });
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
