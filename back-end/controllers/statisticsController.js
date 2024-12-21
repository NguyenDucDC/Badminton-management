const statisticsService = require('../services/statisticsService');
const moment = require('moment-timezone');

// thống kê theo loại đơn hàng
exports.getAllFacilitiesStatistics = async (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
        return res.status(400).json({ message: 'you are not admin or manager' });
    }

    let data = req.body
    const role = req.user.role
    const id = req.user.id

    try {
        const statistics = await statisticsService.getAllFacilitiesStatistics(data, role, id);

        res.status(200).json({
            message: 'Lấy thống kê đơn hàng thành công!',
            status: 1,
            statistics
        });
    } catch (err) {
        res.status(500).json({ message: `${err}` });
    }
};

// thống kê doanh thu - chi phí
exports.getIncomeStatistics = async (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
        return res.status(400).json({ message: 'you are not admin or manager' });
    }

    let data = req.body
    const role = req.user.role
    const id = req.user.id

    try {
        const statistics = await statisticsService.getIncomeStatistics(data, role, id);

        res.status(200).json({
            message: 'Lấy thống kê doanh thu và chi phí thành công!',
            status: 1,
            statistics
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: `${err}` });
    }
};

// thống kê doanh thu tất cả sales
exports.getAllSalesStatistics = async (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
        return res.status(400).json({ message: 'you are not admin or manager' });
    }

    let data = req.body
    const role = req.user.role
    const id = req.user.id

    try {
        const statistics = await statisticsService.getAllSalesStatistics(data, role, id);

        res.status(200).json({
            message: 'Lấy thống kê doanh thu sales thành công!',
            status: 1,
            statistics
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: `${err}` });
    }
};

// thống kê chi tiêu khách hàng
exports.getCustomerStatistics = async (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
        return res.status(400).json({ message: 'you are not admin or manager' });
    }

    const data = req.body
    const user = req.user
    const customerId = req.params.id

    try {
        const statistics = await statisticsService.getCustomerStatistics(customerId, data, user);

        res.status(200).json({
            message: 'Lấy thống kê doanh thu sales thành công!',
            status: 1,
            statistics
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: `${err}` });
    }
};

// thống kê chi tiết cơ sở
exports.getDetailFacilitiesStatistics = async (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
        return res.status(400).json({ message: 'you are not admin or manager' });
    }

    let data = req.body
    const role = req.user.role
    const id = req.user.id

    try {
        const statistics = await statisticsService.getDetailFacilitiesStatistics(data, role, id);

        res.status(200).json({
            message: 'Lấy thống kê chi tiết cơ sở thành công!',
            status: 1,
            statistics
        });
    } catch (err) {
        res.status(500).json({ message: `${err}` });
    }
};

// thống kê chi tiết thu - chi
exports.getDetailIncomeStatistics = async (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
        return res.status(400).json({ message: 'you are not admin or manager' });
    }

    let data = req.body
    const role = req.user.role
    const id = req.user.id

    try {
        const statistics = await statisticsService.getDetailIncomeStatistics(data, role, id);

        res.status(200).json({
            message: 'Lấy thống kê chi tiết cơ sở thành công!',
            status: 1,
            statistics
        });
    } catch (err) {
        res.status(500).json({ message: `${err}` });
    }
};

// get detail sales statistics
exports.getDetailSalesStatistics = async (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
        return res.status(400).json({ message: 'you are not admin or manager' });
    }

    let data = req.body
    const role = req.user.role
    const id = req.user.id

    try {
        const statistics = await statisticsService.getDetailSalesStatistics(data, role, id);

        res.status(200).json({
            message: 'Lấy thống kê chi tiết sales thành công!',
            status: 1,
            statistics
        });
    } catch (err) {
        res.status(500).json({ message: `${err}` });
    }
};

// get detail customer statistics
exports.getDetailCustomerStatistics = async (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'manager') {
        return res.status(400).json({ message: 'you are not admin or manager' });
    }

    const user = req.user
    const customerId = req.params.id
    const data = req.body

    try {
        const statistics = await statisticsService.getDetailCustomerStatistics(customerId, data, user);

        res.status(200).json({
            message: 'Lấy thống kê chi tiết customer thành công!',
            status: 1,
            statistics
        });
    } catch (err) {
        res.status(500).json({ message: `${err}` });
    }
};