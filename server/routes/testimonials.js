const express = require('express');
const pool = require('../config/db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET /api/testimonials — Public (active only)
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM testimonials WHERE is_active = true ORDER BY created_at DESC'
        );
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Get testimonials error:', error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});

// GET /api/testimonials/all — Admin (all)
router.get('/all', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM testimonials ORDER BY created_at DESC'
        );
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Get all testimonials error:', error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});

// POST /api/testimonials — Admin
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { name, rating, comment } = req.body;

        if (!name || !comment) {
            return res.status(400).json({
                success: false,
                message: 'Nama dan komentar wajib diisi.',
            });
        }

        const result = await pool.query(
            `INSERT INTO testimonials (name, rating, comment) 
       VALUES ($1, $2, $3) RETURNING *`,
            [name, rating || 5, comment]
        );

        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Create testimonial error:', error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});

// PUT /api/testimonials/:id — Admin
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, rating, comment, is_active } = req.body;

        const result = await pool.query(
            `UPDATE testimonials 
       SET name = $1, rating = $2, comment = $3, is_active = $4
       WHERE id = $5 RETURNING *`,
            [name, rating || 5, comment, is_active !== false, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Testimonial tidak ditemukan.' });
        }

        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Update testimonial error:', error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});

// DELETE /api/testimonials/:id — Admin
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'DELETE FROM testimonials WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Testimonial tidak ditemukan.' });
        }

        res.json({ success: true, message: 'Testimonial berhasil dihapus.' });
    } catch (error) {
        console.error('Delete testimonial error:', error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});

module.exports = router;
