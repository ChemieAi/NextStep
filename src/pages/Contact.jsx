import React, { useState } from 'react';
import emailjs from 'emailjs-com';

const Contact = () => {
    const [form, setForm] = useState({
        title: 'İletişim Talebi',
        name: '',
        email: '',
        message: ''
    });

    const [status, setStatus] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        emailjs.send(
            import.meta.env.VITE_EMAILJS_SERVICE_ID,
            import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
            form,
            import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        )
            .then(() => {
                setStatus("success");
                setForm({ title: 'İletişim Talebi', name: '', email: '', message: '', });
            })
            .catch(() => setStatus("error"));
    };

    return (
        <div className="min-h-screen bg-[#e5e5e5] dark:bg-gray-900 flex justify-center items-center p-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl p-8">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
                    Bizimle İletişime Geçin
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <input type="text" name="name" placeholder="Adınız" required value={form.name} onChange={handleChange}
                        className="w-full p-3 rounded border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white" />
                    <input type="email" name="email" placeholder="E-posta" required value={form.email} onChange={handleChange}
                        className="w-full p-3 rounded border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white" />
                    <textarea name="message" rows="5" placeholder="Mesajınız" required value={form.message} onChange={handleChange}
                        className="w-full p-3 rounded border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white" />
                    <button type="submit"
                        className="w-full py-3 bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700 text-white font-semibold rounded transition">
                        Gönder
                    </button>
                </form>

                {status === "success" && (
                    <p className="text-green-500 text-center mt-4">✅ Mesajınız başarıyla gönderildi.</p>
                )}
                {status === "error" && (
                    <p className="text-red-500 text-center mt-4">❌ Mesaj gönderilirken bir hata oluştu.</p>
                )}
            </div>
        </div>
    );
};

export default Contact;
