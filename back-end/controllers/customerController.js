const customerServices = require('../services/customerServices');

// get all customer
exports.getAllCustomer = async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(400).json({ message: 'you are not admin' })
    }

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    try {
        const customer = await customerServices.getAllCustomer(page, pageSize);

        res.status(200).json({
            message: 'Lấy danh sách khách hàng thành công!',
            status: 1,
            customer
        });
    } catch (err) {
        console.log("err: ", err)
        res.status(500).json({ message: `${err}` });
    }
};

// get customer by id
exports.getCustomer = async (req, res) => {
    const id = req.params.id
    try {
        const customer = await customerServices.getCustomer(id);

        res.status(200).json({
            message: 'Lấy danh sách khách hàng thành công!',
            status: 1,
            customer
        });
    } catch (err) {
        console.log("err: ", err)
        res.status(500).json({ message: `${err}` });
    }
};

// find customer
exports.findCustomer = async (req, res) => {
    const phone = req.body.phone
    try {
        const customer = await customerServices.findCustomer(phone);

        res.status(200).json({
            message: 'Tìm kiếm khách hàng thành công!',
            status: 1,
            customer
        });
    } catch (err) {
        console.log("err: ", err)
        res.status(500).json({ message: `${err}` });
    }
};

// get filter customer
exports.getFilterCustomer = async (req, res) => {

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const data = req.body
    const user = req.user

    try {
        const customers = await customerServices.getFilterCustomer(page, pageSize, user, data);

        res.status(200).json({
            message: 'Lấy khách hàng thành công!',
            status: 1,
            customers
        });
    } catch (err) {
        console.log("err: ", err)
        res.status(500).json({ message: `${err}` });
    }
};

// get customer by phone
exports.getCustomerByPhone = async (req, res) => {
    if (req.user.role !== "admin" && req.user.role !== 'manager') {
        return res.status(400).json({ message: 'you are not admin' })
    }

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const phone = req.body.phone
    const id = req.user.id

    try {
        let customer = {}
        if (req.user.role === 'admin') {
            customer = await customerServices.getCustomerByPhone_Admin(page, pageSize, phone);
        } else if (req.user.role === 'manager') {
            customer = await customerServices.getCustomerByPhone_Manager(page, pageSize ,phone , id);
        }

        res.status(200).json({
            message: 'Lấy danh sách cơ sở thành công!',
            status: 1,
            customer
        });
    } catch (err) {
        console.log("err: ", err)
        res.status(500).json({ message: `${err}` });
    }
};

// get list customer of facility that manager work
exports.getListCustomer_manager = async (req, res) => {
    if (req.user.role !== "manager") {
        return res.status(400).json({ message: 'you are not manager' })
    }

    const manager_id = req.user.id
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    try {
        const customer = await customerServices.getListCustomer_manager(manager_id, page, pageSize);

        res.status(200).json({
            message: 'Lấy danh sách cơ sở thành công!',
            status: 1,
            customer
        });
    } catch (err) {
        console.log("err: ", err)
        res.status(500).json({ message: `${err}` });
    }
};

// delete customer
exports.deleteCustomer = async (req, res) => {
    if (req.user.role !== "manager" && req.user.role !== 'admin') {
        return res.status(400).json({ message: 'you are not manager or admin' })
    }

    const customer_id = req.params.id

    try {
        await customerServices.deleteCustomer(customer_id);

        res.status(200).json({
            message: 'Lấy danh sách cơ sở thành công!',
            status: 1,
        });
    } catch (err) {
        console.log("err: ", err)
        res.status(500).json({ message: `${err}` });
    }
};