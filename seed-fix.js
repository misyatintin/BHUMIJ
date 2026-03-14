const pool = require('./config/database');
const fs = require('fs');

const bn = fs.readFileSync('C:/Users/HP/.gemini/antigravity/brain/c2c538c7-1e35-44df-baf5-2c60c3028bdc/bhumij_27_final_complete_transcription_bengali.md', 'utf8');

function between(text, start, end) {
    const si = text.indexOf(start);
    if (si === -1) { console.log('NOT FOUND:', start.substring(0,40)); return ''; }
    const s = si + start.length;
    const ei = end ? text.indexOf(end, s) : text.length;
    if (ei === -1) { console.log('END NOT FOUND:', end.substring(0,40)); return text.substring(s).trim(); }
    return text.substring(s, ei).trim();
}

async function fix() {
    // Board Formation Bengali
    const bfStart = '"পশ্চিমবঙ্গ ভূমিজ উন্নয়ন বোর্ড" উপজাতি কল্যাণ দপ্তর';
    const bfEnd = '## পৃষ্ঠা - ৩';
    let bfBn = between(bn, bfStart, bfEnd);
    bfBn = '**ভূমিজ উন্নয়ন পর্ষদ গঠন এবং কার্যাবলী**\n\n' + bfStart + bfBn;
    console.log('Board Formation BN length:', bfBn.length);
    if (bfBn.length > 100) await pool.query('UPDATE articles SET content_bn = ? WHERE slug = ?', [bfBn, 'board-formation']);

    // Jilpa Laya Bengali
    const jlStart = '১৭৭৪ সালে ব্রিটিশ শাসক বাংলা বিহার';
    const jlEnd = '**তথ্যসূত্র :-**';
    let jlBn = between(bn, jlStart, jlEnd);
    jlBn = '**অমর শহীদ জিলপা লায়া (১৭৭৪-১৮৩৪)**\n\n' + jlStart + jlBn;
    console.log('Jilpa Laya BN length:', jlBn.length);
    if (jlBn.length > 100) await pool.query('UPDATE articles SET content_bn = ? WHERE slug = ?', [jlBn, 'jilpa-laya']);

    // Tour Activities Bengali 
    const taStart = 'পশ্চিমবঙ্গ ভূমিজ উন্নয়ন পর্ষদের মাননীয়া চেয়ারম্যান এবং মেদিনীপুর বিভাগের বিভাগীয় কমিশনার যথাক্রমে';
    const taEnd = '**পশ্চিমবঙ্গ ভূমিজ উন্নয়ন পর্ষদ বৈঠকের কার্যবিবরণী**';
    let taBn = between(bn, taStart, taEnd);
    taBn = '**জেলাগুলিতে বিভাগীয় কমিশনারের সফর কার্যাবলী**\n\n' + taStart + taBn;
    console.log('Tour Activities BN length:', taBn.length);
    if (taBn.length > 100) await pool.query('UPDATE articles SET content_bn = ? WHERE slug = ?', [taBn, 'tour-activities']);

    // Verify
    const [rows] = await pool.query('SELECT slug, LENGTH(content_en) as en_len, LENGTH(content_bn) as bn_len FROM articles');
    console.log('\nFinal article sizes:');
    rows.forEach(r => console.log(`  ${r.slug}: EN=${r.en_len}, BN=${r.bn_len}`));

    console.log('\n✅ Done!');
    process.exit(0);
}

fix().catch(e => { console.error(e); process.exit(1); });
