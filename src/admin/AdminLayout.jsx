import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { getMe } from '../utils/api';
import {
    FiHome, FiImage, FiCoffee, FiMessageSquare, FiSettings,
    FiLock, FiLogOut, FiMenu, FiX, FiExternalLink,
} from 'react-icons/fi';

const navItems = [
    { path: '/admin', name: 'Dashboard', icon: FiHome, end: true },
    { path: '/admin/hero', name: 'Hero Section', icon: FiImage },
    { path: '/admin/menu', name: 'Menu Items', icon: FiCoffee },
    { path: '/admin/testimonials', name: 'Testimonials', icon: FiMessageSquare },
    { path: '/admin/settings', name: 'Site Settings', icon: FiSettings },
    { path: '/admin/password', name: 'Ganti Password', icon: FiLock },
];

export default function AdminLayout() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('senja_token');
        if (!token) {
            navigate('/admin/login');
            return;
        }

        getMe()
            .then((res) => setUser(res.data.data))
            .catch(() => {
                localStorage.removeItem('senja_token');
                navigate('/admin/login');
            })
            .finally(() => setLoading(false));
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('senja_token');
        navigate('/admin/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-senja-900 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-4 border-senja-700 border-t-senja-200 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-senja-900 flex">
            {/* Sidebar Overlay (mobile) */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-senja-950 border-r border-senja-700/30 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    }`}
            >
                {/* Sidebar Header */}
                <div className="flex items-center justify-between px-5 h-16 border-b border-senja-700/30">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-senja-200 to-senja-100 flex items-center justify-center text-senja-900 font-display font-bold text-sm">
                            S
                        </div>
                        <span className="font-display text-lg font-semibold text-senja-50">
                            Admin <span className="text-senja-200">Panel</span>
                        </span>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-senja-400 hover:text-senja-200"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.end}
                            onClick={() => setSidebarOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                    ? 'bg-senja-200/10 text-senja-200 border border-senja-200/20'
                                    : 'text-senja-400 hover:text-senja-200 hover:bg-senja-800/50'
                                }`
                            }
                        >
                            <item.icon size={18} />
                            {item.name}
                        </NavLink>
                    ))}
                </nav>

                {/* Sidebar Footer */}
                <div className="p-3 border-t border-senja-700/30 space-y-2">
                    <a
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-senja-400 hover:text-senja-200 hover:bg-senja-800/50 transition-all"
                    >
                        <FiExternalLink size={18} />
                        Lihat Landing Page
                    </a>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-all"
                    >
                        <FiLogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Top Bar */}
                <header className="h-16 bg-senja-900/80 backdrop-blur-sm border-b border-senja-700/30 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden text-senja-400 hover:text-senja-200"
                    >
                        <FiMenu size={22} />
                    </button>
                    <div />
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-senja-700 flex items-center justify-center text-senja-200 text-sm font-bold">
                            {user?.username?.[0]?.toUpperCase() || 'A'}
                        </div>
                        <span className="text-senja-300 text-sm hidden sm:block">{user?.username || 'Admin'}</span>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 lg:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
