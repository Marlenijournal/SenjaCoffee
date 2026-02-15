import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Menu from '../components/Menu';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';
import { getHero, getCategories, getMenuItems, getTestimonials, getSettings } from '../utils/api';

export default function LandingPage() {
    const [hero, setHero] = useState(null);
    const [categories, setCategories] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [heroRes, catRes, menuRes, testRes, settingsRes] = await Promise.all([
                    getHero(),
                    getCategories(),
                    getMenuItems(),
                    getTestimonials(),
                    getSettings(),
                ]);

                setHero(heroRes.data.data);
                setCategories(catRes.data.data);
                setMenuItems(menuRes.data.data);
                setTestimonials(testRes.data.data);
                setSettings(settingsRes.data.data);
            } catch (error) {
                console.error('Error fetching landing page data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-senja-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-senja-700 border-t-senja-200 animate-spin" />
                    <p className="text-senja-300 font-display text-lg">Memuat Senja Coffee...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-senja-900">
            <Navbar />
            <Hero data={hero} />
            <Menu categories={categories} items={menuItems} />
            <Testimonials testimonials={testimonials} />
            <Footer settings={settings} />
        </div>
    );
}
