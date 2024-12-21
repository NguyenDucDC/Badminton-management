const { Op } = require('sequelize');
const sequelize = require('../config/database');
const moment = require('moment-timezone');
const Facility = require('../models/facility');
const User = require('../models/user');
const facilityServices = require('./facilityServices')
const salesServices = require('./salesServices')

// thống kê cơ sở
exports.getAllFacilitiesStatistics = async (data, role, id) => {

    const month = data.month || null
    const year = data.year

    let whereClauses = [];
    let replacements = {};

    let facilitiesId = []

    if (role === 'manager') {
        const facilities = await facilityServices.getFacilityOfManager(id)
        facilitiesId = facilities.map(facility => facility.id)
        whereClauses.push(`orders.facility_id IN (:facility_id)`);
        replacements.facility_id = facilitiesId;
    }
    if (month) {
        whereClauses.push(`MONTH(orders.updatedAt) = :month`);
        replacements.month = month;
    }
    if (year) {
        whereClauses.push(`YEAR(orders.updatedAt) = :year`);
        replacements.year = year;
    }

    const whereClause = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

    // thống kê theo loại đơn hàng: cố định tháng/ đơn lẻ 
    const queryTypeOfOrder = `
      SELECT
        orders.id,
        orders.facility_id,
        orders.price,
        orders.default,
        orders.updatedAt,
        facilities.name
      FROM orders
      JOIN facilities ON facilities.id = orders.facility_id
      ${whereClause}
    `;

    const [resultsTypeOfOrder] = await sequelize.query(queryTypeOfOrder, {
        replacements
    });

    // thống kê theo phương thức đặt hàng: sales/online
    const queryMethodOrder = `
      SELECT 
        orders.id,
        orders.facility_id,
        orders.price,
        orders.sale_id,
        orders.updatedAt,
        facilities.name
      FROM orders
      JOIN facilities ON facilities.id = orders.facility_id
      ${whereClause}
    `;

    const [resultsMethodOrder] = await sequelize.query(queryMethodOrder, {
        replacements
    });

    // lấy id của các cơ sở đang hoạt động
    let facilities = []
    if (role === 'manager') {
        facilities = await Facility.findAll({ where: { status: 1, id: facilitiesId } });
    } else {
        facilities = await Facility.findAll({ where: { status: 1 } });
    }

    // định dạng lại kết quả trả về
    const statisticsTypeOfOrder = facilities.map(facility => {
        let total_default = 0
        let total_non_default = 0
        resultsTypeOfOrder.map(order => {
            if (order.facility_id === facility.id && order.default === 1) {
                total_default += parseFloat(order.price)
            } else if (order.facility_id === facility.id && order.default === 0) {
                total_non_default += parseFloat(order.price)
            }
        });

        return {
            facility_name: facility.name,
            facility_id: facility.id,
            total_default: total_default,
            total_non_default: total_non_default
        }
    })

    const statisticsMethodOrder = facilities.map(facility => {
        let total_sales = 0
        let total_online = 0
        resultsMethodOrder.map(order => {
            if (order.facility_id === facility.id && order.sale_id) {
                total_sales += parseFloat(order.price)
            } else if (order.facility_id === facility.id && !order.sale_id) {
                total_online += parseFloat(order.price)
            }
        });

        return {
            facility_name: facility.name,
            facility_id: facility.id,
            total_sales: total_sales,
            total_online: total_online
        }
    })

    return {
        statisticsTypeOfOrder,
        statisticsMethodOrder
    };
};

