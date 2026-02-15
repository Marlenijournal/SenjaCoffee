import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage';
import Login from './admin/Login';
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import HeroEditor from './admin/HeroEditor';
import MenuEditor from './admin/MenuEditor';
import TestimonialEditor from './admin/TestimonialEditor';
import SettingsEditor from './admin/SettingsEditor';
import ChangePassword from './admin/ChangePassword';

export default function App() {
    return (
        <>
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: '#2c241c',
                        color: '#f5e6d3',
                        border: '1px solid #3a3028',
                    },
                    success: { iconTheme: { primary: '#c8a97e', secondary: '#2c241c' } },
                    error: { iconTheme: { primary: '#ef4444', secondary: '#2c241c' } },
                }}
            />
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/admin/login" element={<Login />} />
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="hero" element={<HeroEditor />} />
                    <Route path="menu" element={<MenuEditor />} />
                    <Route path="testimonials" element={<TestimonialEditor />} />
                    <Route path="settings" element={<SettingsEditor />} />
                    <Route path="password" element={<ChangePassword />} />
                </Route>
            </Routes>
        </>
    );
}
