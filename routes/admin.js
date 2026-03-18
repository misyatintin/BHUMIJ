const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const pool = require('../config/database');
const { authRequired } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname))
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// Login page
router.get('/login', (req, res) => {
    if (req.session.user) return res.redirect('/admin');
    res.render('admin/login', { error: null, title: 'Admin Login' });
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const [users] = await pool.query('SELECT * FROM admin_users WHERE username = ?', [username]);
        if (!users.length) return res.render('admin/login', { error: 'Invalid credentials', title: 'Admin Login' });
        const valid = await bcrypt.compare(password, users[0].password);
        if (!valid) return res.render('admin/login', { error: 'Invalid credentials', title: 'Admin Login' });
        req.session.user = { id: users[0].id, username: users[0].username, fullName: users[0].full_name };
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.render('admin/login', { error: 'Server error', title: 'Admin Login' });
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login');
});

// Dashboard
router.get('/', authRequired, async (req, res) => {
    try {
        const [greetings] = await pool.query('SELECT COUNT(*) as count FROM greeting_messages');
        const [members] = await pool.query('SELECT COUNT(*) as count FROM board_members');
        const [articles] = await pool.query('SELECT COUNT(*) as count FROM articles');
        const [images] = await pool.query('SELECT COUNT(*) as count FROM gallery_images');
        const [poems] = await pool.query('SELECT COUNT(*) as count FROM poems');
        const [meetings] = await pool.query('SELECT COUNT(*) as count FROM meetings');
        const [etymology] = await pool.query('SELECT COUNT(*) as count FROM etymology_cards');
        const [geography] = await pool.query('SELECT COUNT(*) as count FROM geographic_states');
        const [initiatives] = await pool.query('SELECT COUNT(*) as count FROM initiatives');
        const [culture] = await pool.query('SELECT COUNT(*) as count FROM culture_cards');
        const [timeline] = await pool.query('SELECT COUNT(*) as count FROM timeline_events');
        const [notable] = await pool.query('SELECT COUNT(*) as count FROM notable_people');
        const [achievements] = await pool.query('SELECT COUNT(*) as count FROM achievements');
        const [boardInfo] = await pool.query('SELECT COUNT(*) as count FROM board_info');
        const [tours] = await pool.query('SELECT COUNT(*) as count FROM tour_activities');

        res.render('admin/dashboard', {
            title: 'Dashboard',
            stats: { 
                greetings: greetings[0].count, 
                members: members[0].count, 
                articles: articles[0].count, 
                images: images[0].count, 
                poems: poems[0].count, 
                meetings: meetings[0].count,
                etymology: etymology[0].count,
                geography: geography[0].count,
                initiatives: initiatives[0].count,
                culture: culture[0].count,
                timeline: timeline[0].count,
                notable: notable[0].count,
                achievements: achievements[0].count,
                boardInfo: boardInfo[0].count,
                tours: tours[0].count
            }
        });
    } catch (err) {
        console.error(err); res.status(500).send('Error');
    }
});

// --- GREETINGS ---
router.get('/greetings', authRequired, async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM greeting_messages ORDER BY sort_order');
    res.render('admin/greetings', { title: 'Greeting Messages', greetings: rows, success: req.query.success });
});

router.get('/greetings/add', authRequired, (req, res) => {
    res.render('admin/greeting-form', { title: 'Add Greeting', greeting: null });
});

router.get('/greetings/edit/:id', authRequired, async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM greeting_messages WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.redirect('/admin/greetings');
    res.render('admin/greeting-form', { title: 'Edit Greeting', greeting: rows[0] });
});

