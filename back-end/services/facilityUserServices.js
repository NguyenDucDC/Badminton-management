const sequelize = require('../config/database');
const Price = require('../models/price')
const FacilityImage = require('../models/facility-image')
const Facility = require('../models/facility')

// get all facility
exports.getAllFacility = async () => {
    const query = `
        SELECT 
            facilities.id, 
            facilities.name, 
            facilities.address,
            facilities.avatarURL,
            LEAST(prices.p1, prices.p2, prices.p3, prices.p4, prices.p5, prices.p6, prices.p7, prices.p8) AS min_price,
            GREATEST(prices.p1, prices.p2, prices.p3, prices.p4, prices.p5, prices.p6, prices.p7, prices.p8) AS max_price
        FROM facilities
        JOIN prices ON prices.facility_id = facilities.id
        WHERE facilities.status = 1
    `;

    const [results] = await sequelize.query(query);

    return results;
};


// get detail facility
exports.getDetailFacility = async (id) => {
    const query = `
        SELECT 
            facilities.id,
            facilities.name,
            facilities.address,
            facilities.avatarURL,
            facilities.number,
            GROUP_CONCAT(facilityImages.imageURL) AS images
        FROM facilities
        JOIN facilityImages ON facilityImages.facility_id = facilities.id
        WHERE facilities.id = :id AND facilities.status = 1
        GROUP BY facilities.id
    `;

    const [results] = await sequelize.query(query, {
        replacements: { id }
    });

    if (results.length > 0) {
        const facility = results[0];
        facility.images = facility.images ? facility.images.split(',') : [];
        return facility;
    }

    return results[0];
};

// get list price of facility
exports.getPriceFacility = async (id) => {
    return await Price.findOne({ where: { facility_id: id } });
};

// get images facility
exports.getImageFacility = async (id) => {

    return await FacilityImage.findAll({
        where: {
            facility_id: id
        }
    });
};