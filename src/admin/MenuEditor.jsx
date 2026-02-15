import React, { useState, useEffect } from 'react';
import {
    getCategories, getAllMenuItems, createMenuItem,
    updateMenuItem, deleteMenuItem,
} from '../utils/api';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiUpload, FiCoffee } from 'react-icons/fi';

export default function MenuEditor() {
    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [form, setForm] = useState({
        name: '', description: '', price: '', category_id: '', sort_order: 0, is_active: true,
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [catRes, itemsRes] = await Promise.all([getCategories(), getAllMenuItems()]);
            setCategories(catRes.data.data);
            setItems(itemsRes.data.data);
        } catch (error) {
            toast.error('Gagal memuat data menu');
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (p) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(p);

    const openAddModal = () => {
        setEditingItem(null);
        setForm({ name: '', description: '', price: '', category_id: categories[0]?.id || '', sort_order: 0, is_active: true });
        setImageFile(null);
        setImagePreview('');
        setModalOpen(true);
    };

    const openEditModal = (item) => {
        setEditingItem(item);
        setForm({
            name: item.name,
            description: item.description || '',
            price: item.price,
            category_id: item.category_id,
            sort_order: item.sort_order || 0,
            is_active: item.is_active,
        });
        setImageFile(null);
        setImagePreview(item.image || '');
        setModalOpen(true);
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
            formData.append('name', form.name);
            formData.append('description', form.description);
            formData.append('price', form.price);
            formData.append('category_id', form.category_id);
            formData.append('sort_order', form.sort_order);
            formData.append('is_active', form.is_active);

            if (imageFile) {
                formData.append('image', imageFile);
            } else if (editingItem?.image) {
                formData.append('existing_image', editingItem.image);
            }

            if (editingItem) {
                await updateMenuItem(editingItem.id, formData);
                toast.success('Menu berhasil diperbarui!');
            } else {
                await createMenuItem(formData);
                toast.success('Menu baru berhasil ditambahkan!');
            }

            setModalOpen(false);
            fetchData();
        } catch (error) {
            toast.error('Gagal menyimpan menu');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!confirm(`Yakin ingin menghapus "${name}"?`)) return;
        try {
            await deleteMenuItem(id);
            toast.success('Menu berhasil dihapus!');
            fetchData();
        } catch (error) {
            toast.error('Gagal menghapus menu');
        }
    };

    const filteredItems = activeTab === 'all'
        ? items
        : items.filter((i) => String(i.category_id) === String(activeTab));

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
                    <h1 className="text-2xl lg:text-3xl font-display font-bold text-senja-50">Menu Items</h1>
                    <p className="text-senja-400 mt-1">Kelola semua menu di landing page</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-senja-200 to-senja-100 text-senja-900 font-semibold rounded-xl hover:shadow-lg hover:shadow-senja-200/20 transition-all text-sm"
                >
                    <FiPlus size={18} /> Tambah Menu
                </button>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
                <button
                    onClick={() => setActiveTab('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'all'
                            ? 'bg-senja-200/20 text-senja-200 border border-senja-200/30'
                            : 'bg-senja-800/30 text-senja-400 hover:text-senja-200'
                        }`}
                >
                    Semua ({items.length})
                </button>
                {categories.map((cat) => {
                    const count = items.filter((i) => String(i.category_id) === String(cat.id)).length;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => setActiveTab(String(cat.id))}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === String(cat.id)
                                    ? 'bg-senja-200/20 text-senja-200 border border-senja-200/30'
                                    : 'bg-senja-800/30 text-senja-400 hover:text-senja-200'
                                }`}
                        >
                            {cat.name} ({count})
                        </button>
                    );
                })}
            </div>

            {/* Items Table */}
            <div className="bg-senja-800/20 border border-senja-700/30 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-senja-700/30">
                                <th className="text-left text-senja-400 text-xs font-medium uppercase tracking-wider px-5 py-3">Menu</th>
                                <th className="text-left text-senja-400 text-xs font-medium uppercase tracking-wider px-5 py-3 hidden lg:table-cell">Kategori</th>
                                <th className="text-left text-senja-400 text-xs font-medium uppercase tracking-wider px-5 py-3">Harga</th>
                                <th className="text-center text-senja-400 text-xs font-medium uppercase tracking-wider px-5 py-3">Status</th>
                                <th className="text-right text-senja-400 text-xs font-medium uppercase tracking-wider px-5 py-3">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.map((item) => (
                                <tr key={item.id} className="border-b border-senja-700/20 hover:bg-senja-700/10 transition-colors">
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-senja-700/50 overflow-hidden flex-shrink-0">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <FiCoffee className="text-senja-500 text-sm" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-senja-50 text-sm font-medium truncate">{item.name}</p>
                                                <p className="text-senja-500 text-xs truncate max-w-[200px]">{item.description}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 hidden lg:table-cell">
                                        <span className="text-senja-300 text-xs px-2 py-1 bg-senja-700/30 rounded-md">
                                            {item.category_name}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3">
                                        <span className="text-senja-200 text-sm font-medium">{formatPrice(item.price)}</span>
                                    </td>
                                    <td className="px-5 py-3 text-center">
                                        <span className={`text-xs px-2 py-1 rounded-full ${item.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {item.is_active ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                onClick={() => openEditModal(item)}
                                                className="p-2 text-senja-400 hover:text-senja-200 hover:bg-senja-700/30 rounded-lg transition-all"
                                            >
                                                <FiEdit2 size={15} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id, item.name)}
                                                className="p-2 text-red-400/60 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                            >
                                                <FiTrash2 size={15} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredItems.length === 0 && (
                    <div className="text-center py-12">
                        <FiCoffee className="mx-auto text-4xl text-senja-600 mb-3" />
                        <p className="text-senja-500">Belum ada menu item</p>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/70" onClick={() => setModalOpen(false)} />
                    <div className="relative bg-senja-800 border border-senja-700/50 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-5 border-b border-senja-700/30">
                            <h2 className="text-lg font-display font-semibold text-senja-50">
                                {editingItem ? 'Edit Menu' : 'Tambah Menu Baru'}
                            </h2>
                            <button onClick={() => setModalOpen(false)} className="text-senja-400 hover:text-senja-200">
                                <FiX size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-5 space-y-4">
                            <div>
                                <label className="block text-senja-300 text-sm mb-1.5">Nama Menu *</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-senja-900/50 border border-senja-700/30 rounded-xl text-senja-50 focus:outline-none focus:border-senja-200/50 text-sm"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-senja-300 text-sm mb-1.5">Deskripsi</label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    rows={2}
                                    className="w-full px-4 py-2.5 bg-senja-900/50 border border-senja-700/30 rounded-xl text-senja-50 focus:outline-none focus:border-senja-200/50 text-sm resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-senja-300 text-sm mb-1.5">Harga (Rp) *</label>
                                    <input
                                        type="number"
                                        value={form.price}
                                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-senja-900/50 border border-senja-700/30 rounded-xl text-senja-50 focus:outline-none focus:border-senja-200/50 text-sm"
                                        required
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-senja-300 text-sm mb-1.5">Kategori *</label>
                                    <select
                                        value={form.category_id}
                                        onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-senja-900/50 border border-senja-700/30 rounded-xl text-senja-50 focus:outline-none focus:border-senja-200/50 text-sm"
                                        required
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id} className="bg-senja-800">{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-senja-300 text-sm mb-1.5">Urutan</label>
                                    <input
                                        type="number"
                                        value={form.sort_order}
                                        onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-2.5 bg-senja-900/50 border border-senja-700/30 rounded-xl text-senja-50 focus:outline-none focus:border-senja-200/50 text-sm"
                                        min="0"
                                    />
                                </div>
                                <div className="flex items-end pb-1">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={form.is_active}
                                            onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                                            className="w-4 h-4 accent-senja-200"
                                        />
                                        <span className="text-senja-300 text-sm">Aktif</span>
                                    </label>
                                </div>
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-senja-300 text-sm mb-1.5">Gambar</label>
                                {imagePreview && (
                                    <div className="mb-2 h-32 rounded-xl overflow-hidden bg-senja-700/30">
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <label className="flex items-center gap-2 px-4 py-2.5 bg-senja-700/30 border border-senja-600/20 rounded-xl cursor-pointer hover:bg-senja-700/50 transition-all">
                                    <FiUpload className="text-senja-200 text-sm" />
                                    <span className="text-senja-400 text-sm truncate">
                                        {imageFile ? imageFile.name : 'Pilih gambar...'}
                                    </span>
                                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                </label>
                            </div>

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
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-senja-200 to-senja-100 text-senja-900 font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 text-sm"
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
