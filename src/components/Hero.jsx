import React, { useEffect, useRef } from 'react';
import { FiChevronDown } from 'react-icons/fi';

export default function Hero({ data }) {
    const heroRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-slide-up');
                    }
                });
            },
            { threshold: 0.1 }
        );

        const elements = heroRef.current?.querySelectorAll('.hero-animate');
        elements?.forEach((el) => observer.observe(el));
        return () => elements?.forEach((el) => observer.unobserve(el));
    }, []);

    const scrollToMenu = () => {
        document.querySelector('#menu')?.scrollIntoView({ behavior: 'smooth' });
    };

    const scrollToFooter = () => {
        document.querySelector('#footer')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section
            id="hero"
            ref={heroRef}
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
            {/* Background */}
            {data?.background_image ? (
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${data.background_image})` }}
                />
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-senja-950 via-senja-900 to-senja-800" />
            )}

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-senja-950/70 via-senja-900/60 to-senja-950/90" />

            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-senja-200/5 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-32 right-10 w-96 h-96 bg-senja-200/3 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-senja-200/2 rounded-full blur-3xl" />
            </div>

            {/* Grain texture overlay */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }} />

            {/* Content */}
            <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
                {/* Badge */}
                <div className="hero-animate opacity-0 mb-6">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-senja-200/20 bg-senja-200/5 text-senja-200 text-xs sm:text-sm font-medium tracking-wider uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-senja-200 animate-pulse-soft" />
                        Premium Coffee Experience
                    </span>
                </div>

                {/* Title */}
                <h1 className="hero-animate opacity-0 font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight" style={{ animationDelay: '0.2s' }}>
                    <span className="text-gradient">{data?.title || 'Senja Coffee'}</span>
                </h1>

                {/* Subtitle */}
                <p className="hero-animate opacity-0 font-display text-lg sm:text-xl md:text-2xl text-senja-200 italic mb-4" style={{ animationDelay: '0.4s' }}>
                    {data?.subtitle || 'Nikmati Kehangatan di Setiap Tegukan'}
                </p>

                {/* Description */}
                <p className="hero-animate opacity-0 text-senja-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed" style={{ animationDelay: '0.6s' }}>
                    {data?.description || 'Kedai kopi premium dengan suasana hangat dan nyaman. Kami menyajikan kopi pilihan terbaik, minuman segar, dan hidangan lezat untuk menemani hari-harimu.'}
                </p>

                {/* CTA Buttons */}
                <div className="hero-animate opacity-0 flex flex-col sm:flex-row gap-4 justify-center" style={{ animationDelay: '0.8s' }}>
                    <button
                        onClick={scrollToMenu}
                        className="group px-8 py-3.5 bg-gradient-to-r from-senja-200 to-senja-100 text-senja-900 font-semibold rounded-full hover:shadow-2xl hover:shadow-senja-200/25 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        {data?.cta_text || 'Lihat Menu Kami'}
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                    <button
                        onClick={scrollToFooter}
                        className="px-8 py-3.5 border border-senja-200/30 text-senja-200 font-semibold rounded-full hover:bg-senja-200/10 hover:border-senja-200/60 transition-all duration-300"
                    >
                        Hubungi Kami
                    </button>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
                <button
                    onClick={scrollToMenu}
                    className="flex flex-col items-center gap-1 text-senja-400 hover:text-senja-200 transition-colors"
                    aria-label="Scroll down"
                >
                    <span className="text-xs tracking-widest uppercase">Scroll</span>
                    <FiChevronDown size={20} />
                </button>
            </div>
        </section>
    );
}
