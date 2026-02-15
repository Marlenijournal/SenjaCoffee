import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../utils/api';
import toast from 'react-hot-toast';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await login({ username, password });
            if (res.data.success) {
                localStorage.setItem('senja_token', res.data.data.token);
                toast.success('Login berhasil!');
                navigate('/admin');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login gagal');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-senja-900 flex items-center justify-center px-4">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-72 h-72 bg-senja-200/5 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-senja-200/3 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-senja-200 to-senja-100 flex items-center justify-center text-senja-900 font-display font-bold text-2xl">
                        S
                    </div>
                    <h1 className="font-display text-3xl font-bold text-senja-50">Admin Panel</h1>
                    <p className="text-senja-400 text-sm mt-1">Senja Coffee Dashboard</p>
                </div>

                {/* Login Card */}
                <div className="bg-senja-800/50 border border-senja-700/50 rounded-2xl p-8 backdrop-blur-sm">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-senja-300 text-sm font-medium mb-2">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 bg-senja-900/50 border border-senja-600/30 rounded-xl text-senja-50 placeholder-senja-500 focus:outline-none focus:border-senja-200/50 focus:ring-1 focus:ring-senja-200/20 transition-all"
                                placeholder="Masukkan username"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-senja-300 text-sm font-medium mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-senja-900/50 border border-senja-600/30 rounded-xl text-senja-50 placeholder-senja-500 focus:outline-none focus:border-senja-200/50 focus:ring-1 focus:ring-senja-200/20 transition-all"
                                placeholder="Masukkan password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-senja-200 to-senja-100 text-senja-900 font-semibold rounded-xl hover:shadow-lg hover:shadow-senja-200/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Memproses...' : 'Masuk'}
                        </button>
                    </form>
                </div>

                <p className="text-center text-senja-600 text-xs mt-6">
                    <a href="/" className="hover:text-senja-400 transition-colors">← Kembali ke Landing Page</a>
                </p>
            </div>
        </div>
    );
}
