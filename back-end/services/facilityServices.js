const Facility = require('../models/facility');
const { Op, where } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const sequelize = require('../config/database');
const FacilitySales = require('../models/facility-sales');
const User = require('../models/user')
const Price = require('../models/price')
const FacilityImage = require('../models/facility-image')
const Lock = require('../models/lock')
const LockFacility = require('../models/lock-facility')

exports.createFacility = async (data) => {

    await Facility.create({
        id: uuidv4(),
        name: data.name,
        address: data.address,
        number: data.number,
        avatarURL: data.imageUrl,
        note: data.note,
    });
};

exports.updateFacility = async (id, data) => {
    await Facility.update(
        {
            name: data.name,
            address: data.address,
            number: data.number,
            avatarURL: data.imageUrl,
            status: data.status,
            note: data.note,
        },
        { where: { id } }
    );

    await FacilitySales.update(
        {
            facility_name: data.name
        },
        { where: { facility_id: id } }
    )

    if (data.status === 0) {
        const facility = await Facility.findOne({ where: { id } })
        const listSalesOfFacility = await FacilitySales.findAll({ where: { facility_id: id } })

        await Facility.update(
            {
                manager_id: null
            }, { where: { id } }
        )
        await FacilitySales.destroy({
            where: { facility_id: id }
        });

        const isManagerActive = await Facility.findOne({ where: { manager_id: facility.manager_id } });
        if (!isManagerActive) {
            await User.update(
                { status: 0 },
                { where: { id: facility.manager_id } }
            );
        }

        for (const sales of listSalesOfFacility) {
            const isSalesActive = await FacilitySales.findOne({ where: { sale_id: sales.sale_id } });
            if (!isSalesActive) {
                await User.update(
                    { status: 0 },
                    { where: { id: sales.sale_id } }
                );
            }
        }
    }
};

// update personnel facility of admin
exports.updatePersonnelFacility_admin = async (id, data) => {

    const facility = await Facility.findOne({ where: { id } })
    const listSalesOfFacility = await User.findAll({ where: { id: data.salesId } })
    const oldSales = await FacilitySales.findAll({ where: { facility_id: id } })

    await Facility.update(
        {
            manager_id: data.managerId
        }, { where: { id } }
    )
    await User.update({ status: 1 }, { where: { id: data.managerId } }
    )

    const isManagerActive = await Facility.findOne({ where: { manager_id: facility.manager_id } });
    if (!isManagerActive) {
        await User.update(
            { status: 0 },
            { where: { id: facility.manager_id } }
        );
    }

    await FacilitySales.destroy({
        where: { facility_id: id }
    });

    await FacilitySales.bulkCreate(
        listSalesOfFacility.map(sales => ({
            sale_id: sales.id,
            sale_name: sales.username,
            facility_id: facility.id,
            facility_name: facility.name
        }))
    )

    await User.update({ status: 1 }, { where: { id: data.salesId } })

    for (const sales of oldSales) {
        const isSalesActive = await FacilitySales.findOne({ where: { sale_id: sales.sale_id } });
        if (!isSalesActive) {
            await User.update(
                { status: 0 },
                { where: { id: sales.sale_id } }
            );
        }
    }
};

// update personnel facility of manager
exports.updatePersonnelFacility_manager = async (id, data) => {
    const facility = await Facility.findOne({ where: { id } })
    const listSalesOfFacility = await User.findAll({ where: { id: data.salesId } })
    const oldSales = await FacilitySales.findAll({ where: { facility_id: id } })

    await FacilitySales.destroy({
        where: { facility_id: id }
    });

    await FacilitySales.bulkCreate(
        listSalesOfFacility.map(sales => ({
            sale_id: sales.id,
            sale_name: sales.username,
            facility_id: facility.id,
            facility_name: facility.name
        }))
    )

    await User.update({ status: 1 }, { where: { id: data.salesId } })

    for (const sales of oldSales) {
        const isSalesActive = await FacilitySales.findOne({ where: { sale_id: sales.sale_id } });
        if (!isSalesActive) {
            await User.update(
                { status: 0 },
                { where: { id: sales.sale_id } }
            );
        }
    }
};

