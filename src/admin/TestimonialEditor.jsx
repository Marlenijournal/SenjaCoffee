import React, { useState, useEffect } from 'react';
import { getAllTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '../utils/api';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiStar } from 'react-icons/fi';

export default function TestimonialEditor() {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [form, setForm] = useState({ name: '', rating: 5, comment: '', is_active: true });
    const [saving, setSaving] = useState(false);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const res = await getAllTestimonials();
            setTestimonials(res.data.data);
        } catch { toast.error('Gagal memuat testimonials'); }
        finally { setLoading(false); }
    };

    const openAddModal = () => {
        setEditingItem(null);
        setForm({ name: '', rating: 5, comment: '', is_active: true });
        setModalOpen(true);
    };

    const openEditModal = (item) => {
        setEditingItem(item);
        setForm({ name: item.name, rating: item.rating, comment: item.comment, is_active: item.is_active });
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingItem) {
                await updateTestimonial(editingItem.id, form);
                toast.success('Testimonial berhasil diperbarui!');
            } else {
                await createTestimonial(form);
                toast.success('Testimonial baru berhasil ditambahkan!');
            }
            setModalOpen(false);
            fetchData();
        } catch { toast.error('Gagal menyimpan testimonial'); }
        finally { setSaving(false); }
    };

    const handleDelete = async (id, name) => {
        if (!confirm(`Yakin ingin menghapus testimonial dari "${name}"?`)) return;
        try {
            await deleteTestimonial(id);
            toast.success('Testimonial berhasil dihapus!');
            fetchData();
        } catch { toast.error('Gagal menghapus testimonial'); }
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-display font-bold text-senja-50">Testimonials</h1>
                    <p className="text-senja-400 mt-1">Kelola testimonial pelanggan</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-senja-200 to-senja-100 text-senja-900 font-semibold rounded-xl hover:shadow-lg hover:shadow-senja-200/20 transition-all text-sm"
                >
                    <FiPlus size={18} /> Tambah Testimonial
                </button>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {testimonials.map((t) => (
                    <div
                        key={t.id}
                        className={`bg-senja-800/30 border rounded-2xl p-5 transition-all ${t.is_active ? 'border-senja-700/30' : 'border-red-500/20 opacity-60'
                            }`}
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-senja-200 to-senja-100 flex items-center justify-center text-senja-900 text-sm font-bold flex-shrink-0">
                                    {t.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                </div>
                                <div>
                                    <h3 className="text-senja-50 text-sm font-semibold">{t.name}</h3>
                                    <div className="flex gap-0.5 mt-0.5">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <FiStar key={s} size={12} className={s <= t.rating ? 'text-yellow-400 fill-yellow-400' : 'text-senja-600'} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            {!t.is_active && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">Hidden</span>
                            )}
                        </div>
                        <p className="text-senja-400 text-sm leading-relaxed mb-4 line-clamp-3 italic">"{t.comment}"</p>
                        <div className="flex gap-1">
                            <button
                                onClick={() => openEditModal(t)}
                                className="flex-1 flex items-center justify-center gap-1 py-2 text-senja-400 hover:text-senja-200 hover:bg-senja-700/30 rounded-lg transition-all text-xs"
                            >
                                <FiEdit2 size={13} /> Edit
                            </button>
                            <button
                                onClick={() => handleDelete(t.id, t.name)}
                                className="flex-1 flex items-center justify-center gap-1 py-2 text-red-400/60 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all text-xs"
                            >
                                <FiTrash2 size={13} /> Hapus
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {testimonials.length === 0 && (
                <div className="text-center py-16"><p className="text-senja-500">Belum ada testimonial</p></div>
            )}

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/70" onClick={() => setModalOpen(false)} />
                    <div className="relative bg-senja-800 border border-senja-700/50 rounded-2xl w-full max-w-lg">
                        <div className="flex items-center justify-between p-5 border-b border-senja-700/30">
                            <h2 className="text-lg font-display font-semibold text-senja-50">
                                {editingItem ? 'Edit Testimonial' : 'Tambah Testimonial'}
                            </h2>
                            <button onClick={() => setModalOpen(false)} className="text-senja-400 hover:text-senja-200">
                                <FiX size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-5 space-y-4">
                            <div>
                                <label className="block text-senja-300 text-sm mb-1.5">Nama *</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-senja-900/50 border border-senja-700/30 rounded-xl text-senja-50 focus:outline-none focus:border-senja-200/50 text-sm"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-senja-300 text-sm mb-1.5">Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setForm({ ...form, rating: s })}
                                            className="p-1"
                                        >
                                            <FiStar
                                                size={24}
                                                className={`transition-colors ${s <= form.rating ? 'text-yellow-400 fill-yellow-400' : 'text-senja-600'}`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-senja-300 text-sm mb-1.5">Komentar *</label>
                                <textarea
                                    value={form.comment}
                                    onChange={(e) => setForm({ ...form, comment: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2.5 bg-senja-900/50 border border-senja-700/30 rounded-xl text-senja-50 focus:outline-none focus:border-senja-200/50 text-sm resize-none"
                                    required
                                />
                            </div>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.is_active}
                                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                                    className="w-4 h-4 accent-senja-200"
                                />
                                <span className="text-senja-300 text-sm">Tampilkan di landing page</span>
                            </label>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="flex-1 py-2.5 border border-senja-600/30 text-senja-300 rounded-xl hover:bg-senja-700/30 transition-all text-sm"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-senja-200 to-senja-100 text-senja-900 font-semibold rounded-xl transition-all disabled:opacity-50 text-sm"
                                >
                                    <FiSave size={16} />
                                    {saving ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
