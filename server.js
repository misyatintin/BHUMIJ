const express = require('express');
const path = require('path');
const session = require('express-session');
const multer = require('multer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Session
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

// Global middleware for language
app.use((req, res, next) => {
    if (req.query.lang) {
        req.session.lang = req.query.lang;
    }
    res.locals.lang = req.session.lang || 'en';
    res.locals.user = req.session.user || null;
    next();
});

// Multer config for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, 'uploads')),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });
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

app.listen(PORT, () => {
    console.log(`\n🌿 Bhumij CMS Server running at http://localhost:${PORT}`);
    console.log(`📋 Admin Panel: http://localhost:${PORT}/admin`);
    console.log(`🌐 Public Site: http://localhost:${PORT}\n`);
});