// thống kê doanh thu - chi phí
exports.getIncomeStatistics = async (data, role, id) => {

    const month = data.month || null
    const year = data.year

    let whereClauses = [];
    let replacements = {};

    let facilitiesId = []

    if (role === 'manager') {
        const facilities = await facilityServices.getFacilityOfManager(id)
        facilitiesId = facilities.map(facility => facility.id)
        whereClauses.push(`orders.facility_id IN (:facility_id)`);
        replacements.facility_id = facilitiesId;
    } else if (role = 'admin') {
        const facilities = await facilityServices.getAllFacility()
        facilitiesId = facilities.map(facility => facility.id)
    }
    if (month) {
        whereClauses.push(`MONTH(orders.updatedAt) = :month`);
        replacements.month = month;
    }
    if (year) {
        whereClauses.push(`YEAR(orders.updatedAt) = :year`);
        replacements.year = year;
    }

    const whereClause = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

    // thống kê doanh thu đơn hàng
    const queryOrderIncome = `
        SELECT
            SUM(orders.price) AS total_income,
            orders.facility_id,
            facilities.name as facility_name
        FROM orders
        JOIN facilities ON facilities.id = orders.facility_id
        ${whereClause}
        GROUP BY orders.facility_id, facilities.name 
        `;

    const [resultsOrderIncome] = await sequelize.query(queryOrderIncome, {
        replacements
    });

    // thống kê doanh thu khác
    const queryOtherIncome = `
        SELECT
            SUM(incomeExpenditures.value) AS total_income,
            incomeExpenditures.facility_id,
            facilities.name as facility_name
        FROM incomeExpenditures
        JOIN facilities ON facilities.id = incomeExpenditures.facility_id
        WHERE
            (:month IS NULL OR MONTH(incomeExpenditures.time) = :month) AND
            incomeExpenditures.facility_id IN (:facilitiesId) AND
            YEAR(incomeExpenditures.time) = :year AND 
            incomeExpenditures.type = 'income'
        GROUP BY incomeExpenditures.facility_id, facilities.name 
        `;

    const [resultsOtherIncome] = await sequelize.query(queryOtherIncome, {
        replacements: { month, year, facilitiesId },
    });

    // thống kê chi phí
    const queryExpenditure = `
        SELECT
            SUM(incomeExpenditures.value) AS total_expenditure,
            incomeExpenditures.facility_id,
            facilities.name as facility_name
        FROM incomeExpenditures
        JOIN facilities ON facilities.id = incomeExpenditures.facility_id
        WHERE 
            (:month IS NULL OR MONTH(incomeExpenditures.time) = :month) AND
            incomeExpenditures.facility_id IN (:facilitiesId) AND
            YEAR(incomeExpenditures.time) = :year AND 
            incomeExpenditures.type = 'expenditure'
        GROUP BY incomeExpenditures.facility_id, facilities.name 
        `;

    const [resultsExpenditure] = await sequelize.query(queryExpenditure, {
        replacements: { month, year, facilitiesId },
    });

    // lấy id của các cơ sở đang hoạt động
    let facilities = []
    if (role === 'manager') {
        facilities = await Facility.findAll({ where: { status: 1, id: facilitiesId } });
    } else {
        facilities = await Facility.findAll({ where: { status: 1 } });
    }

    // định dạng lại kết quả trả về
    const results = facilities.map(facility => {
        const orderIncome = resultsOrderIncome.find(s => s.facility_id === facility.id);
        const otherIncome = resultsOtherIncome.find(s => s.facility_id === facility.id);
        const expenditure = resultsExpenditure.find(s => s.facility_id === facility.id);

        const valueOrderIncome = orderIncome ? parseFloat(orderIncome.total_income) : 0;
        const valueOtherIncome = otherIncome ? parseFloat(otherIncome.total_income) : 0;
        const valueExpenditure = expenditure ? parseFloat(expenditure.total_expenditure) : 0;

        return {
            facility_name: facility.name,
            facility_id: facility.id,
            total_income: valueOrderIncome + valueOtherIncome,
            total_expenditure: valueExpenditure
        }
    })

    return results;
};

