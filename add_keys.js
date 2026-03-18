const pool = require('./config/database');

async function addSettingKeys() {
    try {
        const keys = ['site_logo', 'site_favicon'];
        for (const key of keys) {
            const [rows] = await pool.query('SELECT id FROM site_settings WHERE setting_key = ?', [key]);
            if (rows.length === 0) {
                await pool.query('INSERT INTO site_settings (setting_key, setting_value_en, setting_value_bn) VALUES (?, ?, ?)', [key, '', '']);
                console.log(`Added key: ${key}`);
            } else {
                console.log(`Key already exists: ${key}`);
            }
        }
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

addSettingKeys();
