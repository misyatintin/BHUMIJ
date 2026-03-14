const pool = require('./config/database');
async function clean() {
    try {
        // Remove Khobor from site_title
        await pool.query("UPDATE site_settings SET setting_value_en = REPLACE(setting_value_en, 'Khobor - ', ''), setting_value_bn = REPLACE(setting_value_bn, 'খবর - ', '') WHERE setting_key = 'site_title'");
        await pool.query("UPDATE site_settings SET setting_value_en = REPLACE(setting_value_en, 'Bhumij Khobor', 'Bhumij'), setting_value_bn = REPLACE(setting_value_bn, 'ভূমিজ খবর', 'ভূমিজ') WHERE setting_key = 'site_title'");
        
        // Remove from introduction
        await pool.query("UPDATE site_settings SET setting_value_en = REPLACE(setting_value_en, '\"Bhumij Khobor\" ', ''), setting_value_bn = REPLACE(setting_value_bn, '\"ভূমিজ খবর\" ', '') WHERE setting_key = 'introduction_en'");
        await pool.query("UPDATE site_settings SET setting_value_en = REPLACE(setting_value_en, '\"Bhumij Khobor\" ', ''), setting_value_bn = REPLACE(setting_value_bn, '\"ভূমিজ খবর\" ', '') WHERE setting_key = 'introduction_bn'");

        // Remove from greeting messages
        await pool.query("UPDATE greeting_messages SET message_en = REPLACE(message_en, 'titled \"Bhumij Khobor\" ', ''), message_bn = REPLACE(message_bn, 'শীর্ষক \"ভূমিজ খবর\" ', '')");
        await pool.query("UPDATE greeting_messages SET message_en = REPLACE(message_en, 'this \"Bhumij Khobor\" quarterly publication', 'this quarterly publication'), message_bn = REPLACE(message_bn, 'এই \"ভূমিজ খবর\" ত্রৈমাসিক প্রকাশনা', 'এই ত্রৈমাসিক প্রকাশনা')");

        console.log("Successfully removed 'Khobor' word from database.");
    } catch (e) {
        console.error(e);
    }
    process.exit();
}
clean();
