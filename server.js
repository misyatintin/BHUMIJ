const express = require('express');
const path = require('path');
const session = require('express-session');
const multer = require('multer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Debug env
console.log('PORT:', process.env.PORT);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('NODE_ENV:', process.env.NODE_ENV);

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});

// Session
app.set('trust proxy', 1);

app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: false
    }
}));

const pool = require('./config/database');

// Global middleware for language and settings
app.use(async (req, res, next) => {
    try {
        if (req.query.lang) {
            req.session.lang = req.query.lang;
        }
        res.locals.lang = req.session.lang || 'en';
        res.locals.user = req.session.user || null;

        // Fetch site settings globally
        const [settings] = await pool.query('SELECT * FROM site_settings');
        const settingsMap = {};
        settings.forEach(s => {
            settingsMap[s.setting_key] = { en: s.setting_value_en, bn: s.setting_value_bn };
        });
        res.locals.settingsMap = settingsMap;
        
        next();
    } catch (err) {
        console.error('Global middleware error:', err);
        next(err);
    }
});

// Multer config for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, 'uploads')),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }
});

app.locals.upload = upload;

// Routes
const publicRoutes = require('./routes/public');
const adminRoutes = require('./routes/admin');
const apiRoutes = require('./routes/api');

app.use('/', publicRoutes);
app.use('/admin', adminRoutes);
app.use('/api', apiRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).render('404', { title: 'Page Not Found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('===== SERVER ERROR =====');
    console.error('URL:', req.method, req.originalUrl);
    console.error(err.stack || err);

    res.status(500).send('Internal Server Error');
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🌿 Bhumij CMS Server running at http://0.0.0.0:${PORT}`);
    console.log(`📋 Admin Panel: /admin`);
    console.log(`🌐 Public Site: /\n`);
});