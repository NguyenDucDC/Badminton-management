const User = require('../models/user');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const Facility = require('../models/facility');
const sequelize = require('../config/database');

exports.updateAvatar = async (id, imageUrl) => {
    await User.update(
        {
            avatarURL: imageUrl
        },
        { where: { id } });
};

exports.createManager = async (userId, data) => {

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
        role: 'manager'
    });

    await Facility.update(
        {
            manager_id: id
        },
        { where: { id: data.facilities } }
    )
};

exports.updateManager = async (id, data) => {
    await User.update(
        {
            username: data.name,
            phone: data.phone,
            status: data.status,
        },
        { where: { id } }
    );

    await Facility.update(
        { manager_id: null },
        { where: { manager_id: id } }
    );

    await Facility.update(
        { manager_id: id },
        {
            where: {
                id: data.facilities 
            }
        }
    );
};

exports.updateStatusManager = async (id, data) => {

    return await User.update(
        {
            status: data.status
        },
        { where: { id } }
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

// get all manager
exports.getManager = async () => {
    const query = `
      SELECT 
        users.id, 
        users.username, 
        users.phone, 
        users.status,
        JSON_ARRAYAGG(facilities.name) AS facilities
    FROM users
    LEFT JOIN facilities ON facilities.manager_id = users.id
    WHERE users.role = 'manager'
    GROUP BY users.id
    `;

    const [results, metadata] = await sequelize.query(query);
    return results;
};

// get detail manager
exports.getDetailManager = async (id) => {
    const query = `
      SELECT 
        users.id, 
        users.username, 
        users.phone, 
        users.status,
        users.avatarURL,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'facility_id', facilities.id,
            'facility_name', facilities.name
          )
        ) AS facilities
    FROM users
    LEFT JOIN facilities ON facilities.manager_id = users.id
    WHERE users.id = :id
    `;

    const [results, metadata] = await sequelize.query(query, {
        replacements: { id },
        type: sequelize.QueryTypes.SELECT
    });
    return results;
};