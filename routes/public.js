const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Helper to get content by language
function t(row, field, lang) {
    if (!row) return '';
    const val = row[field + '_' + lang];
    if (val && val.trim()) return val;
    return row[field + '_en'] || row[field + '_bn'] || '';
}

// Home page
router.get('/', async (req, res) => {
    try {
        const lang = res.locals.lang;


        const [greetings] = await pool.query('SELECT * FROM greeting_messages WHERE is_active = 1 ORDER BY sort_order');
        const [achievements] = await pool.query('SELECT * FROM achievements WHERE is_active = 1 ORDER BY sort_order');
        const [meetings] = await pool.query('SELECT * FROM meetings ORDER BY sort_order');
        const [categories] = await pool.query('SELECT * FROM gallery_categories ORDER BY sort_order');
        const [galleryImages] = await pool.query('SELECT gi.*, gc.name_en as cat_name_en, gc.name_bn as cat_name_bn FROM gallery_images gi JOIN gallery_categories gc ON gi.category_id = gc.id WHERE gi.is_active = 1 ORDER BY gi.sort_order');
        const [poems] = await pool.query('SELECT * FROM poems WHERE is_active = 1 ORDER BY sort_order');
        const [articles] = await pool.query('SELECT * FROM articles WHERE is_active = 1 ORDER BY sort_order');
        const [members] = await pool.query('SELECT * FROM board_members WHERE is_active = 1 ORDER BY sort_order');
        const [heroSlides] = await pool.query('SELECT * FROM hero_slides WHERE is_active = 1 ORDER BY sort_order');
        const [tourActivities] = await pool.query('SELECT * FROM tour_activities ORDER BY sort_order');
        const [boardInfo] = await pool.query('SELECT * FROM board_info ORDER BY sort_order');
        // New sections from original HTML template
        const [etymologyCards] = await pool.query('SELECT * FROM etymology_cards WHERE is_active = 1 ORDER BY sort_order');
        const [geoStates] = await pool.query('SELECT * FROM geographic_states WHERE is_active = 1 ORDER BY sort_order');
        const [initiatives] = await pool.query('SELECT * FROM initiatives WHERE is_active = 1 ORDER BY sort_order');
        const [cultureCards] = await pool.query('SELECT * FROM culture_cards WHERE is_active = 1 ORDER BY sort_order');
        const [timelineEvents] = await pool.query('SELECT * FROM timeline_events WHERE is_active = 1 ORDER BY sort_order');
        const [notablePeople] = await pool.query('SELECT * FROM notable_people WHERE is_active = 1 ORDER BY sort_order');

        const settingsMap = res.locals.settingsMap;

        res.render('index', {
            title: lang === 'bn' ? settingsMap.site_title?.bn : settingsMap.site_title?.en,
            t, greetings, achievements, meetings, categories, galleryImages, poems, articles, members, heroSlides, tourActivities, boardInfo,
            etymologyCards, geoStates, initiatives, cultureCards, timelineEvents, notablePeople
        });
    } catch (err) {
        console.error('Error loading home page:', err);
        res.status(500).send('Server Error');
    }
});

// Article detail page
router.get('/article/:slug', async (req, res) => {
    try {
        const lang = res.locals.lang;
        const [rows] = await pool.query('SELECT * FROM articles WHERE slug = ?', [req.params.slug]);
        if (!rows.length) return res.status(404).render('404', { title: 'Not Found' });

        res.render('article', { article: rows[0], t, title: t(rows[0], 'title', lang) });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Greeting detail page
router.get('/greeting/:id', async (req, res) => {
    try {
        const lang = res.locals.lang;
        const [rows] = await pool.query('SELECT * FROM greeting_messages WHERE id = ?', [req.params.id]);
        if (!rows.length) return res.status(404).render('404', { title: 'Not Found', lang });
        const [allGreetings] = await pool.query('SELECT * FROM greeting_messages WHERE is_active = 1 ORDER BY sort_order');

        res.render('greeting', { greeting: rows[0], allGreetings, t, title: t(rows[0], 'person_name', lang) });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Gallery page
router.get('/gallery', async (req, res) => {
    try {
        const lang = res.locals.lang;
        const [categories] = await pool.query('SELECT * FROM gallery_categories ORDER BY sort_order');
        const [images] = await pool.query('SELECT gi.*, gc.name_en as cat_name_en, gc.name_bn as cat_name_bn FROM gallery_images gi JOIN gallery_categories gc ON gi.category_id = gc.id WHERE gi.is_active = 1 ORDER BY gc.sort_order, gi.sort_order');

        res.render('gallery', { categories, images, t, title: lang === 'bn' ? 'ফটো গ্যালারি' : 'Photo Gallery' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Gallery detail page
router.get('/gallery/image/:id', async (req, res) => {
    try {
        const lang = res.locals.lang;
        const [images] = await pool.query(`
            SELECT gi.*, gc.name_en as cat_name_en, gc.name_bn as cat_name_bn 
            FROM gallery_images gi 
            JOIN gallery_categories gc ON gi.category_id = gc.id 
            WHERE gi.id = ?`, [req.params.id]);
        
        if (!images.length) return res.status(404).render('404', { title: 'Not Found', lang });
        

        
        res.render('gallery-detail', { 
            image: images[0], 
            t, 
            title: t(images[0], 'caption', lang) 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
