import React, { useState } from 'react';
import { changePassword } from '../utils/api';
import toast from 'react-hot-toast';
import { FiLock, FiSave, FiEye, FiEyeOff } from 'react-icons/fi';

export default function ChangePassword() {
    const [form, setForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [saving, setSaving] = useState(false);
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.newPassword !== form.confirmPassword) {
            return toast.error('Password baru dan konfirmasi tidak cocok!');
        }

        if (form.newPassword.length < 4) {
            return toast.error('Password baru minimal 4 karakter!');
        }

        setSaving(true);
        try {
            await changePassword({
                currentPassword: form.currentPassword,
                newPassword: form.newPassword,
            });
            toast.success('Password berhasil diubah!');
            setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Gagal mengubah password');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl lg:text-3xl font-display font-bold text-senja-50">Ganti Password</h1>
                <p className="text-senja-400 mt-1">Ubah password admin untuk keamanan akun</p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-md space-y-5">
                <div className="bg-senja-800/30 border border-senja-700/30 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <FiLock className="text-senja-200" size={18} />
                        <h2 className="text-senja-200 text-sm font-semibold">Ubah Password</h2>
                    </div>

                    <div>
                        <label className="block text-senja-300 text-sm mb-1.5">Password Saat Ini</label>
                        <div className="relative">
                            <input
                                type={showCurrent ? 'text' : 'password'}
                                value={form.currentPassword}
                                onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                                className="w-full px-4 py-2.5 pr-10 bg-senja-900/50 border border-senja-700/30 rounded-xl text-senja-50 focus:outline-none focus:border-senja-200/50 text-sm"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrent(!showCurrent)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-senja-500 hover:text-senja-300"
                            >
                                {showCurrent ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-senja-300 text-sm mb-1.5">Password Baru</label>
                        <div className="relative">
                            <input
                                type={showNew ? 'text' : 'password'}
                                value={form.newPassword}
                                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                                className="w-full px-4 py-2.5 pr-10 bg-senja-900/50 border border-senja-700/30 rounded-xl text-senja-50 focus:outline-none focus:border-senja-200/50 text-sm"
                                required
                                minLength={4}
                            />
                            <button
                                type="button"
                                onClick={() => setShowNew(!showNew)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-senja-500 hover:text-senja-300"
                            >
                                {showNew ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-senja-300 text-sm mb-1.5">Konfirmasi Password Baru</label>
                        <input
                            type="password"
                            value={form.confirmPassword}
                            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                            className="w-full px-4 py-2.5 bg-senja-900/50 border border-senja-700/30 rounded-xl text-senja-50 focus:outline-none focus:border-senja-200/50 text-sm"
                            required
                            minLength={4}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-senja-200 to-senja-100 text-senja-900 font-semibold rounded-xl hover:shadow-lg hover:shadow-senja-200/20 transition-all disabled:opacity-50"
                >
                    <FiSave size={18} />
                    {saving ? 'Menyimpan...' : 'Ubah Password'}
                </button>
            </form>
        </div>
    );
}
