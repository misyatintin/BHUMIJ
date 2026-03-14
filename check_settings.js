const pool = require('./config/database');
async function check() {
    const [rows] = await pool.query("SELECT * FROM site_settings WHERE setting_key = 'site_title'");
    console.log(rows);
    process.exit();
}
check();
