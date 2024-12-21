const { Op } = require('sequelize');
const sequelize = require('../config/database');
const Customer = require('../models/customer');
const facilityServices = require('./facilityServices');
const CustomerFacility = require('../models/customer-facility');

// get all customer
exports.getAllCustomer = async (page, pageSize) => {
  const offset = (page - 1) * pageSize;

  const query = `
    SELECT 
      customers.id,
      customers.username,
      customers.phone,
      GROUP_CONCAT(CONCAT(facilities.id, ':', facilities.name) SEPARATOR ',') AS facilities
    FROM customers
    JOIN CustomerFacilities ON CustomerFacilities.customer_id = customers.id
    JOIN facilities ON facilities.id = CustomerFacilities.facility_id
    GROUP BY customers.id
    ORDER BY customers.createdAt DESC
    LIMIT :pageSize OFFSET :offset
  `;

  const [results] = await sequelize.query(query, {
    replacements: { pageSize, offset }
  });

  // Tính tổng số bản ghi (total) để gửi về frontend
  const countQuery = `
    SELECT COUNT(*) as total
    FROM customers
  `;
  const [countResult] = await sequelize.query(countQuery);
  const total = countResult[0].total;

  const transformedResults = results.map(customer => {
    const facilities = customer.facilities ? customer.facilities.split(',').map(facility => {
      const [id, name] = facility.split(':');
      return { id, name };
    }) : [];

    return {
      ...customer,
      facilities
    };
  });

  return {
    transformedResults,
    pagination: { current: page, pageSize, total }
  };
};

exports.getCustomer = async (id) => {
  return await Customer.findOne({ where: { id } })
}

