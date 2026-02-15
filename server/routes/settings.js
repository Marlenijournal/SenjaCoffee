const express = require('express');
const pool = require('../config/db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET /api/settings — Public
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM site_settings WHERE id = 1');
        if (result.rows.length === 0) {
            return res.json({ success: true, data: null });
        }
        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});

// PUT /api/settings — Admin
router.put('/', authMiddleware, async (req, res) => {
    try {
        const {
            site_name,
            whatsapp_number,
            whatsapp_message,
            instagram_url,
            tiktok_url,
            twitter_url,
            address,
            footer_text,
        } = req.body;

        const result = await pool.query(
            `UPDATE site_settings 
       SET site_name = $1, whatsapp_number = $2, whatsapp_message = $3,
           instagram_url = $4, tiktok_url = $5, twitter_url = $6,
           address = $7, footer_text = $8, updated_at = NOW()
       WHERE id = 1 RETURNING *`,
            [
                site_name,
                whatsapp_number,
                whatsapp_message,
                instagram_url,
                tiktok_url,
                twitter_url,
                address,
                footer_text,
            ]
        );

        if (result.rows.length === 0) {
            const insertResult = await pool.query(
                `INSERT INTO site_settings 
         (site_name, whatsapp_number, whatsapp_message, instagram_url, tiktok_url, twitter_url, address, footer_text)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
                [
                    site_name,
                    whatsapp_number,
                    whatsapp_message,
                    instagram_url,
                    tiktok_url,
                    twitter_url,
                    address,
                    footer_text,
                ]
            );
            return res.json({ success: true, data: insertResult.rows[0] });
        }

        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});

module.exports = router;