router.post('/greetings/save', authRequired, upload.single('image'), async (req, res) => {
    const { id, person_name_en, person_name_bn, designation_en, designation_bn, message_en, message_bn, sort_order } = req.body;
    const image_path = req.file ? req.file.filename : req.body.existing_image;
    if (id) {
        await pool.query('UPDATE greeting_messages SET person_name_en=?, person_name_bn=?, designation_en=?, designation_bn=?, message_en=?, message_bn=?, image_path=?, sort_order=? WHERE id=?',
            [person_name_en, person_name_bn, designation_en, designation_bn, message_en, message_bn, image_path, sort_order || 0, id]);
    } else {
        await pool.query('INSERT INTO greeting_messages (person_name_en, person_name_bn, designation_en, designation_bn, message_en, message_bn, image_path, sort_order) VALUES (?,?,?,?,?,?,?,?)',
            [person_name_en, person_name_bn, designation_en, designation_bn, message_en, message_bn, image_path, sort_order || 0]);
    }
    res.redirect('/admin/greetings?success=1');
});

router.get('/greetings/delete/:id', authRequired, async (req, res) => {
    await pool.query('DELETE FROM greeting_messages WHERE id = ?', [req.params.id]);
    res.redirect('/admin/greetings?success=1');
});

// --- ARTICLES ---
router.get('/articles', authRequired, async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM articles ORDER BY sort_order');
    res.render('admin/articles', { title: 'Articles', articles: rows, success: req.query.success });
});

router.get('/articles/add', authRequired, (req, res) => {
    res.render('admin/article-form', { title: 'Add Article', article: null });
});

router.get('/articles/edit/:id', authRequired, async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM articles WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.redirect('/admin/articles');
    res.render('admin/article-form', { title: 'Edit Article', article: rows[0] });
});

router.post('/articles/save', authRequired, upload.single('image'), async (req, res) => {
    const { id, slug, title_en, title_bn, content_en, content_bn, author_en, author_bn, article_type, sort_order } = req.body;
    const image_path = req.file ? req.file.filename : req.body.existing_image;
    if (id) {
        await pool.query('UPDATE articles SET slug=?, title_en=?, title_bn=?, content_en=?, content_bn=?, author_en=?, author_bn=?, image_path=?, article_type=?, sort_order=? WHERE id=?',
            [slug, title_en, title_bn, content_en, content_bn, author_en, author_bn, image_path, article_type, sort_order || 0, id]);
    } else {
        await pool.query('INSERT INTO articles (slug, title_en, title_bn, content_en, content_bn, author_en, author_bn, image_path, article_type, sort_order) VALUES (?,?,?,?,?,?,?,?,?,?)',
            [slug, title_en, title_bn, content_en, content_bn, author_en, author_bn, image_path, article_type, sort_order || 0]);
    }
    res.redirect('/admin/articles?success=1');
});

router.get('/articles/delete/:id', authRequired, async (req, res) => {
    await pool.query('DELETE FROM articles WHERE id = ?', [req.params.id]);
    res.redirect('/admin/articles?success=1');
});

// --- MEMBERS ---
router.get('/members', authRequired, async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM board_members ORDER BY sort_order');
    res.render('admin/members', { title: 'Board Members', members: rows, success: req.query.success });
});

router.get('/members/add', authRequired, (req, res) => {
    res.render('admin/member-form', { title: 'Add Member', member: null });
});

router.get('/members/edit/:id', authRequired, async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM board_members WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.redirect('/admin/members');
    res.render('admin/member-form', { title: 'Edit Member', member: rows[0] });
});

router.post('/members/save', authRequired, upload.single('image'), async (req, res) => {
    const { id, sl_no, name_en, name_bn, designation_en, designation_bn, address_en, address_bn, phone, member_type, sort_order } = req.body;
    const image_path = req.file ? req.file.filename : req.body.existing_image;
    if (id) {
        await pool.query('UPDATE board_members SET sl_no=?, name_en=?, name_bn=?, designation_en=?, designation_bn=?, address_en=?, address_bn=?, phone=?, image_path=?, member_type=?, sort_order=? WHERE id=?',
            [sl_no, name_en, name_bn, designation_en, designation_bn, address_en, address_bn, phone, image_path, member_type, sort_order || 0, id]);
    } else {
        await pool.query('INSERT INTO board_members (sl_no, name_en, name_bn, designation_en, designation_bn, address_en, address_bn, phone, image_path, member_type, sort_order) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
            [sl_no, name_en, name_bn, designation_en, designation_bn, address_en, address_bn, phone, image_path, member_type, sort_order || 0]);
    }
    res.redirect('/admin/members?success=1');
});

