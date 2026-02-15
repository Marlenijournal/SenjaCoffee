const express = require('express');
const pool = require('../config/db');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Multer config for hero background
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '..', 'uploads', 'hero');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `hero-bg-${Date.now()}${ext}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|webp/;
        const ext = allowed.test(path.extname(file.originalname).toLowerCase());
        const mime = allowed.test(file.mimetype);
        if (ext && mime) return cb(null, true);
        cb(new Error('Hanya file gambar (jpg, png, webp) yang diizinkan.'));
    },
});

// GET /api/hero — Public
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM hero_settings WHERE id = 1');
        if (result.rows.length === 0) {
            return res.json({ success: true, data: null });
        }
        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Get hero error:', error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});

// PUT /api/hero — Admin
router.put('/', authMiddleware, upload.single('background_image'), async (req, res) => {
    try {
        const { title, subtitle, description, cta_text } = req.body;
        let backgroundImage = req.body.existing_image || '';

        if (req.file) {
            backgroundImage = `/uploads/hero/${req.file.filename}`;
        }

        const result = await pool.query(
            `UPDATE hero_settings 
       SET title = $1, subtitle = $2, description = $3, cta_text = $4, 
           background_image = $5, updated_at = NOW() 
       WHERE id = 1 RETURNING *`,
            [title, subtitle, description, cta_text, backgroundImage]
        );

        if (result.rows.length === 0) {
            const insertResult = await pool.query(
                `INSERT INTO hero_settings (title, subtitle, description, cta_text, background_image) 
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
                [title, subtitle, description, cta_text, backgroundImage]
            );
            return res.json({ success: true, data: insertResult.rows[0] });
        }

        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Update hero error:', error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});

module.exports = router;