// get filter customer
exports.getFilterCustomer = async (page, pageSize, user, data) => {
  const offset = (page - 1) * pageSize;

  // Xây dựng phần WHERE động
  let whereClauses = [];
  let replacements = { pageSize, offset };

  // Điều chỉnh múi giờ khi so sánh ngày, tháng, năm
  const adjustedDateField = "CONVERT_TZ(orders.createdAt, '+00:00', '+07:00')";

  if (user.role === "manager" && !data.facility_id) {
    const facilities = await facilityServices.getFacilityOfManager(user.id)
    const facilitiesId = facilities.map(facility => facility.id)
    whereClauses.push(`orders.facility_id IN (:facility_id)`);
    replacements.facility_id = facilitiesId;
  }

  // Kiểm tra và thêm điều kiện vào mảng whereClauses nếu dữ liệu có giá trị
  if (data.facility_id) {
    whereClauses.push(`orders.facility_id = :facility_id`);
    replacements.facility_id = data.facility_id;
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

  if (data.phone) {
    whereClauses.push(`orders.cus_phone = :phone`);
    replacements.phone = data.phone;
  }

  // Kết hợp các điều kiện WHERE với nhau
  const whereClause = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const query = `
    SELECT 
      customers.id,
      customers.username,
      customers.phone,
      SUM(DISTINCT orders.price) AS total_price
    FROM customers
    LEFT JOIN CustomerFacilities ON CustomerFacilities.customer_id = customers.id
    LEFT JOIN facilities ON facilities.id = CustomerFacilities.facility_id
    LEFT JOIN orders ON orders.cus_phone = customers.phone
    ${whereClause}
    GROUP BY customers.id
    ORDER BY total_price DESC
    LIMIT :pageSize OFFSET :offset
  `;

  const [results] = await sequelize.query(query, {
    replacements
  });

  // Tính tổng số bản ghi (total) để gửi về frontend
  const countQuery = `
      SELECT 
        COUNT(DISTINCT customers.id) AS total
      FROM customers
      JOIN CustomerFacilities ON CustomerFacilities.customer_id = customers.id
      JOIN facilities ON facilities.id = CustomerFacilities.facility_id
      JOIN orders ON orders.cus_phone = customers.phone
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


// find customer
exports.findCustomer = async (phone) => {
  return Customer.findOne({ where: { phone } })
}


// get customer by phone - admin
exports.getCustomerByPhone_Admin = async (page, pageSize, phone) => {
  const offset = (page - 1) * pageSize;

  const query = `
    SELECT 
      customers.id,
      customers.username,
      customers.phone,
      GROUP_CONCAT(CONCAT(facilities.id, ':', facilities.name) SEPARATOR ',') AS facilities
    FROM customers
    JOIN CustomerFacilities ON CustomerFacilities.customer_id = customers.id
    JOIN facilities ON facilities.id = CustomerFacilities.facility_id
    WHERE customers.phone = :phone
    GROUP BY customers.id
    ORDER BY customers.createdAt DESC
    LIMIT :pageSize OFFSET :offset
  `;

  const [results] = await sequelize.query(query, {
    replacements: { pageSize, offset, phone }
  });

  // Tính tổng số bản ghi (total) để gửi về frontend
  const countQuery = `
    SELECT COUNT(*) as total
    FROM customers
  `;
  const [countResult] = await sequelize.query(countQuery);
  const total = countResult[0].total;

  const transformedResults = results.map(customer => {
    const facilities = customer.facilities ? customer.facilities.split(',').map(facility => {
      const [id, name] = facility.split(':');
      return { id, name };
    }) : [];

    return {
      ...customer,
      facilities
    };
  });

  return {
    transformedResults,
    pagination: { current: page, pageSize, total }
  };
};


// get customer by phone - manager
exports.getCustomerByPhone_Manager = async (page, pageSize, phone, id) => {
  const offset = (page - 1) * pageSize;
  const facilities = await facilityServices.getFacilityOfManager(id)
  const facility_id = facilities.map(facility => facility.id)

  const query = `
    SELECT 
      customers.id,
      customers.username,
      customers.phone,
      GROUP_CONCAT(CONCAT(facilities.id, ':', facilities.name) SEPARATOR ',') AS facilities
    FROM customers
    JOIN CustomerFacilities ON CustomerFacilities.customer_id = customers.id
    JOIN facilities ON facilities.id = CustomerFacilities.facility_id
    WHERE facilities.id IN (:facility_id) AND customers.phone = :phone
    GROUP BY customers.id
    ORDER BY customers.createdAt DESC
    LIMIT :pageSize OFFSET :offset
  `;

  const [results] = await sequelize.query(query, {
    replacements: { pageSize, offset, phone, facility_id }
  });

  // Tính tổng số bản ghi (total) để gửi về frontend
  const countQuery = `
    SELECT COUNT(*) as total
    FROM customers
  `;
  const [countResult] = await sequelize.query(countQuery);
  const total = countResult[0].total;

  const transformedResults = results.map(customer => {
    const facilities = customer.facilities ? customer.facilities.split(',').map(facility => {
      const [id, name] = facility.split(':');
      return { id, name };
    }) : [];

    return {
      ...customer,
      facilities
    };
  });

  return {
    transformedResults,
    pagination: { current: page, pageSize, total }
  };
};



// get list customer of facility that manager work
exports.getListCustomer_manager = async (id, page, pageSize) => {
  const offset = (page - 1) * pageSize;
  const facilities = await facilityServices.getFacilityOfManager(id)
  const facility_id = facilities.map(facility => facility.id)

  const query = `
      SELECT 
        customers.id,
        customers.username,
        customers.phone,
        GROUP_CONCAT(CONCAT(facilities.id, ':', facilities.name) SEPARATOR ',') AS facilities
      FROM customers
      JOIN CustomerFacilities ON CustomerFacilities.customer_id = customers.id
      JOIN facilities ON facilities.id = CustomerFacilities.facility_id
      WHERE facilities.id IN (:facility_id)
      GROUP BY customers.id
      ORDER BY customers.createdAt DESC
      LIMIT :pageSize OFFSET :offset
    `;

  const [results] = await sequelize.query(query, {
    replacements: { facility_id, pageSize, offset },
  });

  // Tính tổng số bản ghi (total) để gửi về frontend
  const countQuery = `
    SELECT COUNT(*) as total
    FROM customers
    JOIN CustomerFacilities ON CustomerFacilities.customer_id = customers.id
    WHERE CustomerFacilities.facility_id IN (:facility_id)
  `;
  const [countResult] = await sequelize.query(countQuery, {
    replacements: { facility_id },
  });
  const total = countResult[0].total;

  const transformedResults = results.map(customer => {
    const facilities = customer.facilities ? customer.facilities.split(',').map(facility => {
      const [id, name] = facility.split(':');
      return { id, name };
    }) : [];

    return {
      ...customer,
      facilities
    };
  });

  return {
    transformedResults,
    pagination: { current: page, pageSize, total }
  };
};


// delete customer
exports.deleteCustomer = async (id) => {
  await Customer.destroy({
    where: { id }
  })

  await CustomerFacility.destroy({ where: { customer_id: id } })

};