router.get('/members/delete/:id', authRequired, async (req, res) => {
    await pool.query('DELETE FROM board_members WHERE id = ?', [req.params.id]);
    res.redirect('/admin/members?success=1');
});

// --- POEMS ---
router.get('/poems', authRequired, async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM poems ORDER BY sort_order');
    res.render('admin/poems', { title: 'Poems', poems: rows, success: req.query.success });
});

router.get('/poems/add', authRequired, (req, res) => {
    res.render('admin/poem-form', { title: 'Add Poem', poem: null });
});

router.get('/poems/edit/:id', authRequired, async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM poems WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.redirect('/admin/poems');
    res.render('admin/poem-form', { title: 'Edit Poem', poem: rows[0] });
});

router.post('/poems/save', authRequired, async (req, res) => {
    const { id, title_en, title_bn, content_en, content_bn, author_en, author_bn, sort_order } = req.body;
    if (id) {
        await pool.query('UPDATE poems SET title_en=?, title_bn=?, content_en=?, content_bn=?, author_en=?, author_bn=?, sort_order=? WHERE id=?',
            [title_en, title_bn, content_en, content_bn, author_en, author_bn, sort_order || 0, id]);
    } else {
        await pool.query('INSERT INTO poems (title_en, title_bn, content_en, content_bn, author_en, author_bn, sort_order) VALUES (?,?,?,?,?,?,?)',
            [title_en, title_bn, content_en, content_bn, author_en, author_bn, sort_order || 0]);
    }
    res.redirect('/admin/poems?success=1');
});

router.get('/poems/delete/:id', authRequired, async (req, res) => {
    await pool.query('DELETE FROM poems WHERE id = ?', [req.params.id]);
    res.redirect('/admin/poems?success=1');
});

// --- GALLERY ---
router.get('/gallery', authRequired, async (req, res) => {
    const [categories] = await pool.query('SELECT * FROM gallery_categories ORDER BY sort_order');
    const [images] = await pool.query('SELECT gi.*, gc.name_en as cat_name FROM gallery_images gi JOIN gallery_categories gc ON gi.category_id = gc.id ORDER BY gi.sort_order');
    res.render('admin/gallery', { title: 'Gallery', categories, images, success: req.query.success });
});

router.post('/gallery/category/save', authRequired, async (req, res) => {
    const { id, name_en, name_bn, description_en, description_bn, sort_order } = req.body;
    if (id) {
        await pool.query('UPDATE gallery_categories SET name_en=?, name_bn=?, description_en=?, description_bn=?, sort_order=? WHERE id=?',
            [name_en, name_bn, description_en, description_bn, sort_order || 0, id]);
    } else {
        await pool.query('INSERT INTO gallery_categories (name_en, name_bn, description_en, description_bn, sort_order) VALUES (?,?,?,?,?)',
            [name_en, name_bn, description_en, description_bn, sort_order || 0]);
    }
    res.redirect('/admin/gallery?success=1');
});

router.post('/gallery/image/save', authRequired, upload.single('image'), async (req, res) => {
    const { category_id, caption_en, caption_bn, sort_order } = req.body;
    if (req.file) {
        await pool.query('INSERT INTO gallery_images (category_id, image_path, caption_en, caption_bn, sort_order) VALUES (?,?,?,?,?)',
            [category_id, req.file.filename, caption_en, caption_bn, sort_order || 0]);
    }
    res.redirect('/admin/gallery?success=1');
});

router.get('/gallery/image/delete/:id', authRequired, async (req, res) => {
    await pool.query('DELETE FROM gallery_images WHERE id = ?', [req.params.id]);
    res.redirect('/admin/gallery?success=1');
});

// --- MEETINGS ---
router.get('/meetings', authRequired, async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM meetings ORDER BY sort_order');
    res.render('admin/meetings', { title: 'Meetings', meetings: rows, success: req.query.success });
});

