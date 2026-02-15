import React, { useEffect, useState } from 'react';
import { FiCoffee, FiImage, FiMessageSquare, FiSettings } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { getAllMenuItems, getAllTestimonials } from '../utils/api';

export default function Dashboard() {
    const [stats, setStats] = useState({
        menuItems: 0,
        testimonials: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [menuRes, testRes] = await Promise.all([
                    getAllMenuItems(),
                    getAllTestimonials(),
                ]);
                setStats({
                    menuItems: menuRes.data.data?.length || 0,
                    testimonials: testRes.data.data?.length || 0,
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };
        fetchStats();
    }, []);

    const cards = [
        {
            title: 'Menu Items',
            value: stats.menuItems,
            icon: FiCoffee,
            link: '/admin/menu',
            color: 'from-amber-500/20 to-amber-600/10 border-amber-500/20',
            iconColor: 'text-amber-400',
        },
        {
            title: 'Testimonials',
            value: stats.testimonials,
            icon: FiMessageSquare,
            link: '/admin/testimonials',
            color: 'from-blue-500/20 to-blue-600/10 border-blue-500/20',
            iconColor: 'text-blue-400',
        },
        {
            title: 'Hero Section',
            value: 'Edit',
            icon: FiImage,
            link: '/admin/hero',
            color: 'from-purple-500/20 to-purple-600/10 border-purple-500/20',
            iconColor: 'text-purple-400',
        },
        {
            title: 'Site Settings',
            value: 'Edit',
            icon: FiSettings,
            link: '/admin/settings',
            color: 'from-green-500/20 to-green-600/10 border-green-500/20',
            iconColor: 'text-green-400',
        },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl lg:text-3xl font-display font-bold text-senja-50">Dashboard</h1>
                <p className="text-senja-400 mt-1">Selamat datang di Senja Coffee Admin Panel</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {cards.map((card) => (
                    <Link
                        key={card.title}
                        to={card.link}
                        className={`bg-gradient-to-br ${card.color} border rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 group`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <card.icon className={`${card.iconColor} text-2xl`} />
                            <span className="text-2xl font-bold text-senja-50 font-display">{card.value}</span>
                        </div>
                        <h3 className="text-senja-300 text-sm font-medium group-hover:text-senja-200 transition-colors">
                            {card.title}
                        </h3>
                    </Link>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-senja-800/30 border border-senja-700/30 rounded-2xl p-6">
                <h2 className="text-lg font-display font-semibold text-senja-50 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Link
                        to="/admin/menu"
                        className="flex items-center gap-3 px-4 py-3 bg-senja-700/30 rounded-xl text-senja-300 hover:text-senja-200 hover:bg-senja-700/50 transition-all"
                    >
                        <FiCoffee className="text-senja-200" />
                        Tambah Menu Baru
                    </Link>
                    <Link
                        to="/admin/testimonials"
                        className="flex items-center gap-3 px-4 py-3 bg-senja-700/30 rounded-xl text-senja-300 hover:text-senja-200 hover:bg-senja-700/50 transition-all"
                    >
                        <FiMessageSquare className="text-senja-200" />
                        Tambah Testimonial
                    </Link>
                    <Link
                        to="/admin/hero"
                        className="flex items-center gap-3 px-4 py-3 bg-senja-700/30 rounded-xl text-senja-300 hover:text-senja-200 hover:bg-senja-700/50 transition-all"
                    >
                        <FiImage className="text-senja-200" />
                        Edit Hero Section
                    </Link>
                    <Link
                        to="/admin/settings"
                        className="flex items-center gap-3 px-4 py-3 bg-senja-700/30 rounded-xl text-senja-300 hover:text-senja-200 hover:bg-senja-700/50 transition-all"
                    >
                        <FiSettings className="text-senja-200" />
                        Edit Social Media & Footer
                    </Link>
                </div>
            </div>
        </div>
    );
}
