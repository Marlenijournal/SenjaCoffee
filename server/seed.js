const pool = require('./config/db');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function seed() {
    console.log('🌱 Starting database seed...\n');

    try {
        // ===== CREATE TABLES =====
        console.log('📋 Creating tables...');

        await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS hero_settings (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255),
        subtitle VARCHAR(255),
        description TEXT,
        cta_text VARCHAR(255),
        background_image VARCHAR(512),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS menu_categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) NOT NULL,
        sort_order INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS menu_items (
        id SERIAL PRIMARY KEY,
        category_id INTEGER REFERENCES menu_categories(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        image VARCHAR(512),
        is_active BOOLEAN DEFAULT true,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        rating INTEGER DEFAULT 5,
        comment TEXT NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS site_settings (
        id SERIAL PRIMARY KEY,
        site_name VARCHAR(255),
        whatsapp_number VARCHAR(20),
        whatsapp_message TEXT,
        instagram_url VARCHAR(512),
        tiktok_url VARCHAR(512),
        twitter_url VARCHAR(512),
        address TEXT,
        footer_text TEXT,
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
        console.log('✅ Tables created.\n');

        // ===== SEED ADMIN USER =====
        console.log('👤 Seeding admin user...');
        const existingAdmin = await pool.query('SELECT id FROM admin_users WHERE username = $1', ['admin']);
        if (existingAdmin.rows.length === 0) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin', salt);
            await pool.query(
                'INSERT INTO admin_users (username, password_hash) VALUES ($1, $2)',
                ['admin', hashedPassword]
            );
            console.log('✅ Admin user created (username: admin, password: admin)\n');
        } else {
            console.log('ℹ️  Admin user already exists.\n');
        }

        // ===== SEED HERO =====
        console.log('🖼️  Seeding hero settings...');
        const existingHero = await pool.query('SELECT id FROM hero_settings WHERE id = 1');
        if (existingHero.rows.length === 0) {
            await pool.query(
                `INSERT INTO hero_settings (title, subtitle, description, cta_text, background_image)
         VALUES ($1, $2, $3, $4, $5)`,
                [
                    'Senja Coffee',
                    'Nikmati Kehangatan di Setiap Tegukan',
                    'Kedai kopi premium dengan suasana hangat dan nyaman. Kami menyajikan kopi pilihan terbaik, minuman segar, dan hidangan lezat untuk menemani hari-harimu.',
                    'Lihat Menu Kami',
                    '',
                ]
            );
            console.log('✅ Hero settings seeded.\n');
        } else {
            console.log('ℹ️  Hero settings already exist.\n');
        }

        // ===== SEED CATEGORIES =====
        console.log('📂 Seeding menu categories...');
        const existingCats = await pool.query('SELECT id FROM menu_categories');
        if (existingCats.rows.length === 0) {
            await pool.query(`
        INSERT INTO menu_categories (name, slug, sort_order) VALUES
        ('Coffee', 'coffee', 1),
        ('Non-Coffee Drinks', 'non-coffee', 2),
        ('Food & Snack', 'food-snack', 3)
      `);
            console.log('✅ Categories seeded.\n');
        } else {
            console.log('ℹ️  Categories already exist.\n');
        }

        // ===== SEED MENU ITEMS =====
        console.log('☕ Seeding menu items...');
        const existingItems = await pool.query('SELECT id FROM menu_items');
        if (existingItems.rows.length === 0) {
            const cats = await pool.query('SELECT id, slug FROM menu_categories ORDER BY sort_order');
            const catMap = {};
            cats.rows.forEach(c => { catMap[c.slug] = c.id; });

            const menuItems = [
                // Coffee
                { cat: 'coffee', name: 'Espresso', desc: 'Kopi hitam pekat dengan crema sempurna', price: 18000, order: 1 },
                { cat: 'coffee', name: 'Americano', desc: 'Espresso dengan air panas, rasa bold dan clean', price: 22000, order: 2 },
                { cat: 'coffee', name: 'Cappuccino', desc: 'Espresso, steamed milk, dan foam lembut', price: 28000, order: 3 },
                { cat: 'coffee', name: 'Cafe Latte', desc: 'Espresso dengan susu steamed yang creamy', price: 28000, order: 4 },
                { cat: 'coffee', name: 'Mocha', desc: 'Perpaduan espresso, cokelat, dan susu', price: 32000, order: 5 },
                { cat: 'coffee', name: 'Affogato', desc: 'Espresso panas dituang di atas gelato vanilla', price: 30000, order: 6 },
                { cat: 'coffee', name: 'Caramel Macchiato', desc: 'Vanilla, susu, espresso, dan caramel drizzle', price: 32000, order: 7 },
                { cat: 'coffee', name: 'Cold Brew', desc: 'Kopi diseduh dingin 18 jam, smooth dan refreshing', price: 25000, order: 8 },
                { cat: 'coffee', name: 'Vietnam Drip', desc: 'Kopi drip khas Vietnam dengan susu kental manis', price: 24000, order: 9 },
                { cat: 'coffee', name: 'Kopi Susu Gula Aren', desc: 'Espresso, susu segar, dan gula aren asli', price: 25000, order: 10 },

                // Non-Coffee
                { cat: 'non-coffee', name: 'Matcha Latte', desc: 'Teh hijau Jepang premium dengan susu creamy', price: 28000, order: 1 },
                { cat: 'non-coffee', name: 'Hot Chocolate', desc: 'Cokelat premium dengan susu hangat dan foam', price: 25000, order: 2 },
                { cat: 'non-coffee', name: 'Thai Tea', desc: 'Teh khas Thailand dengan susu dan rempah', price: 22000, order: 3 },
                { cat: 'non-coffee', name: 'Taro Latte', desc: 'Ubi ungu blend dengan susu creamy', price: 25000, order: 4 },
                { cat: 'non-coffee', name: 'Lemon Tea', desc: 'Teh segar dengan perasan lemon asli', price: 18000, order: 5 },
                { cat: 'non-coffee', name: 'Strawberry Smoothie', desc: 'Smoothie strawberry segar dengan yogurt', price: 28000, order: 6 },
                { cat: 'non-coffee', name: 'Mango Smoothie', desc: 'Smoothie mangga tropis yang menyegarkan', price: 28000, order: 7 },
                { cat: 'non-coffee', name: 'Red Velvet Latte', desc: 'Red velvet cream cheese dengan susu dingin', price: 30000, order: 8 },
                { cat: 'non-coffee', name: 'Honey Lemon', desc: 'Air hangat dengan madu asli dan lemon segar', price: 20000, order: 9 },
                { cat: 'non-coffee', name: 'Iced Butterfly Pea', desc: 'Teh bunga telang dengan lemon, berubah warna!', price: 22000, order: 10 },

                // Food & Snack
                { cat: 'food-snack', name: 'French Fries', desc: 'Kentang goreng crispy dengan saus spesial', price: 22000, order: 1 },
                { cat: 'food-snack', name: 'Chicken Wings', desc: 'Sayap ayam goreng dengan bumbu pilihan', price: 30000, order: 2 },
                { cat: 'food-snack', name: 'Club Sandwich', desc: 'Roti panggang dengan ayam, telur, dan sayuran', price: 35000, order: 3 },
                { cat: 'food-snack', name: 'Croissant', desc: 'Croissant butter premium, renyah dan lembut', price: 20000, order: 4 },
                { cat: 'food-snack', name: 'Roti Bakar', desc: 'Roti bakar dengan selai cokelat atau keju', price: 18000, order: 5 },
                { cat: 'food-snack', name: 'Pisang Goreng Keju', desc: 'Pisang goreng crispy dengan lelehan keju', price: 20000, order: 6 },
                { cat: 'food-snack', name: 'Dimsum', desc: 'Dimsum kukus aneka isian, 5 pcs', price: 25000, order: 7 },
                { cat: 'food-snack', name: 'Pasta Aglio Olio', desc: 'Spaghetti dengan bawang putih dan olive oil', price: 32000, order: 8 },
                { cat: 'food-snack', name: 'Nachos', desc: 'Nachos tortilla dengan keju cheddar dan salsa', price: 28000, order: 9 },
                { cat: 'food-snack', name: 'Banana Split', desc: 'Pisang dengan es krim, cokelat, dan whipped cream', price: 28000, order: 10 },
            ];

            for (const item of menuItems) {
                await pool.query(
                    'INSERT INTO menu_items (category_id, name, description, price, image, sort_order) VALUES ($1, $2, $3, $4, $5, $6)',
                    [catMap[item.cat], item.name, item.desc, item.price, '', item.order]
                );
            }
            console.log(`✅ ${menuItems.length} menu items seeded.\n`);
        } else {
            console.log('ℹ️  Menu items already exist.\n');
        }

        // ===== SEED TESTIMONIALS =====
        console.log('💬 Seeding testimonials...');
        const existingTest = await pool.query('SELECT id FROM testimonials');
        if (existingTest.rows.length === 0) {
            const testimonials = [
                { name: 'Rina Sari', rating: 5, comment: 'Kopi di Senja Coffee benar-benar luar biasa! Cappuccino-nya smooth banget, suasananya juga cozy. Pasti balik lagi!' },
                { name: 'Budi Hartono', rating: 5, comment: 'Tempat favorit buat kerja remote. WiFi kencang, kopi enak, dan staffnya ramah. Kopi Susu Gula Aren nya juara!' },
                { name: 'Dian Pratiwi', rating: 4, comment: 'Matcha Latte-nya the best! Tempatnya instagramable banget. Makanannya juga enak-enak, terutama Club Sandwich nya.' },
                { name: 'Arief Rahman', rating: 5, comment: 'Cold Brew di sini beda dari yang lain. Smooth, ga pahit, dan refreshing. Snack-nya juga cocok buat nemenin ngopi.' },
                { name: 'Maya Putri', rating: 5, comment: 'Suasana senja di sini tuh magical! Kopi nya premium banget, harga terjangkau. Recommended buat date atau hangout!' },
                { name: 'Fajar Nugroho', rating: 4, comment: 'Sering banget ke sini bareng temen. Chicken Wings + Americano = combo terbaik! Pelayanannya juga cepat.' },
            ];

            for (const t of testimonials) {
                await pool.query(
                    'INSERT INTO testimonials (name, rating, comment) VALUES ($1, $2, $3)',
                    [t.name, t.rating, t.comment]
                );
            }
            console.log(`✅ ${testimonials.length} testimonials seeded.\n`);
        } else {
            console.log('ℹ️  Testimonials already exist.\n');
        }

        // ===== SEED SITE SETTINGS =====
        console.log('⚙️  Seeding site settings...');
        const existingSettings = await pool.query('SELECT id FROM site_settings WHERE id = 1');
        if (existingSettings.rows.length === 0) {
            await pool.query(
                `INSERT INTO site_settings 
         (site_name, whatsapp_number, whatsapp_message, instagram_url, tiktok_url, twitter_url, address, footer_text)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                [
                    'Senja Coffee',
                    '6281234567890',
                    'Halo admin, mau tanya menu/reservasi di Senja Coffee',
                    'https://instagram.com/senjacoffee',
                    'https://tiktok.com/@senjacoffee',
                    'https://x.com/senjacoffee',
                    'Jl. Senja No. 123, Jakarta',
                    'Senja Coffee — Nikmati kehangatan di setiap tegukan. Buka setiap hari 08:00 - 22:00',
                ]
            );
            console.log('✅ Site settings seeded.\n');
        } else {
            console.log('ℹ️  Site settings already exist.\n');
        }

        console.log('🎉 Database seed completed successfully!');
        console.log('========================================');
        console.log('Admin Login: username=admin, password=admin');
        console.log('========================================\n');

    } catch (error) {
        console.error('❌ Seed error:', error);
    } finally {
        await pool.end();
        process.exit(0);
    }
}

seed();
