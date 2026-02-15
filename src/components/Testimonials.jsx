import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { FiStar } from 'react-icons/fi';

function StarRating({ rating }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <FiStar
                    key={star}
                    size={14}
                    className={star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-senja-500'}
                />
            ))}
        </div>
    );
}

function TestimonialCard({ testimonial }) {
    const initials = testimonial.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="h-full bg-gradient-to-b from-senja-700/50 to-senja-800/50 rounded-2xl p-6 sm:p-8 border border-senja-600/20 hover:border-senja-200/20 transition-all duration-500 flex flex-col">
            {/* Quote mark */}
            <div className="text-senja-200/20 text-5xl font-display leading-none mb-3">"</div>

            {/* Comment */}
            <p className="text-senja-300 text-sm sm:text-base leading-relaxed flex-1 mb-6 italic">
                {testimonial.comment}
            </p>

            {/* Author */}
            <div className="flex items-center gap-3 pt-4 border-t border-senja-600/30">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-senja-200 to-senja-100 flex items-center justify-center text-senja-900 text-sm font-bold flex-shrink-0">
                    {initials}
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="text-senja-50 text-sm font-semibold truncate">{testimonial.name}</h4>
                    <StarRating rating={testimonial.rating} />
                </div>
            </div>
        </div>
    );
}

export default function Testimonials({ testimonials }) {
    if (!testimonials?.length) return null;

    return (
        <section id="testimonials" className="relative py-20 lg:py-28 bg-senja-950">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-senja-200/3 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12 lg:mb-16">
                    <span className="inline-block text-senja-200 text-sm font-medium tracking-widest uppercase mb-3">
                        Testimonials
                    </span>
                    <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-senja-50 mb-4">
                        Apa Kata <span className="text-gradient">Mereka</span>
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-transparent via-senja-200 to-transparent mx-auto mb-4" />
                    <p className="text-senja-400 text-base sm:text-lg max-w-xl mx-auto">
                        Cerita dan pengalaman nyata dari pelanggan setia Senja Coffee
                    </p>
                </div>

                {/* Swiper Carousel */}
                <Swiper
                    modules={[Autoplay, Pagination]}
                    spaceBetween={20}
                    slidesPerView={1}
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    breakpoints={{
                        640: { slidesPerView: 2, spaceBetween: 24 },
                        1024: { slidesPerView: 3, spaceBetween: 28 },
                    }}
                    className="pb-14"
                >
                    {testimonials.map((t) => (
                        <SwiperSlide key={t.id} className="h-auto">
                            <TestimonialCard testimonial={t} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}