router.get('/meetings/add', authRequired, (req, res) => {
    res.render('admin/meeting-form', { title: 'Add Meeting', meeting: null });
});

router.get('/meetings/edit/:id', authRequired, async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM meetings WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.redirect('/admin/meetings');
    res.render('admin/meeting-form', { title: 'Edit Meeting', meeting: rows[0] });
});

router.post('/meetings/save', authRequired, async (req, res) => {
    const { id, meeting_number, meeting_date, title_en, title_bn, content_en, content_bn, sort_order } = req.body;
    if (id) {
        await pool.query('UPDATE meetings SET meeting_number=?, meeting_date=?, title_en=?, title_bn=?, content_en=?, content_bn=?, sort_order=? WHERE id=?',
            [meeting_number, meeting_date, title_en, title_bn, content_en, content_bn, sort_order || 0, id]);
    } else {
        await pool.query('INSERT INTO meetings (meeting_number, meeting_date, title_en, title_bn, content_en, content_bn, sort_order) VALUES (?,?,?,?,?,?,?)',
            [meeting_number, meeting_date, title_en, title_bn, content_en, content_bn, sort_order || 0]);
    }
    res.redirect('/admin/meetings?success=1');
});

router.get('/meetings/delete/:id', authRequired, async (req, res) => {
    await pool.query('DELETE FROM meetings WHERE id = ?', [req.params.id]);
    res.redirect('/admin/meetings?success=1');
});

// --- SETTINGS ---
router.get('/settings', authRequired, async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM site_settings ORDER BY id');
    res.render('admin/settings', { title: 'Site Settings', settings: rows, success: req.query.success });
});

router.post('/settings/save', authRequired, upload.fields([{ name: 'site_logo', maxCount: 1 }, { name: 'site_favicon', maxCount: 1 }]), async (req, res) => {
    try {
        const { keys, values_en, values_bn } = req.body;
        
        // Handle text settings
        if (keys) {
            const keysArr = Array.isArray(keys) ? keys : [keys];
            const valuesEnArr = Array.isArray(values_en) ? values_en : [values_en];
            const valuesBnArr = Array.isArray(values_bn) ? values_bn : [values_bn];

            let textIndex = 0;
            for (let i = 0; i < keysArr.length; i++) {
                const key = keysArr[i];
                // Skip logo and favicon in the text value loop as they don't have corresponding values_en/values_bn inputs
                if (key === 'site_logo' || key === 'site_favicon') continue;
                
                if (valuesEnArr[textIndex] !== undefined && valuesBnArr[textIndex] !== undefined) {
                    await pool.query('UPDATE site_settings SET setting_value_en=?, setting_value_bn=? WHERE setting_key=?',
                        [valuesEnArr[textIndex], valuesBnArr[textIndex], key]);
                }
                textIndex++;
            }
        }

        // Handle Logo
        if (req.files['site_logo']) {
            const logoPath = req.files['site_logo'][0].filename;
            await pool.query('UPDATE site_settings SET setting_value_en=?, setting_value_bn=? WHERE setting_key=?',
                [logoPath, logoPath, 'site_logo']);
        }

        // Handle Favicon
        if (req.files['site_favicon']) {
            const faviconPath = req.files['site_favicon'][0].filename;
            await pool.query('UPDATE site_settings SET setting_value_en=?, setting_value_bn=? WHERE setting_key=?',
                [faviconPath, faviconPath, 'site_favicon']);
        }

        res.redirect('/admin/settings?success=1');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error saving settings');
    }
});

// --- HERO SLIDES ---
router.get('/slides', authRequired, async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM hero_slides ORDER BY sort_order');
    res.render('admin/slides', { title: 'Hero Slides', slides: rows, success: req.query.success });
});

