const pool = require('./config/database');

async function fix() {
    const introBn = 'পশ্চিমবঙ্গ সরকারের আদিবাসী উন্নয়ন বিভাগের ব্যবস্থাপনায় পশ্চিমবঙ্গ ভূমিজ উন্নয়ন বোর্ডের মাধ্যমে প্রকাশিত প্রথম নিউজলেটার ভূমিজ খবর রাজ্যজুড়ে ভূমিজ সম্প্রদায়ের আর্থ-সামাজিক অবস্থান তুলে ধরা হল। এ ছাড়া এর মাধ্যমে বিভিন্ন কার্যক্রম, ভূমিজ ভাষা, ঐতিহ্য এবং সংস্কৃতির সুরক্ষা, লোকশিল্প, শিক্ষা ও খেলাধুলাসহ বিভিন্ন কারিগরী ও বৃত্তিমূলক প্রশিক্ষণ সংক্রান্ত বিষয়গুলো তুলে ধরা হবে।';
    
    // Add introduction_bn key
    await pool.query('DELETE FROM site_settings WHERE setting_key = ?', ['introduction_bn']);
    await pool.query('INSERT INTO site_settings (setting_key, setting_value_en, setting_value_bn) VALUES (?, ?, ?)', 
        ['introduction_bn', '', introBn]);
    
    // Also update introduction_en to have Bengali in its bn column
    await pool.query('UPDATE site_settings SET setting_value_bn = ? WHERE setting_key = ?', [introBn, 'introduction_en']);
    
    console.log('Introduction settings fixed!');
    
    // Verify all settings
    const [rows] = await pool.query('SELECT setting_key, LENGTH(setting_value_en) as en_len, LENGTH(setting_value_bn) as bn_len FROM site_settings');
    rows.forEach(r => console.log(r.setting_key, 'EN:', r.en_len, 'BN:', r.bn_len));
    
    process.exit(0);
}

fix().catch(e => { console.error(e); process.exit(1); });
