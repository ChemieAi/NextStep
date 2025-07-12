import React from 'react';
import Contact from '../pages/Contact';
import { useTranslation } from "react-i18next";
import {
    FaFacebook,
    FaTwitter,
    FaInstagram,
    FaLinkedin,
} from 'react-icons/fa';

const Footer = () => {
    const { t } = useTranslation();
    return (
        <footer className="bg-gray-800 text-white py-10">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Şirket Bilgisi */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">{t("footer.brand")}</h2>
                    <p className="text-gray-400">
                        {t("footer.description")}
                    </p>
                </div>

                {/* Navigasyon Linkleri */}
                <div>
                    <h3 className="text-xl font-semibold mb-4">{t("footer.links")}</h3>
                    <ul>
                        <li className="mb-2">
                            <a href="/" className="hover:underline text-gray-400">
                                {t("footer.home")}
                            </a>
                        </li>
                        {/*
                        <li className="mb-2">
                        <a href="#" className="hover:underline text-gray-400">
                            Özellikler
                        </a>
                        </li>
                        <li className="mb-2">
                        <a href="#" className="hover:underline text-gray-400">
                            Şablonlar
                        </a>
                        </li>
                        */}
                        <li className="mb-2">
                            <a href="/iletisim" className="hover:underline text-gray-400">
                                {t("footer.contact")}
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Sosyal Medya */}
                <div>
                    <h3 className="text-xl font-semibold mb-4">{t("footer.follow")}</h3>
                    <div className="flex space-x-4">
                        <a href="" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                            <FaFacebook size={24} />
                        </a>
                        <a href="https://x.com/HalletcezAbi" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                            <FaTwitter size={24} />
                        </a>
                        <a href="https://www.instagram.com/_burakkizilay_" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                            <FaInstagram size={24} />
                        </a>
                        <a href="https://www.linkedin.com/in/burak-kızılay/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                            <FaLinkedin size={24} />
                        </a>
                    </div>
                </div>

                {/* Abonelik Formu */}
                <div>
                    <h3 className="text-xl font-semibold mb-4">{t("footer.subscribe")}</h3>
                    <form className="flex flex-col space-y-4">
                        <input
                            type="email"
                            placeholder={t("footer.emailPlaceholder")}
                            className="p-2 rounded bg-gray-700 text-white focus:outline-none"
                        />
                        <button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow transition mb-16"
                        >
                            {t("footer.subscribeBtn")}
                        </button>
                    </form>
                </div>
            </div>

            {/* Alt Bilgi */}
            <div className="mt-10 text-center text-gray-500">
                &copy; {new Date().getFullYear()} NextStep. {t("footer.rights")}
            </div>
        </footer>
    );
};

export default Footer;
