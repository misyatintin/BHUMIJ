const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// API to get content by language (for AJAX calls)
router.get('/content/:table', async (req, res) => {
    try {
        const lang = req.query.lang || 'en';
        const [rows] = await pool.query(`SELECT * FROM ?? ORDER BY sort_order`, [req.params.table]);
        res.json({ success: true, data: rows, lang });
    } catch (err) {
        res.json({ success: false, error: err.message });
    }
});

module.exports = router;