exports.updateStatusFacility = async (id, data) => {
    return await Facility.update(
        {
            status: data.status
        },
        { where: { id } }
    );
};

// update price facility
exports.updatePriceFacility = async (id, data) => {
    const facility = await Price.findOne({ where: { facility_id: id } })
    if (facility) {
        await Price.update(
            {
                p1: data.p1,
                p2: data.p2,
                p3: data.p3,
                p4: data.p4,
                p5: data.p5,
                p6: data.p6,
                p7: data.p7,
                p8: data.p8,
            },
            { where: { facility_id: id } }
        );
    } else {
        await Price.create({
            id: uuidv4(),
            facility_id: id,
            p1: data.p1,
            p2: data.p2,
            p3: data.p3,
            p4: data.p4,
            p5: data.p5,
            p6: data.p6,
            p7: data.p7,
            p8: data.p8,
        })
    }

};

// get all facility for admin
exports.getAllFacility = async () => {
    return await Facility.findAll();
};

// get all facility of manager
exports.getFacilityOfManager = async (id) => {
    return await Facility.findAll({ where: { manager_id: id } });
};

// get all facility of sales
exports.getFacilityOfSales = async (id) => {
    const facilities = await FacilitySales.findAll({ where: { sale_id: id } })

    const facilityId = facilities.map(facility => facility.facility_id)

    return await Facility.findAll({ where: { id: facilityId } });
};

// get detail facility
exports.getDetailFacility = async (id) => {
    const query = `
        SELECT 
            facilities.id, 
            facilities.name, 
            facilities.address, 
            facilities.number,
            facilities.avatarURL,
            facilities.status,
            facilities.note,
            users.id AS manager_id
        FROM facilities
        LEFT JOIN users ON users.id = facilities.manager_id
        WHERE facilities.id = :id
    `;

    const [results, metadata] = await sequelize.query(query, {
        replacements: { id },
    });

    return results[0];
};


exports.getFacilityEmpty = async () => {
    return await Facility.findAll({
        where: {
            manager_id: {
                [Op.is]: null,
            },
            status: 1
        }
    });
};

// get list price of facility
exports.getPriceFacility = async (id) => {
    return await Price.findOne({ where: { facility_id: id } });
};

// get facility available
exports.getFacilityAvailable = async (id) => {
    return await Facility.findAll({
        where: {
            [Op.or]: [
                { manager_id: { [Op.is]: null } },
                { manager_id: id }
            ],
            status: 1
        }
    });
};

// upload images facility
exports.uploadImageFacility = async (id, imageUrls) => {
    await FacilityImage.bulkCreate(imageUrls.map(url => ({
        id: uuidv4(),
        facility_id: id,
        imageURL: url,
    })));
};

// get images facility
exports.getImageFacility = async (id) => {

    return await FacilityImage.findAll({
        where: {
            facility_id: id
        }
    });
};

// get all list lock facility
exports.getListLockFacility = async (page, pageSize) => {
    const offset = (page - 1) * pageSize;

    const query = `
      SELECT 
        locks.id,
        locks.time_start,
        locks.time_end,
        locks.note,
        JSON_ARRAYAGG(facilities.name) AS facilities_name
      FROM locks
      LEFT JOIN lockFacilities ON lockFacilities.lock_id = locks.id
      LEFT JOIN facilities ON facilities.id = lockFacilities.facility_id
      GROUP BY locks.id
      ORDER BY locks.createdAt DESC
      LIMIT :pageSize OFFSET :offset
    `;

    const [results] = await sequelize.query(query, {
        replacements: { pageSize, offset }
    });

    // Tính tổng số bản ghi (total) để gửi về frontend
    const countQuery = `
        SELECT COUNT(*) as total
        FROM locks
    `;
    const [countResult] = await sequelize.query(countQuery);
    const total = countResult[0].total;

    return {
        results,
        pagination: { current: page, pageSize, total }
    };
};

