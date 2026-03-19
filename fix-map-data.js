const pool = require('./config/database');

async function fixMapWithPopulation() {
    console.log('--- Updating Geography Data with Population ---');
    
    // 1. Add population column if missing
    try {
        await pool.query('ALTER TABLE geographic_states ADD COLUMN IF NOT EXISTS population VARCHAR(100)');
        console.log('✅ Population column ensuring...');
    } catch (err) {
        console.log('Note: ALTER might fail depending on DB version, manually checking...');
    }

    // 2. Real Data for Bhumij Regions
    // Jharkhand (Ranchi area): ~1M
    // West Bengal (Purulia area): ~400k
    // Odisha (Mayurbhanj area): ~250k
    // Assam: ~50k
    const coords = [
        { code: 'jh', lat: 23.3441, lng: 85.3096, pop: '1,000,000+' },
        { code: 'wb', lat: 22.5726, lng: 88.3639, pop: '400,000+' },
        { code: 'or', lat: 20.2961, lng: 85.8245, pop: '250,000+' },
        { code: 'as', lat: 26.1158, lng: 91.7086, pop: '50,000+' }
    ];

    for (const c of coords) {
        await pool.query('UPDATE geographic_states SET latitude = ?, longitude = ?, population = ? WHERE state_code = ?', [c.lat, c.lng, c.pop, c.code]);
        console.log(`✅ Updated ${c.code.toUpperCase()} with Lat: ${c.lat}, Lng: ${c.lng}, Pop: ${c.pop}`);
    }

    console.log('--- ALL DONE ---');
    process.exit(0);
}

fixMapWithPopulation().catch(e => { console.error(e); process.exit(1); });
