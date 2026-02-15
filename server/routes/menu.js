const express = require('express');
const pool = require('../config/db');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Multer config for menu images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '..', 'uploads', 'menu');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `menu-${Date.now()}${ext}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 3 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|webp/;
        const ext = allowed.test(path.extname(file.originalname).toLowerCase());
        const mime = allowed.test(file.mimetype);
        if (ext && mime) return cb(null, true);
        cb(new Error('Hanya file gambar (jpg, png, webp) yang diizinkan.'));
    },
});

// ========== CATEGORIES ==========

// GET /api/menu/categories — Public
router.get('/categories', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM menu_categories ORDER BY sort_order ASC'
        );
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});

// ========== MENU ITEMS ==========

// GET /api/menu/items — Public (active only)
router.get('/items', async (req, res) => {
    try {
        const { category_id } = req.query;
        let query = `
      SELECT mi.*, mc.name as category_name, mc.slug as category_slug
      FROM menu_items mi
      JOIN menu_categories mc ON mi.category_id = mc.id
      WHERE mi.is_active = true
    `;
        const params = [];

        if (category_id) {
            params.push(category_id);
            query += ` AND mi.category_id = $${params.length}`;
        }

        query += ' ORDER BY mc.sort_order ASC, mi.sort_order ASC';
        const result = await pool.query(query, params);
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Get menu items error:', error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});

// GET /api/menu/items/all — Admin (all items)
router.get('/items/all', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT mi.*, mc.name as category_name, mc.slug as category_slug
      FROM menu_items mi
      JOIN menu_categories mc ON mi.category_id = mc.id
      ORDER BY mc.sort_order ASC, mi.sort_order ASC
    `);
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Get all menu items error:', error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});

// POST /api/menu/items — Admin
router.post('/items', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        const { name, description, price, category_id, sort_order } = req.body;
        let image = '';

        if (req.file) {
            image = `/uploads/menu/${req.file.filename}`;
        }

        const result = await pool.query(
            `INSERT INTO menu_items (name, description, price, category_id, image, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [name, description, price, category_id, image, sort_order || 0]
        );

        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Create menu item error:', error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});

// PUT /api/menu/items/:id — Admin
router.put('/items/:id', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, category_id, sort_order, is_active } = req.body;
        let image = req.body.existing_image || '';

        if (req.file) {
            image = `/uploads/menu/${req.file.filename}`;
        }

        const result = await pool.query(
            `UPDATE menu_items 
       SET name = $1, description = $2, price = $3, category_id = $4, 
           image = $5, sort_order = $6, is_active = $7
       WHERE id = $8 RETURNING *`,
            [name, description, price, category_id, image, sort_order || 0, is_active !== 'false', id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Menu item tidak ditemukan.' });
        }

        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Update menu item error:', error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});

// DELETE /api/menu/items/:id — Admin
router.delete('/items/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'DELETE FROM menu_items WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Menu item tidak ditemukan.' });
        }

        // Remove old image file
        if (result.rows[0].image) {
            const filePath = path.join(__dirname, '..', result.rows[0].image);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }

        res.json({ success: true, message: 'Menu item berhasil dihapus.' });
    } catch (error) {
        console.error('Delete menu item error:', error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});

module.exports = router;