// get list lock facility of manager
exports.getListLockFacility_manager = async (id, page, pageSize) => {
    const offset = (page - 1) * pageSize;
    const facilities = await this.getFacilityOfManager(id)
    const facilitiesId = facilities.map(facility => facility.id)

    const query = `
      SELECT 
        locks.id,
        locks.time_start,
        locks.time_end,
        locks.note,
        JSON_ARRAYAGG(facilities.name) AS facilities_name
      FROM locks
      LEFT JOIN lockFacilities ON lockFacilities.lock_id = locks.id
      LEFT JOIN facilities ON facilities.id = lockFacilities.facility_id
      WHERE lockFacilities.facility_id IN (:facilitiesId)
      GROUP BY locks.id
      ORDER BY locks.createdAt DESC
      LIMIT :pageSize OFFSET :offset
    `;

    const [results] = await sequelize.query(query, {
        replacements: { pageSize, offset, facilitiesId }
    });

    // Tính tổng số bản ghi (total) để gửi về frontend
    const countQuery = `
        SELECT COUNT(*) as total
        FROM locks
    `;
    const [countResult] = await sequelize.query(countQuery);
    const total = countResult[0].total;

    return {
        results,
        pagination: { current: page, pageSize, total }
    };
};

// get list lock facility of sales
exports.getListLockFacility_sale = async (id, page, pageSize) => {
    const offset = (page - 1) * pageSize;
    const facilities = await this.getFacilityOfSales(id)
    const facilitiesId = facilities.map(facility => facility.id)

    const query = `
      SELECT 
        locks.id,
        locks.time_start,
        locks.time_end,
        locks.note,
        JSON_ARRAYAGG(facilities.name) AS facilities_name
      FROM locks
      LEFT JOIN lockFacilities ON lockFacilities.lock_id = locks.id
      LEFT JOIN facilities ON facilities.id = lockFacilities.facility_id
      WHERE lockFacilities.facility_id IN (:facilitiesId)
      GROUP BY locks.id
      ORDER BY locks.createdAt DESC
      LIMIT :pageSize OFFSET :offset
    `;

    const [results] = await sequelize.query(query, {
        replacements: { pageSize, offset, facilitiesId }
    });

    // Tính tổng số bản ghi (total) để gửi về frontend
    const countQuery = `
        SELECT COUNT(*) as total
        FROM locks
    `;
    const [countResult] = await sequelize.query(countQuery);
    const total = countResult[0].total;

    return {
        results,
        pagination: { current: page, pageSize, total }
    };
};

// get detail lock facility
exports.getDetailLockFacility = async (id) => {

    const query = `
      SELECT 
        locks.id,
        locks.time_start,
        locks.time_end,
        locks.note,
        JSON_ARRAYAGG(facilities.id) AS facilitiesId
      FROM locks
      LEFT JOIN lockFacilities ON lockFacilities.lock_id = locks.id
      LEFT JOIN facilities ON facilities.id = lockFacilities.facility_id
      WHERE locks.id = :id
      GROUP BY locks.id
    `;

    const [results] = await sequelize.query(query, {
        replacements: { id }
    });

    return results[0];
};

// get images facility
exports.deleteImageFacility = async (data) => {

    return await FacilityImage.destroy({
        where: {
            imageURL: data
        }
    });
};

// lock facility
exports.lockFacility = async (data) => {

    const lock_id = uuidv4()

    await Lock.create({
        id: lock_id,
        time_start: data.time_start,
        time_end: data.time_end,
        note: data.note
    });

    await LockFacility.bulkCreate(
        data.facilitiesId.map(facility_id => ({
            lock_id: lock_id,
            facility_id: facility_id
        }))
    );
};

// update lock facility
exports.updateLockFacility = async (id, data) => {

    await Lock.update({
        note: data.note,
        time_start: data.time_start,
        time_end: data.time_end
    }, { where: { id } })

    await LockFacility.destroy({
        where: { lock_id: id }
    })

    await LockFacility.bulkCreate(
        data.facilitiesId.map(facility_id => ({
            lock_id: id,
            facility_id: facility_id
        }))
    );
};