router.post('/slides/save', authRequired, upload.single('image'), async (req, res) => {
    const { title_en, title_bn, subtitle_en, subtitle_bn, sort_order } = req.body;
    if (req.file) {
        await pool.query('INSERT INTO hero_slides (image_path, title_en, title_bn, subtitle_en, subtitle_bn, sort_order) VALUES (?,?,?,?,?,?)',
            [req.file.filename, title_en, title_bn, subtitle_en, subtitle_bn, sort_order || 0]);
    }
    res.redirect('/admin/slides?success=1');
});

router.get('/slides/delete/:id', authRequired, async (req, res) => {
    await pool.query('DELETE FROM hero_slides WHERE id = ?', [req.params.id]);
    res.redirect('/admin/slides?success=1');
});

// --- ETYMOLOGY ---
router.get('/etymology', authRequired, async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM etymology_cards ORDER BY sort_order');
    res.render('admin/etymology', { title: 'Etymology', cards: rows, success: req.query.success });
});
router.post('/etymology/save', authRequired, async (req, res) => {
    const { id, icon, title_en, title_bn, content_en, content_bn, sort_order } = req.body;
    if (id) await pool.query('UPDATE etymology_cards SET icon=?, title_en=?, title_bn=?, content_en=?, content_bn=?, sort_order=? WHERE id=?', [icon, title_en, title_bn, content_en, content_bn, sort_order, id]);
    else await pool.query('INSERT INTO etymology_cards (icon, title_en, title_bn, content_en, content_bn, sort_order) VALUES (?,?,?,?,?,?)', [icon, title_en, title_bn, content_en, content_bn, sort_order]);
    res.redirect('/admin/etymology?success=1');
});
router.get('/etymology/delete/:id', authRequired, async (req, res) => {
    await pool.query('DELETE FROM etymology_cards WHERE id = ?', [req.params.id]);
    res.redirect('/admin/etymology?success=1');
});

// --- GEOGRAPHY ---
router.get('/geography', authRequired, async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM geographic_states ORDER BY sort_order');
    res.render('admin/geography', { title: 'Geography (Map)', states: rows, success: req.query.success });
});
router.post('/geography/save', authRequired, upload.single('image'), async (req, res) => {
    const { id, state_code, name_en, name_bn, subtitle_en, subtitle_bn, description_en, description_bn, svg_path, text_x, text_y, sort_order, population, population_bn, latitude, longitude } = req.body;
    const image_path = req.file ? req.file.filename : req.body.existing_image;
    if (id) await pool.query('UPDATE geographic_states SET state_code=?, name_en=?, name_bn=?, subtitle_en=?, subtitle_bn=?, description_en=?, description_bn=?, svg_path=?, text_x=?, text_y=?, image_path=?, sort_order=?, population=?, population_bn=?, latitude=?, longitude=? WHERE id=?', 
        [state_code, name_en, name_bn, subtitle_en, subtitle_bn, description_en, description_bn, svg_path, text_x, text_y, image_path, sort_order, population, population_bn, latitude, longitude, id]);
    else await pool.query('INSERT INTO geographic_states (state_code, name_en, name_bn, subtitle_en, subtitle_bn, description_en, description_bn, svg_path, text_x, text_y, image_path, sort_order, population, population_bn, latitude, longitude) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', 
        [state_code, name_en, name_bn, subtitle_en, subtitle_bn, description_en, description_bn, svg_path, text_x, text_y, image_path, sort_order, population, population_bn, latitude, longitude]);
    res.redirect('/admin/geography?success=1');
});
router.get('/geography/delete/:id', authRequired, async (req, res) => {
    await pool.query('DELETE FROM geographic_states WHERE id = ?', [req.params.id]);
    res.redirect('/admin/geography?success=1');
});