// thống kê doanh thu tất cả sales
exports.getAllSalesStatistics = async (data, role, id) => {
    const month = data.month || null
    const year = data.year

    let whereClauses = [];
    let replacements = {};

    let sales = []

    if (role === 'manager') {
        sales = await salesServices.getAllSales_Manager(id)
        const salesId = sales.map(sales => sales.id)
        whereClauses.push(`orders.sale_id IN (:sales_id)`);
        replacements.sales_id = salesId;
    } else if (role === 'admin') {
        sales = await salesServices.getAllSales_Admin()
    }

    if (month) {
        whereClauses.push(`MONTH(orders.updatedAt) = :month`);
        replacements.month = month;
    }
    if (year) {
        whereClauses.push(`YEAR(orders.updatedAt) = :year`);
        replacements.year = year;
    }

    const whereClause = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

    // thống kê doanh thu
    const query = `
        SELECT
            orders.sale_id,
            orders.price,
            orders.default,
            users.username AS sales_name
        FROM orders
        LEFT JOIN users ON users.id = orders.sale_id
        ${whereClause}
        `;

    const [results] = await sequelize.query(query, {
        replacements
    });

    // const sales = await User.findAll({ where: { status: 1, role: 'sale' } })

    const resultsFormat = sales.map(sale => {
        let total_default = 0
        let total_non_default = 0
        results.map(order => {
            if (order.sale_id === sale.id && order.default === 1) {
                total_default += parseFloat(order.price)
            } else if (order.sale_id === sale.id && order.default === 0) {
                total_non_default += parseFloat(order.price)
            }
        });

        return {
            sales_name: sale.username,
            sales_id: sale.id,
            total_default: total_default,
            total_non_default: total_non_default
        }
    })

    return resultsFormat
}

// thống kê khách hàng
exports.getCustomerStatistics = async (customerId, data, user) => {

    const month = data.month || null
    const year = data.year

    let whereClauses = [];
    let replacements = {};

    let facilitiesId = []

    whereClauses.push(`customers.id = :customerId`);
    replacements.customerId = customerId;

    if (user.role === 'manager') {
        const facilities = await facilityServices.getFacilityOfManager(user.id)
        facilitiesId = facilities.map(facility => facility.id)
        whereClauses.push(`orders.facility_id IN (:facility_id)`);
        replacements.facility_id = facilitiesId;
    }
    if (month) {
        whereClauses.push(`MONTH(orders.updatedAt) = :month`);
        replacements.month = month;
    }
    if (year) {
        whereClauses.push(`YEAR(orders.updatedAt) = :year`);
        replacements.year = year;
    }

    const whereClause = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const query = `
      SELECT
        orders.id,
        orders.facility_id,
        orders.price,
        orders.cus_name,
        orders.cus_phone,
        facilities.name AS facility_name
      FROM orders
      JOIN facilities ON facilities.id = orders.facility_id
      JOIN customers ON customers.phone = orders.cus_phone
      ${whereClause}
    `;

    const [results] = await sequelize.query(query, {
        replacements
    });

    // lấy id của các cơ sở đang hoạt động
    let facilities = []
    if (user.role === 'manager') {
        facilities = await Facility.findAll({ where: { status: 1, id: facilitiesId } });
    } else {
        facilities = await Facility.findAll({ where: { status: 1 } });
    }

    // định dạng lại kết quả trả về
    const statistics = facilities.map(facility => {
        let expenditure = 0
        results.map(order => {
            if (order.facility_id === facility.id) {
                expenditure += parseFloat(order.price)
            }
        });

        return {
            facility_name: facility.name,
            facility_id: facility.id,
            cus_name: results[0]?.cus_name,
            cus_phone: results[0]?.cus_phone,
            expenditure: expenditure
        }
    })

    return statistics
};

