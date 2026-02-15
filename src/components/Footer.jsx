import React from 'react';
import { FaInstagram, FaTiktok, FaXTwitter, FaWhatsapp } from 'react-icons/fa6';
import { FiMapPin, FiClock, FiMail } from 'react-icons/fi';

export default function Footer({ settings }) {
    const whatsappUrl = settings?.whatsapp_number
        ? `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(
            settings.whatsapp_message || 'Halo admin, mau tanya menu/reservasi'
        )}`
        : '#';

    const socialLinks = [
        { icon: FaInstagram, url: settings?.instagram_url, label: 'Instagram', color: 'hover:text-pink-400' },
        { icon: FaTiktok, url: settings?.tiktok_url, label: 'TikTok', color: 'hover:text-white' },
        { icon: FaXTwitter, url: settings?.twitter_url, label: 'X (Twitter)', color: 'hover:text-white' },
    ];

    return (
        <footer id="footer" className="relative bg-senja-950 border-t border-senja-700/30">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-2 mb-5">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-senja-200 to-senja-100 flex items-center justify-center text-senja-900 font-display font-bold text-xl">
                                S
                            </div>
                            <span className="font-display text-2xl font-semibold text-senja-50">
                                {settings?.site_name || 'Senja'} <span className="text-senja-200">Coffee</span>
                            </span>
                        </div>
                        <p className="text-senja-400 text-sm leading-relaxed mb-6 max-w-sm">
                            {settings?.footer_text || 'Nikmati kehangatan di setiap tegukan. Kedai kopi premium dengan suasana yang membuat Anda betah berlama-lama.'}
                        </p>

                        {/* Social Links */}
                        <div className="flex items-center gap-3">
                            {socialLinks.map((social) =>
                                social.url ? (
                                    <a
                                        key={social.label}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={social.label}
                                        className={`w-10 h-10 rounded-full bg-senja-700/50 flex items-center justify-center text-senja-400 ${social.color} hover:bg-senja-600/50 transition-all duration-300 hover:scale-110`}
                                    >
                                        <social.icon size={18} />
                                    </a>
                                ) : null
                            )}
                        </div>
                    </div>

                    {/* Info Column */}
                    <div>
                        <h3 className="font-display text-lg font-semibold text-senja-50 mb-5">Informasi</h3>
                        <div className="space-y-4">
                            {settings?.address && (
                                <div className="flex items-start gap-3">
                                    <FiMapPin className="text-senja-200 mt-0.5 flex-shrink-0" size={16} />
                                    <span className="text-senja-400 text-sm">{settings.address}</span>
                                </div>
                            )}
                            <div className="flex items-start gap-3">
                                <FiClock className="text-senja-200 mt-0.5 flex-shrink-0" size={16} />
                                <span className="text-senja-400 text-sm">Buka Setiap Hari<br />08:00 — 22:00 WIB</span>
                            </div>
                        </div>
                    </div>

                    {/* WhatsApp CTA Column */}
                    <div>
                        <h3 className="font-display text-lg font-semibold text-senja-50 mb-5">Hubungi Kami</h3>
                        <p className="text-senja-400 text-sm mb-4">
                            Ada pertanyaan tentang menu atau ingin reservasi? Hubungi kami via WhatsApp!
                        </p>
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-green-600/25 hover:scale-105 text-sm"
                        >
                            <FaWhatsapp size={18} />
                            Chat WhatsApp
                        </a>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-senja-700/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-senja-500 text-xs sm:text-sm">
                        © {new Date().getFullYear()} {settings?.site_name || 'Senja Coffee'}. All rights reserved.
                    </p>
                    <a
                        href="/admin/login"
                        className="text-senja-600 text-xs hover:text-senja-400 transition-colors"
                    >
                        Admin Panel
                    </a>
                </div>
            </div>

            {/* Floating WhatsApp Button */}
            <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-400 text-white rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300 hover:scale-110 animate-float"
                aria-label="Chat WhatsApp"
            >
                <FaWhatsapp size={26} />
            </a>
        </footer>
    );
}
