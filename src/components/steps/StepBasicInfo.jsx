import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase"; // Firestore importu

const StepBasicInfo = ({ data, setData }) => {
  const { currentUser } = useAuth();
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !currentUser) return;
    setUploading(true);
  
    const storageRef = ref(storage, `profilePictures/${currentUser.uid}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
  
    // 1. Form state güncelle
    setData({ ...data, profileImage: downloadURL });
  
    // 2. Firestore'a da kaydet (users koleksiyonuna)
    await setDoc(
      doc(db, "users", currentUser.uid),
      { profileImage: downloadURL },
      { merge: true }
    );
  
    setUploading(false);
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* Profil resmi alanı */}
      <div className="col-span-2 flex flex-col items-center mt-4 mb-4">
        {data.profileImage ? (
          <img
            src={data.profileImage}
            alt="Profil"
            className="w-28 h-28 rounded-full object-cover mb-2"
          />
        ) : (
          <div className="w-28 h-28 bg-gray-300 rounded-full flex items-center justify-center text-sm mb-2">
            No Photo
          </div>
        )}
        <label className="text-sm font-medium">Profil Fotoğrafı</label>
        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          className="text-sm mt-1 dark:bg-gray-700 dark:text-white"
          disabled={uploading}
        />
      </div>

      <div>
        <label className="font-medium block mb-1">Ad Soyad</label>
        <input
          type="text"
          name="name"
          value={data.name}
          onChange={handleChange}
          placeholder="Örneğin: Burak Kızılay"
          className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
        />
      </div>
      <div>
        <label className="font-medium block mb-1">Ünvan</label>
        <input
          type="text"
          name="title"
          value={data.title}
          onChange={handleChange}
          placeholder="Örneğin: Yazılım Mühendisi"
          className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
        />
      </div>
      <div>
        <label className="font-medium block mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={data.email}
          onChange={handleChange}
          placeholder="Mail adresiniz"
          className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
        />
      </div>
      <div>
        <label className="font-medium block mb-1">Ülke/Şehir</label>
        <input
          type="text"
          name="city"
          value={data.city}
          onChange={handleChange}
          placeholder="Örneğin: İstanbul"
          className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
        />
      </div>
      <div>
        <label className="font-medium block mb-1">Telefon</label>
        <input
          type="tel"
          name="phone"
          value={data.phone}
          onChange={handleChange}
          placeholder="Örneğin: +90 555 555 55 55"
          className="w-full p-3 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
        />
      </div>
    </div>
  );
};

export default StepBasicInfo;
