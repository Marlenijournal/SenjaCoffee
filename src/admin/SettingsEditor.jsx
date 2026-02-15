import React, { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '../utils/api';
import toast from 'react-hot-toast';
import { FiSave, FiGlobe } from 'react-icons/fi';
import { FaInstagram, FaTiktok, FaXTwitter, FaWhatsapp } from 'react-icons/fa6';

export default function SettingsEditor() {
    const [form, setForm] = useState({
        site_name: '',
        whatsapp_number: '',
        whatsapp_message: '',
        instagram_url: '',
        tiktok_url: '',
        twitter_url: '',
        address: '',
        footer_text: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => { fetchSettings(); }, []);

    const fetchSettings = async () => {
        try {
            const res = await getSettings();
            if (res.data.data) {
                const d = res.data.data;
                setForm({
                    site_name: d.site_name || '',
                    whatsapp_number: d.whatsapp_number || '',
                    whatsapp_message: d.whatsapp_message || '',
                    instagram_url: d.instagram_url || '',
                    tiktok_url: d.tiktok_url || '',
                    twitter_url: d.twitter_url || '',
                    address: d.address || '',
                    footer_text: d.footer_text || '',
                });
            }
        } catch { toast.error('Gagal memuat settings'); }
        finally { setLoading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await updateSettings(form);
            toast.success('Settings berhasil diperbarui!');
        } catch { toast.error('Gagal menyimpan settings'); }
        finally { setSaving(false); }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 rounded-full border-4 border-senja-700 border-t-senja-200 animate-spin" />
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl lg:text-3xl font-display font-bold text-senja-50">Site Settings</h1>
                <p className="text-senja-400 mt-1">Edit informasi website, social media, dan WhatsApp</p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                {/* General */}
                <div className="bg-senja-800/30 border border-senja-700/30 rounded-2xl p-6">
                    <h2 className="text-senja-200 text-sm font-semibold mb-4 flex items-center gap-2">
                        <FiGlobe size={16} /> Informasi Umum
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-senja-300 text-sm mb-1.5">Nama Website</label>
                            <input
                                type="text"
                                value={form.site_name}
                                onChange={(e) => setForm({ ...form, site_name: e.target.value })}
                                className="w-full px-4 py-2.5 bg-senja-900/50 border border-senja-700/30 rounded-xl text-senja-50 focus:outline-none focus:border-senja-200/50 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-senja-300 text-sm mb-1.5">Alamat</label>
                            <input
                                type="text"
                                value={form.address}
                                onChange={(e) => setForm({ ...form, address: e.target.value })}
                                className="w-full px-4 py-2.5 bg-senja-900/50 border border-senja-700/30 rounded-xl text-senja-50 focus:outline-none focus:border-senja-200/50 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-senja-300 text-sm mb-1.5">Footer Text</label>
                            <textarea
                                value={form.footer_text}
                                onChange={(e) => setForm({ ...form, footer_text: e.target.value })}
                                rows={2}
                                className="w-full px-4 py-2.5 bg-senja-900/50 border border-senja-700/30 rounded-xl text-senja-50 focus:outline-none focus:border-senja-200/50 text-sm resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* WhatsApp */}
                <div className="bg-senja-800/30 border border-senja-700/30 rounded-2xl p-6">
                    <h2 className="text-green-400 text-sm font-semibold mb-4 flex items-center gap-2">
                        <FaWhatsapp size={16} /> WhatsApp
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-senja-300 text-sm mb-1.5">Nomor WhatsApp</label>
                            <input
                                type="text"
                                value={form.whatsapp_number}
                                onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })}
                                className="w-full px-4 py-2.5 bg-senja-900/50 border border-senja-700/30 rounded-xl text-senja-50 focus:outline-none focus:border-senja-200/50 text-sm"
                                placeholder="6281234567890 (tanpa + dan spasi)"
                            />
                        </div>
                        <div>
                            <label className="block text-senja-300 text-sm mb-1.5">Pesan Otomatis</label>
                            <textarea
                                value={form.whatsapp_message}
                                onChange={(e) => setForm({ ...form, whatsapp_message: e.target.value })}
                                rows={2}
                                className="w-full px-4 py-2.5 bg-senja-900/50 border border-senja-700/30 rounded-xl text-senja-50 focus:outline-none focus:border-senja-200/50 text-sm resize-none"
                                placeholder="Halo admin, mau tanya menu/reservasi..."
                            />
                            <p className="text-senja-500 text-xs mt-1">Pesan ini akan otomatis terisi saat pengunjung klik tombol WhatsApp</p>
                        </div>
                    </div>
                </div>

                {/* Social Media */}
                <div className="bg-senja-800/30 border border-senja-700/30 rounded-2xl p-6">
                    <h2 className="text-senja-200 text-sm font-semibold mb-4">Social Media Links</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="text-senja-300 text-sm mb-1.5 flex items-center gap-2">
                                <FaInstagram className="text-pink-400" size={14} /> Instagram URL
                            </label>
                            <input
                                type="url"
                                value={form.instagram_url}
                                onChange={(e) => setForm({ ...form, instagram_url: e.target.value })}
                                className="w-full px-4 py-2.5 bg-senja-900/50 border border-senja-700/30 rounded-xl text-senja-50 focus:outline-none focus:border-senja-200/50 text-sm mt-1.5"
                                placeholder="https://instagram.com/senjacoffee"
                            />
                        </div>
                        <div>
                            <label className="text-senja-300 text-sm mb-1.5 flex items-center gap-2">
                                <FaTiktok size={14} /> TikTok URL
                            </label>
                            <input
                                type="url"
                                value={form.tiktok_url}
                                onChange={(e) => setForm({ ...form, tiktok_url: e.target.value })}
                                className="w-full px-4 py-2.5 bg-senja-900/50 border border-senja-700/30 rounded-xl text-senja-50 focus:outline-none focus:border-senja-200/50 text-sm mt-1.5"
                                placeholder="https://tiktok.com/@senjacoffee"
                            />
                        </div>
                        <div>
                            <label className="text-senja-300 text-sm mb-1.5 flex items-center gap-2">
                                <FaXTwitter size={14} /> X (Twitter) URL
                            </label>
                            <input
                                type="url"
                                value={form.twitter_url}
                                onChange={(e) => setForm({ ...form, twitter_url: e.target.value })}
                                className="w-full px-4 py-2.5 bg-senja-900/50 border border-senja-700/30 rounded-xl text-senja-50 focus:outline-none focus:border-senja-200/50 text-sm mt-1.5"
                                placeholder="https://x.com/senjacoffee"
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-senja-200 to-senja-100 text-senja-900 font-semibold rounded-xl hover:shadow-lg hover:shadow-senja-200/20 transition-all disabled:opacity-50"
                >
                    <FiSave size={18} />
                    {saving ? 'Menyimpan...' : 'Simpan Settings'}
                </button>
            </form>
        </div>
    );
}
