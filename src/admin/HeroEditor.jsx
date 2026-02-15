import React, { useState, useEffect } from 'react';
import { getHero, updateHero } from '../utils/api';
import toast from 'react-hot-toast';
import { FiSave, FiUpload, FiImage } from 'react-icons/fi';

export default function HeroEditor() {
    const [form, setForm] = useState({
        title: '',
        subtitle: '',
        description: '',
        cta_text: '',
    });
    const [currentImage, setCurrentImage] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchHero();
    }, []);

    const fetchHero = async () => {
        try {
            const res = await getHero();
            if (res.data.data) {
                const d = res.data.data;
                setForm({
                    title: d.title || '',
                    subtitle: d.subtitle || '',
                    description: d.description || '',
                    cta_text: d.cta_text || '',
                });
                setCurrentImage(d.background_image || '');
            }
        } catch (error) {
            toast.error('Gagal memuat data hero');
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const formData = new FormData();
            formData.append('title', form.title);
            formData.append('subtitle', form.subtitle);
            formData.append('description', form.description);
            formData.append('cta_text', form.cta_text);

            if (imageFile) {
                formData.append('background_image', imageFile);
            } else {
                formData.append('existing_image', currentImage);
            }

            await updateHero(formData);
            toast.success('Hero section berhasil diperbarui!');
            fetchHero();
            setImageFile(null);
            setImagePreview('');
        } catch (error) {
            toast.error('Gagal menyimpan perubahan');
        } finally {
            setSaving(false);
        }
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
                <h1 className="text-2xl lg:text-3xl font-display font-bold text-senja-50">Hero Section</h1>
                <p className="text-senja-400 mt-1">Edit tampilan hero di landing page</p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                {/* Background Image */}
                <div className="bg-senja-800/30 border border-senja-700/30 rounded-2xl p-6">
                    <label className="block text-senja-200 text-sm font-semibold mb-3 flex items-center gap-2">
                        <FiImage size={16} /> Background Image
                    </label>

                    {(imagePreview || currentImage) && (
                        <div className="mb-4 rounded-xl overflow-hidden h-48 bg-senja-700/30">
                            <img
                                src={imagePreview || currentImage}
                                alt="Hero background"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <label className="flex items-center gap-2 px-4 py-3 bg-senja-700/50 border border-senja-600/30 rounded-xl cursor-pointer hover:bg-senja-700/70 transition-all">
                        <FiUpload className="text-senja-200" />
                        <span className="text-senja-300 text-sm">
                            {imageFile ? imageFile.name : 'Pilih gambar (JPG, PNG, WebP, max 5MB)'}
                        </span>
                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </label>
                </div>

                {/* Text Fields */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-senja-300 text-sm font-medium mb-2">Judul</label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className="w-full px-4 py-3 bg-senja-800/50 border border-senja-700/30 rounded-xl text-senja-50 focus:outline-none focus:border-senja-200/50 transition-all"
                            placeholder="Senja Coffee"
                        />
                    </div>

                    <div>
                        <label className="block text-senja-300 text-sm font-medium mb-2">Subtitle</label>
                        <input
                            type="text"
                            value={form.subtitle}
                            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                            className="w-full px-4 py-3 bg-senja-800/50 border border-senja-700/30 rounded-xl text-senja-50 focus:outline-none focus:border-senja-200/50 transition-all"
                            placeholder="Nikmati Kehangatan di Setiap Tegukan"
                        />
                    </div>

                    <div>
                        <label className="block text-senja-300 text-sm font-medium mb-2">Deskripsi</label>
                        <textarea
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-3 bg-senja-800/50 border border-senja-700/30 rounded-xl text-senja-50 focus:outline-none focus:border-senja-200/50 transition-all resize-none"
                            placeholder="Deskripsi untuk hero section..."
                        />
                    </div>

                    <div>
                        <label className="block text-senja-300 text-sm font-medium mb-2">Teks Tombol CTA</label>
                        <input
                            type="text"
                            value={form.cta_text}
                            onChange={(e) => setForm({ ...form, cta_text: e.target.value })}
                            className="w-full px-4 py-3 bg-senja-800/50 border border-senja-700/30 rounded-xl text-senja-50 focus:outline-none focus:border-senja-200/50 transition-all"
                            placeholder="Lihat Menu Kami"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-senja-200 to-senja-100 text-senja-900 font-semibold rounded-xl hover:shadow-lg hover:shadow-senja-200/20 transition-all disabled:opacity-50"
                >
                    <FiSave size={18} />
                    {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
            </form>
        </div>
    );
}
