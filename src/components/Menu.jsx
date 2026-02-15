import React, { useState, useEffect, useRef } from 'react';
import { FiCoffee } from 'react-icons/fi';

const categoryIcons = {
    coffee: '☕',
    'non-coffee': '🧋',
    'food-snack': '🍽️',
};

function MenuCard({ item, index }) {
    const cardRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { threshold: 0.1 }
        );
        if (cardRef.current) observer.observe(cardRef.current);
        return () => { if (cardRef.current) observer.unobserve(cardRef.current); };
    }, []);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div
            ref={cardRef}
            className={`group relative bg-gradient-to-b from-senja-700/80 to-senja-800/80 rounded-2xl overflow-hidden border border-senja-600/30 hover:border-senja-200/30 transition-all duration-500 hover:shadow-xl hover:shadow-senja-200/5 hover:-translate-y-1 ${isVisible ? 'animate-slide-up' : 'opacity-0'
                }`}
            style={{ animationDelay: `${index * 0.08}s` }}
        >
            {/* Image */}
            <div className="relative h-44 overflow-hidden">
                {item.image ? (
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-senja-600 to-senja-700 flex items-center justify-center">
                        <FiCoffee className="text-senja-400 text-4xl group-hover:scale-110 group-hover:text-senja-200 transition-all duration-500" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-senja-800/60 to-transparent" />

                {/* Price Badge */}
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-senja-900/80 backdrop-blur-sm border border-senja-200/20">
                    <span className="text-senja-200 text-sm font-semibold">{formatPrice(item.price)}</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="font-display text-lg font-semibold text-senja-50 mb-1 group-hover:text-senja-200 transition-colors">
                    {item.name}
                </h3>
                <p className="text-senja-400 text-sm leading-relaxed line-clamp-2">
                    {item.description}
                </p>
            </div>

            {/* Hover glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" style={{
                background: 'radial-gradient(circle at 50% 0%, rgba(200,169,126,0.06) 0%, transparent 70%)',
            }} />
        </div>
    );
}

export default function Menu({ categories, items }) {
    const [activeCategory, setActiveCategory] = useState(null);
    const sectionRef = useRef(null);

    useEffect(() => {
        if (categories?.length > 0 && !activeCategory) {
            setActiveCategory(categories[0].id);
        }
    }, [categories]);

    const filteredItems = items?.filter(
        (item) => item.category_id === activeCategory
    ) || [];

    return (
        <section id="menu" className="relative py-20 lg:py-28 bg-senja-900" ref={sectionRef}>
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-senja-200/3 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-senja-200/3 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12 lg:mb-16">
                    <span className="inline-block text-senja-200 text-sm font-medium tracking-widest uppercase mb-3">
                        Our Menu
                    </span>
                    <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-senja-50 mb-4">
                        Menu <span className="text-gradient">Pilihan</span> Kami
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-transparent via-senja-200 to-transparent mx-auto mb-4" />
                    <p className="text-senja-400 text-base sm:text-lg max-w-xl mx-auto">
                        Temukan beragam pilihan kopi, minuman segar, dan hidangan lezat yang kami sajikan dengan penuh cinta
                    </p>
                </div>

                {/* Category Tabs */}
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 lg:mb-14">
                    {categories?.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-all duration-300 flex items-center gap-2 ${activeCategory === cat.id
                                    ? 'bg-gradient-to-r from-senja-200 to-senja-100 text-senja-900 shadow-lg shadow-senja-200/20 scale-105'
                                    : 'bg-senja-700/50 text-senja-300 hover:bg-senja-700 hover:text-senja-200 border border-senja-600/30'
                                }`}
                        >
                            <span>{categoryIcons[cat.slug] || '📋'}</span>
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Menu Grid — 5 columns on xl */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-5">
                    {filteredItems.map((item, index) => (
                        <MenuCard key={item.id} item={item} index={index} />
                    ))}
                </div>

                {filteredItems.length === 0 && (
                    <div className="text-center py-16">
                        <FiCoffee className="mx-auto text-5xl text-senja-500 mb-4" />
                        <p className="text-senja-400 text-lg">Belum ada menu untuk kategori ini</p>
                    </div>
                )}
            </div>
        </section>
    );
}