// thống kê chi tiết cơ sở
exports.getDetailFacilitiesStatistics = async (data, role, id) => {
    const facilityId = data.facility || null
    const year = data.year

    let whereClauses = [];
    let replacements = {};

    let facilitiesId = []

    if (role === 'manager' && !data.facility) {
        const facilities = await facilityServices.getFacilityOfManager(id)
        facilitiesId = facilities.map(facility => facility.id)
        whereClauses.push(`orders.facility_id IN (:facility_id)`);
        replacements.facility_id = facilitiesId;
    } else if (role === 'manager' && data.facility) {
        whereClauses.push(`orders.facility_id = :facility_id`);
        replacements.facility_id = facilityId;
    }

    if (role === "admin" && !data.facility) {
        const facilities = await facilityServices.getAllFacility()
        facilitiesId = facilities.map(facility => {
            if (facility.status === 1) return facility.id
        })
        whereClauses.push(`orders.facility_id IN (:facility_id)`);
        replacements.facility_id = facilitiesId;
    } else if (role === "admin" && data.facility) {
        whereClauses.push(`orders.facility_id = :facility_id`);
        replacements.facility_id = facilityId;
    }

    if (year) {
        whereClauses.push(`YEAR(orders.updatedAt) = :year`);
        replacements.year = year;
    }

    const whereClause = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const queryOrder = `
      SELECT
        orders.id,
        orders.facility_id,
        orders.price,
        orders.default,
        orders.sale_id,
        orders.updatedAt
      FROM orders
      ${whereClause}
      GROUP BY orders.id
    `;

    const [resultsOrder] = await sequelize.query(queryOrder, {
        replacements
    });

    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

    // định dạng lại kết quả trả về
    const resultsTypeOfOrder = months.map(month => {
        let total = 0
        let total_default = 0
        let total_non_default = 0

        resultsOrder.map(order => {

            const orderMonth = new Date(order.updatedAt).getMonth() + 1;
            const orderPrice = parseFloat(order.price);

            if (orderMonth === month) {
                total += orderPrice
                if (order.default === 1) {
                    total_default += orderPrice
                } else if (order.default === 0) {
                    total_non_default += orderPrice
                }
            }
        });

        return {
            month: month,
            total: total,
            total_default: total_default,
            total_non_default: total_non_default
        }
    })

    const resultsMethodOrder = months.map(month => {
        let total = 0
        let total_sales = 0
        let total_online = 0

        resultsOrder.map(order => {

            const orderMonth = new Date(order.updatedAt).getMonth() + 1;
            const orderPrice = parseFloat(order.price);

            if (orderMonth === month) {
                total += orderPrice
                if (order.sale_id) {
                    total_sales += orderPrice
                } else if (!order.sale_id) {
                    total_online += orderPrice
                }
            }
        });

        return {
            month: month,
            total: total,
            total_sales: total_sales,
            total_online: total_online
        }
    })

    return {
        resultsTypeOfOrder,
        resultsMethodOrder
    }
}

// thống kê chi tiết thu - chi
exports.getDetailIncomeStatistics = async (data, role, id) => {
    let facilityId = data.facility || null
    const year = data.year

    let whereClauses = [];
    let replacements = {};

    whereClauses.push(`YEAR(orders.updatedAt) = :year`);
    replacements.year = year;

    if (role === 'admin' && facilityId === null) {
        const facilities = await facilityServices.getAllFacility()
        facilityId = facilities.map(facility => {
            if (facility.status === 1) return facility.id
        })
    } else if (role === 'admin' && facilityId) {
        whereClauses.push(`orders.facility_id = :facility_id`);
        replacements.facility_id = facilityId;
    }

    if (role === 'manager' && !data.facility) {
        const facilities = await facilityServices.getFacilityOfManager(id)
        facilityId = facilities.map(facility => facility.id)
        whereClauses.push(`orders.facility_id IN (:facility_id)`);
        replacements.facility_id = facilityId;
    } else if (role === 'manager' && data.facility) {
        whereClauses.push(`orders.facility_id = :facility_id`);
        replacements.facility_id = facilityId;
    }

    const whereClause = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const queryOrder = `
      SELECT
        orders.id,
        orders.facility_id,
        orders.price,
        orders.updatedAt
      FROM orders
      ${whereClause}
    `;

    const [resultsOrder] = await sequelize.query(queryOrder, {
        replacements
    });

    const queryIncomeExpenditure = `
      SELECT
        incomeExpenditures.type,
        incomeExpenditures.value,
        incomeExpenditures.time
      FROM incomeExpenditures
      WHERE (incomeExpenditures.facility_id IN (:facilityId)) AND YEAR(incomeExpenditures.time) = :year
    `;

    const [resultsIncomeExpenditure] = await sequelize.query(queryIncomeExpenditure, {
        replacements: { facilityId, year },
    });

    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

    // định dạng lại kết quả trả về
    const results = months.map(month => {
        let total_income = 0
        let total_expenditure = 0

        resultsOrder.map(order => {

            const orderMonth = new Date(order.updatedAt).getMonth() + 1;
            const orderPrice = parseFloat(order.price);

            if (orderMonth === month) {
                total_income += orderPrice
            }
        });

        resultsIncomeExpenditure.map(contract => {
            const contractMonth = new Date(contract.time).getMonth() + 1;
            const contractValue = parseFloat(contract.value);

            if (contractMonth === month && contract.type === 'income') {
                total_income += contractValue
            } else if (contractMonth === month && contract.type === 'expenditure') {
                total_expenditure += contractValue
            }
        })

        return {
            month: month,
            total_income: total_income,
            total_expenditure: total_expenditure
        }
    })

    return results
}

