const pool = require('./config/database');
async function check() {
    const tables = ['geographic_states', 'achievements'];
    for (const tableName of tables) {
        try {
            const [columns] = await pool.query(`DESCRIBE ${tableName}`);
            console.log(`\nTable: ${tableName}`);
            console.log(columns.map(c => c.Field));
        } catch (e) {
            console.log(`\nTable ${tableName} not found or error.`);
        }
    }
    process.exit();
}
check();
