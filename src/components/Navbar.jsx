import React, { useState, useEffect } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Beranda', href: '#hero' },
        { name: 'Menu', href: '#menu' },
        { name: 'Testimoni', href: '#testimonials' },
        { name: 'Kontak', href: '#footer' },
    ];

    const handleClick = (e, href) => {
        e.preventDefault();
        setIsMobileOpen(false);
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                    ? 'glass shadow-lg shadow-black/20 border-b border-senja-700/50'
                    : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo */}
                    <a
                        href="#hero"
                        onClick={(e) => handleClick(e, '#hero')}
                        className="flex items-center gap-2 group"
                    >
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-senja-200 to-senja-100 flex items-center justify-center text-senja-900 font-display font-bold text-lg group-hover:scale-110 transition-transform">
                            S
                        </div>
                        <span className="font-display text-xl font-semibold text-senja-50 tracking-wide">
                            Senja <span className="text-senja-200">Coffee</span>
                        </span>
                    </a>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={(e) => handleClick(e, link.href)}
                                className="px-4 py-2 text-sm font-medium text-senja-300 hover:text-senja-200 transition-colors relative group"
                            >
                                {link.name}
                                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-senja-200 group-hover:w-3/4 transition-all duration-300 rounded-full" />
                            </a>
                        ))}
                        <a
                            href="#menu"
                            onClick={(e) => handleClick(e, '#menu')}
                            className="ml-4 px-5 py-2 bg-gradient-to-r from-senja-200 to-senja-100 text-senja-900 text-sm font-semibold rounded-full hover:shadow-lg hover:shadow-senja-200/20 hover:scale-105 transition-all duration-300"
                        >
                            Pesan Sekarang
                        </a>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setIsMobileOpen(!isMobileOpen)}
                        className="md:hidden p-2 text-senja-200 hover:text-senja-100 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isMobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`md:hidden overflow-hidden transition-all duration-500 ${isMobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="glass border-t border-senja-700/50 px-4 py-4 space-y-1">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={(e) => handleClick(e, link.href)}
                            className="block px-4 py-3 text-senja-300 hover:text-senja-200 hover:bg-senja-700/30 rounded-lg transition-all"
                        >
                            {link.name}
                        </a>
                    ))}
                    <a
                        href="#menu"
                        onClick={(e) => handleClick(e, '#menu')}
                        className="block mx-4 mt-2 py-3 bg-gradient-to-r from-senja-200 to-senja-100 text-senja-900 text-center font-semibold rounded-full"
                    >
                        Pesan Sekarang
                    </a>
                </div>
            </div>
        </nav>
    );
}