// --- INITIATIVES ---
router.get('/initiatives', authRequired, async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM initiatives ORDER BY sort_order');
    res.render('admin/initiatives', { title: 'Government Initiatives', initiatives: rows, success: req.query.success });
});
router.post('/initiatives/save', authRequired, async (req, res) => {
    const { id, icon, title_en, title_bn, content_en, content_bn, features_en, features_bn, sort_order } = req.body;
    if (id) await pool.query('UPDATE initiatives SET icon=?, title_en=?, title_bn=?, content_en=?, content_bn=?, features_en=?, features_bn=?, sort_order=? WHERE id=?', [icon, title_en, title_bn, content_en, content_bn, features_en, features_bn, sort_order, id]);
    else await pool.query('INSERT INTO initiatives (icon, title_en, title_bn, content_en, content_bn, features_en, features_bn, sort_order) VALUES (?,?,?,?,?,?,?,?)', [icon, title_en, title_bn, content_en, content_bn, features_en, features_bn, sort_order]);
    res.redirect('/admin/initiatives?success=1');
});
router.get('/initiatives/delete/:id', authRequired, async (req, res) => {
    await pool.query('DELETE FROM initiatives WHERE id = ?', [req.params.id]);
    res.redirect('/admin/initiatives?success=1');
});

// --- CULTURE ---
router.get('/culture', authRequired, async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM culture_cards ORDER BY sort_order');
    res.render('admin/culture', { title: 'Culture & Heritage', cards: rows, success: req.query.success });
});
router.post('/culture/save', authRequired, async (req, res) => {
    const { id, icon, color, title_en, title_bn, content_en, content_bn, image_url, sort_order } = req.body;
    if (id) await pool.query('UPDATE culture_cards SET icon=?, color=?, title_en=?, title_bn=?, content_en=?, content_bn=?, image_url=?, sort_order=? WHERE id=?', [icon, color, title_en, title_bn, content_en, content_bn, image_url, sort_order, id]);
    else await pool.query('INSERT INTO culture_cards (icon, color, title_en, title_bn, content_en, content_bn, image_url, sort_order) VALUES (?,?,?,?,?,?,?,?)', [icon, color, title_en, title_bn, content_en, content_bn, image_url, sort_order]);
    res.redirect('/admin/culture?success=1');
});
router.get('/culture/delete/:id', authRequired, async (req, res) => {
    await pool.query('DELETE FROM culture_cards WHERE id = ?', [req.params.id]);
    res.redirect('/admin/culture?success=1');
});

// --- TIMELINE ---
router.get('/timeline', authRequired, async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM timeline_events ORDER BY sort_order');
    res.render('admin/timeline', { title: 'Timeline Events', events: rows, success: req.query.success });
});
router.post('/timeline/save', authRequired, async (req, res) => {
    const { id, period_code, period_label_en, period_label_bn, title_en, title_bn, description_en, description_bn, sort_order } = req.body;
    if (id) await pool.query('UPDATE timeline_events SET period_code=?, period_label_en=?, period_label_bn=?, title_en=?, title_bn=?, description_en=?, description_bn=?, sort_order=? WHERE id=?', [period_code, period_label_en, period_label_bn, title_en, title_bn, description_en, description_bn, sort_order, id]);
    else await pool.query('INSERT INTO timeline_events (period_code, period_label_en, period_label_bn, title_en, title_bn, description_en, description_bn, sort_order) VALUES (?,?,?,?,?,?,?,?)', [period_code, period_label_en, period_label_bn, title_en, title_bn, description_en, description_bn, sort_order]);
    res.redirect('/admin/timeline?success=1');
});
router.get('/timeline/delete/:id', authRequired, async (req, res) => {
    await pool.query('DELETE FROM timeline_events WHERE id = ?', [req.params.id]);
    res.redirect('/admin/timeline?success=1');
});

