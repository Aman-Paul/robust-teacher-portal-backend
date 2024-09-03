const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('tailweb', 'root', '8888', {
    host: 'localhost',
    dialect: 'postgres',
    logging: true 
});

async function initializeDatabase() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully...');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        throw error; 
    }
}

async function executeRawQuery(query, replacements = {}) {
    try {
        const [results] = await sequelize.query(query, {
            replacements
        });

        return results;
    } catch (error) {
        console.error("Error in executeRawQuery:", error);
        throw error;
    }
}

module.exports = { initializeDatabase, executeRawQuery , sequelize};
