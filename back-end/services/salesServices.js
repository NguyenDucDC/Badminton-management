const User = require('../models/user');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const Facility = require('../models/facility');
const FacilitySales = require('../models/facility-sales')
const sequelize = require('../config/database');

exports.updateAvatar = async (id, imageUrl) => {
    await User.update(
        {
            avatarURL: imageUrl
        },
        { where: { id } });
};

exports.createSales = async (data) => {
    const existingUser = await User.findOne({ where: { phone: data.phone } });
    if (existingUser) {
        return { success: false, message: 'Số điện thoại đã tồn tại!' };
    }

    const id = uuidv4();
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const avatarURL = "https://s3.ap-southeast-2.amazonaws.com/personal-profile.com/defaultAvt.png";

    await User.create({
        id,
        phone: data.phone,
        username: data.name,
        password: hashedPassword,
        avatarURL: avatarURL,
        role: 'sale'
    });

    const facilities = await Facility.findAll({
        where: { id: data.facilities },
        attributes: ['id', 'name']
    });

    await FacilitySales.bulkCreate(
        facilities.map(facility => ({
            sale_id: id,
            sale_name: data.name,
            facility_id: facility.id,
            facility_name: facility.name
        }))
    );
};

// update sales from admin
exports.updateSales_Admin = async (id, data) => {

    await User.update(
        {
            username: data.name,
            phone: data.phone,
            status: data.status,
        },
        { where: { id } }
    );

    await FacilitySales.destroy({
        where: { sale_id: id }
    });

    const facilities = await Facility.findAll({
        where: { id: data.facilities },
        attributes: ['id', 'name']
    });

    await FacilitySales.bulkCreate(
        facilities.map(facility => ({
            sale_id: id,
            sale_name: data.name,
            facility_id: facility.id,
            facility_name: facility.name
        }))
    );
};

// update sales from manager
exports.updateSales_Manager = async (managerId, id, data) => {

    await User.update(
        {
            username: data.name,
            phone: data.phone,
            status: data.status,
        },
        { where: { id } }
    );

    const facilitiesOfManager = await Facility.findAll({
        where: { manager_id: managerId },
        attributes: ['id']
    });

    let facilitiesId = []
    facilitiesOfManager.map(facility => {
        facilitiesId.push(facility.id)
    })

    await FacilitySales.destroy({
        where: {
            sale_id: id,
            facility_id: facilitiesId
        }
    });

    const facilities = await Facility.findAll({
        where: { id: data.facilities },
        attributes: ['id', 'name', 'manager_id']
    });

    await FacilitySales.bulkCreate(
        facilities.map(facility => ({
            sale_id: id,
            sale_name: data.name,
            facility_id: facility.id,
            facility_name: facility.name
        }))
    );
};

// reset password
exports.resetPassword = async (id, data) => {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    await User.update(
        {
            password: hashedPassword
        },
        { where: { id } }
    );
};

exports.getAllSales_Admin = async () => {
    const query = `
      SELECT 
        users.id, 
        users.username, 
        users.phone, 
        users.status,
        JSON_ARRAYAGG(facilitySales.facility_name) AS facilities
    FROM users
    LEFT JOIN facilitySales ON users.id = facilitySales.sale_id
    WHERE users.role = 'sale'
    GROUP BY users.id
    `;

    const [results, metadata] = await sequelize.query(query);
    return results;
};

exports.getSalesOfFacility = async (id) => {
    return await FacilitySales.findAll({where: { facility_id: id }});
};


// get all sales for manager
const getFacilityIdsByManager = async (managerId) => {
    const query = `
        SELECT id
        FROM facilities
        WHERE manager_id = :managerId
    `;

    const [results] = await sequelize.query(query, {
        replacements: { managerId },
    });

    return results.map(facility => facility.id);
};

exports.getAllSales_Manager = async (id) => {

    const facilityIds = await getFacilityIdsByManager(id);

    if (facilityIds.length === 0) {
        return [];
    }

    const query = `
        SELECT 
            users.id, 
            users.username, 
            users.phone, 
            users.status,
            JSON_ARRAYAGG(facilities.name) AS facilities
        FROM users
        JOIN facilitySales ON users.id = facilitySales.sale_id
        JOIN facilities ON facilities.id = facilitySales.facility_id
        WHERE users.role = 'sale' AND facilities.id IN (:facilityIds)
        GROUP BY users.id
    `;

    const [results] = await sequelize.query(query, {
        replacements: { facilityIds },
    });

    return results;
};

// get detail sales
exports.getDetailSales = async (id) => {
    const query = `
      SELECT 
        users.id, 
        users.username, 
        users.phone, 
        users.status,
        users.avatarURL,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'facility_id', facilitySales.facility_id,
            'facility_name', facilities.name
          )
        ) AS facilities
    FROM users
    LEFT JOIN facilitySales ON facilitySales.sale_id = users.id
    LEFT JOIN facilities ON facilities.id = facilitySales.facility_id
    WHERE users.id = :id
    `;

    const [results, metadata] = await sequelize.query(query, {
        replacements: { id },
        type: sequelize.QueryTypes.SELECT
    });
    return results;
};

