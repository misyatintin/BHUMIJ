const pool = require('./config/database');

async function checkSettings() {
    try {
        const [rows] = await pool.query('SELECT setting_key FROM site_settings');
        console.log('Current Setting Keys:');
        rows.forEach(row => {
            console.log(row.setting_key);
        });
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

checkSettings();
