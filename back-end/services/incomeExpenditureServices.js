const { Op, where } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const sequelize = require('../config/database');
const IncomeExpenditure = require('../models/income-expenditure')
const ContractImage = require('../models/contract-image')
const facilityServices = require('../services/facilityServices')

// create income or expenditure
exports.createIncomeExpenditure = async (data, imageUrls) => {
    const id = uuidv4();

    await IncomeExpenditure.create({
        id: id,
        title: data.title,
        type: data.type,
        facility_id: data.facility_id,
        value: data.value,
        time: data.time,
        detail: data.detail,
    });

    if (imageUrls.length) {
        await ContractImage.bulkCreate(imageUrls.map(url => ({
            id: uuidv4(),
            contract_id: id,
            imageURL: url,
        })));
    }
};

// update income or expenditure
exports.updateIncomeExpenditure = async (id, data, imageUrls) => {

    const ImcomeExpenditure = await IncomeExpenditure.findOne({ where: { id } })

    await IncomeExpenditure.update({
        id: id,
        title: data.title,
        type: data.type,
        facility_id: data.facility_id,
        value: data.value,
        time: data.time,
        detail: data.detail,
    }, {
        where: { id }
    });

    if (imageUrls.length) {
        await ContractImage.bulkCreate(imageUrls.map(url => ({
            id: uuidv4(),
            contract_id: id,
            imageURL: url,
        })));
    }
};

// get list income and expenditure
exports.getListIncomeExpenditure = async (id, page, pageSize, role) => {
    const offset = (page - 1) * pageSize;

    let facilitiesId = []
    if (role === 'manager') {
        const facilities = await facilityServices.getFacilityOfManager(id)
        facilitiesId = facilities.map(facility => facility.id)
    } else if (role === 'admin') {
        const facilities = await facilityServices.getAllFacility(id)
        facilitiesId = facilities.map(facility => facility.id)
    }


    const query = `
      SELECT
        incomeExpenditures.id,
        incomeExpenditures.title,
        incomeExpenditures.type,
        incomeExpenditures.value,
        incomeExpenditures.facility_id,
        incomeExpenditures.time,
        facilities.name as facility_name
      FROM incomeExpenditures
      JOIN facilities ON facilities.id = incomeExpenditures.facility_id
      WHERE incomeExpenditures.facility_id IN (:facilitiesId)
      ORDER BY incomeExpenditures.time DESC
      LIMIT :pageSize OFFSET :offset
    `;

    const [results] = await sequelize.query(query, {
        replacements: { facilitiesId, pageSize, offset }
    });

    // Tính tổng số bản ghi (total) để gửi về frontend
    const countQuery = `
        SELECT COUNT(*) as total
        FROM incomeExpenditures
        WHERE incomeExpenditures.facility_id IN (:facilitiesId)
    `;
    const [countResult] = await sequelize.query(countQuery, {
        replacements: { facilitiesId }
    });
    const total = countResult[0].total;

    return {
        results,
        pagination: { current: page, pageSize, total }
    };
};


// get detail income and expenditure
exports.getDetailIncomeExpenditure = async (id) => {

    const query = `
      SELECT
        incomeExpenditures.id,
        incomeExpenditures.title,
        incomeExpenditures.type,
        incomeExpenditures.value,
        incomeExpenditures.detail,
        incomeExpenditures.facility_id,
        incomeExpenditures.time,
        facilities.name as facility_name,
        GROUP_CONCAT(contractImages.imageURL) AS images
      FROM incomeExpenditures
      JOIN facilities ON facilities.id = incomeExpenditures.facility_id
      LEFT JOIN contractImages ON contractImages.contract_id = incomeExpenditures.id
      WHERE incomeExpenditures.id = :id
    `;

    const [results] = await sequelize.query(query, {
        replacements: { id }
    });

    if (results.length > 0 && results.imageURL !== null) {
        const contract = results[0];
        contract.images = contract.images ? contract.images.split(',') : [];
        return contract;
    }

    // console.log(results[0].)

    return results[0];
};

// get filter order by admin
exports.filterIncomeExpenditure = async (page, pageSize, user, data) => {
    const offset = (page - 1) * pageSize;

    // Xây dựng phần WHERE động
    let whereClauses = [];
    let replacements = { pageSize, offset };

    // Điều chỉnh múi giờ khi so sánh ngày, tháng, năm
    const adjustedDateField = "CONVERT_TZ(incomeExpenditures.time, '+00:00', '+07:00')";

    if (user.role === "manager" && !data.facility_id) {
        const facilities = await facilityServices.getFacilityOfManager(user.id)
        const facilitiesId = facilities.map(facility => facility.id)
        whereClauses.push(`incomeExpenditures.facility_id IN (:facility_id)`);
        replacements.facility_id = facilitiesId;
    }

    // Kiểm tra và thêm điều kiện vào mảng whereClauses nếu dữ liệu có giá trị
    if (data.facility_id) {
        whereClauses.push(`incomeExpenditures.facility_id = :facility_id`);
        replacements.facility_id = data.facility_id;
    }

    if (data.type) {
        whereClauses.push(`incomeExpenditures.type = :type`);
        replacements.type = data.type;
    }

    if (data.year) {
        whereClauses.push(`YEAR(${adjustedDateField}) = :year`);
        replacements.year = data.year;
    }

    if (data.month) {
        whereClauses.push(`MONTH(${adjustedDateField}) = :month`);
        replacements.month = data.month;
    }

    if (data.day) {
        whereClauses.push(`DAY(${adjustedDateField}) = :day`);
        replacements.day = data.day;
    }

    // Kết hợp các điều kiện WHERE với nhau
    const whereClause = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const query = `
      SELECT 
        incomeExpenditures.id,
        incomeExpenditures.title,
        incomeExpenditures.type,
        incomeExpenditures.value,
        incomeExpenditures.facility_id,
        incomeExpenditures.time,
        facilities.name as facility_name
      FROM incomeExpenditures
      JOIN facilities ON facilities.id = incomeExpenditures.facility_id
      ${whereClause}
      ORDER BY incomeExpenditures.time DESC
      LIMIT :pageSize OFFSET :offset
    `;

    const [results] = await sequelize.query(query, {
        replacements
    });

    // Tính tổng số bản ghi (total) để gửi về frontend
    const countQuery = `
        SELECT COUNT(*) as total
        FROM incomeExpenditures
        ${whereClause}
    `;
    const [countResult] = await sequelize.query(countQuery, {
        replacements
    });
    const total = countResult[0].total;

    return {
        results,
        pagination: { current: page, pageSize, total }
    };
};


// delete image contract
exports.deleteImageContract = async (data) => {

    return await ContractImage.destroy({
        where: {
            imageURL: data
        }
    });
};