const pool = require('./config/database');
async function migrate() {
    try {
        await pool.query("ALTER TABLE geographic_states ADD COLUMN population_bn VARCHAR(255) AFTER population");
        console.log("Successfully added population_bn to geographic_states");
    } catch (e) {
        if (e.code === 'ER_DUP_COLUMN_NAMES') {
            console.log("population_bn already exists");
        } else {
            console.error(e);
        }
    }
    process.exit();
}
migrate();