// thống kê chi tiết sales 
exports.getDetailSalesStatistics = async (data, role, id) => {

    let sales = []

    if (role === 'manager') {
        sales = await salesServices.getAllSales_Manager(id)
    } else if (role === 'admin') {
        sales = await salesServices.getAllSales_Admin()
    }

    const salesId = data.sales || sales[0].id
    const year = data.year

    const queryOrder = `
      SELECT
        orders.id,
        orders.sale_id,
        orders.facility_id,
        orders.price,
        orders.updatedAt
      FROM orders
      WHERE orders.sale_id = :salesId AND YEAR(orders.updatedAt) = :year
    `;

    const [resultsOrder] = await sequelize.query(queryOrder, {
        replacements: { salesId, year },
    });

    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

    // định dạng lại kết quả trả về
    const results = months.map(month => {
        let total = 0

        resultsOrder.map(order => {

            const orderMonth = new Date(order.updatedAt).getMonth() + 1;
            const orderPrice = parseFloat(order.price);

            if (orderMonth === month) {
                total += orderPrice
            }
        });

        return {
            month: month,
            total: total
        }
    })

    return {
        sale_id: salesId,
        results: results
    }
}

// thống kê chi tiết khách hàng
exports.getDetailCustomerStatistics = async (customerId, data, user) => {

    const year = data.year
    const facilityId = data.facility_id

    let whereClauses = [];
    let replacements = {};

    let facilitiesId = []

    whereClauses.push(`customers.id = :customerId`);
    replacements.customerId = customerId;

    if (year) {
        whereClauses.push(`YEAR(orders.updatedAt) = :year`);
        replacements.year = year;
    }
    if (facilityId) {
        whereClauses.push(`orders.facility_id = :facilityId`);
        replacements.facilityId = facilityId;
    } else if (user.role === 'manager') {
        const facilities = await facilityServices.getFacilityOfManager(user.id)
        facilitiesId = facilities.map(facility => facility.id)
        whereClauses.push(`orders.facility_id IN (:facility_id)`);
        replacements.facility_id = facilitiesId;
    }

    const whereClause = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

    // thống kê theo phương thức đặt hàng: sales/online
    const query = `
      SELECT 
        orders.id,
        orders.price,
        orders.updatedAt
      FROM orders
      JOIN facilities ON facilities.id = orders.facility_id
      JOIN customers ON customers.phone = orders.cus_phone
      ${whereClause}
    `;

    const [results] = await sequelize.query(query, {
        replacements
    });

    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

    // định dạng lại kết quả trả về
    const statistics = months.map(month => {
        let expenditure = 0

        results.map(order => {
            const orderMonth = new Date(order.updatedAt).getMonth() + 1;
            const orderPrice = parseFloat(order.price);
            if (orderMonth === month) {
                expenditure += orderPrice
            }
        });

        return {
            month: month,
            expenditure: expenditure
        }
    })

    return statistics
};


