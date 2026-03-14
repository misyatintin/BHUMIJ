const pool = require('./config/database');
const fs = require('fs');

const bn = fs.readFileSync('C:/Users/HP/.gemini/antigravity/brain/c2c538c7-1e35-44df-baf5-2c60c3028bdc/bhumij_27_final_complete_transcription_bengali.md', 'utf8');

async function fix() {
    // Board Formation Bengali - lines 52-68 of the Bengali file
    const s1 = bn.indexOf('উপজাতি কল্যাণ দপ্তর ০৭');
    const e1 = bn.indexOf('## পৃষ্ঠা - ৩');
    if (s1 > 0 && e1 > s1) {
        const bfBn = bn.substring(s1, e1).trim();
        await pool.query('UPDATE articles SET content_bn = ? WHERE slug = ?', [bfBn, 'board-formation']);
        console.log('BF Bengali updated:', bfBn.length, 'chars');
    } else {
        console.log('BF markers:', s1, e1);
    }

    // Tour Activities Bengali 
    const s2 = bn.indexOf('মাননীয়া চেয়ারম্যান এবং মেদিনীপুর বিভাগের বিভাগীয় কমিশনার যথাক্রমে');
    const e2 = bn.indexOf('বৈঠকের কার্যবিবরণী');
    if (s2 > 0 && e2 > s2) {
        const tourBn = bn.substring(s2, e2).trim();
        await pool.query('UPDATE articles SET content_bn = ? WHERE slug = ?', [tourBn, 'tour-activities']);
        console.log('Tour Bengali updated:', tourBn.length, 'chars');
    } else {
        console.log('Tour markers:', s2, e2);
    }

    // Verify
    const [rows] = await pool.query('SELECT slug, LENGTH(content_bn) as bn_len FROM articles');
    rows.forEach(r => console.log(r.slug, ':', r.bn_len, 'bytes'));

    process.exit(0);
}

fix().catch(e => { console.error(e); process.exit(1); });
