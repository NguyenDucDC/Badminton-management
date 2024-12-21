const sequelize = require('../config/database');

// get sales facility
exports.getSalesFacility = async (id) => {
    const query = `
      SELECT 
        users.id, 
        users.username, 
        users.phone
    FROM users
    JOIN facilitySales ON facilitySales.sale_id = users.id
    WHERE facilitySales.facility_id = :id
    `;

    const [results] = await sequelize.query(query, {
        replacements: { id }
    });

    return results;
};