// --- NOTABLE PEOPLE ---
router.get('/notable', authRequired, async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM notable_people ORDER BY sort_order');
    res.render('admin/notable', { title: 'Notable People', people: rows, success: req.query.success });
});
router.post('/notable/save', authRequired, upload.single('image'), async (req, res) => {
    const { id, name_en, name_bn, title_en, title_bn, description_en, description_bn, sort_order } = req.body;
    const image_path = req.file ? req.file.filename : req.body.existing_image;
    if (id) await pool.query('UPDATE notable_people SET name_en=?, name_bn=?, title_en=?, title_bn=?, description_en=?, description_bn=?, image_path=?, sort_order=? WHERE id=?', [name_en, name_bn, title_en, title_bn, description_en, description_bn, image_path, sort_order, id]);
    else await pool.query('INSERT INTO notable_people (name_en, name_bn, title_en, title_bn, description_en, description_bn, image_path, sort_order) VALUES (?,?,?,?,?,?,?,?)', [name_en, name_bn, title_en, title_bn, description_en, description_bn, image_path, sort_order]);
    res.redirect('/admin/notable?success=1');
});
router.get('/notable/delete/:id', authRequired, async (req, res) => {
    await pool.query('DELETE FROM notable_people WHERE id = ?', [req.params.id]);
    res.redirect('/admin/notable?success=1');
});

// --- ACHIEVEMENTS ---
router.get('/achievements', authRequired, async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM achievements ORDER BY sort_order');
    res.render('admin/achievements', { title: 'Achievements', achievements: rows, success: req.query.success });
});
router.post('/achievements/save', authRequired, async (req, res) => {
    const { id, title_en, title_bn, description_en, description_bn, sort_order } = req.body;
    if (id) await pool.query('UPDATE achievements SET title_en=?, title_bn=?, description_en=?, description_bn=?, sort_order=? WHERE id=?', [title_en, title_bn, description_en, description_bn, sort_order, id]);
    else await pool.query('INSERT INTO achievements (title_en, title_bn, description_en, description_bn, sort_order) VALUES (?,?,?,?,?)', [title_en, title_bn, description_en, description_bn, sort_order]);
    res.redirect('/admin/achievements?success=1');
});
router.get('/achievements/delete/:id', authRequired, async (req, res) => {
    await pool.query('DELETE FROM achievements WHERE id = ?', [req.params.id]);
    res.redirect('/admin/achievements?success=1');
});

// --- BOARD INFO ---
router.get('/board-info', authRequired, async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM board_info ORDER BY sort_order');
    res.render('admin/board-info', { title: 'Board Info', sections: rows, success: req.query.success });
});
router.post('/board-info/save', authRequired, async (req, res) => {
    const { id, section_key, title_en, title_bn, content_en, content_bn, sort_order } = req.body;
    if (id) await pool.query('UPDATE board_info SET section_key=?, title_en=?, title_bn=?, content_en=?, content_bn=?, sort_order=? WHERE id=?', [section_key, title_en, title_bn, content_en, content_bn, sort_order, id]);
    else await pool.query('INSERT INTO board_info (section_key, title_en, title_bn, content_en, content_bn, sort_order) VALUES (?,?,?,?,?,?)', [section_key, title_en, title_bn, content_en, content_bn, sort_order]);
    res.redirect('/admin/board-info?success=1');
});
router.get('/board-info/delete/:id', authRequired, async (req, res) => {
    await pool.query('DELETE FROM board_info WHERE id = ?', [req.params.id]);
    res.redirect('/admin/board-info?success=1');
});

// --- TOUR ACTIVITIES ---
router.get('/tours', authRequired, async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM tour_activities ORDER BY sort_order');
    res.render('admin/tours', { title: 'Tour Activities', tours: rows, success: req.query.success });
});
router.post('/tours/save', authRequired, async (req, res) => {
    const { id, title_en, title_bn, description_en, description_bn, sort_order } = req.body;
    if (id) await pool.query('UPDATE tour_activities SET title_en=?, title_bn=?, description_en=?, description_bn=?, sort_order=? WHERE id=?', [title_en, title_bn, description_en, description_bn, sort_order, id]);
    else await pool.query('INSERT INTO tour_activities (title_en, title_bn, description_en, description_bn, sort_order) VALUES (?,?,?,?,?)', [title_en, title_bn, description_en, description_bn, sort_order]);
    res.redirect('/admin/tours?success=1');
});
router.get('/tours/delete/:id', authRequired, async (req, res) => {
    await pool.query('DELETE FROM tour_activities WHERE id = ?', [req.params.id]);
    res.redirect('/admin/tours?success=1');
});

module.exports = router;
