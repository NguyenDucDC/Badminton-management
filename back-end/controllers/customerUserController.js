const customerUserServices = require('../services/customerUserServices');

// find customer
exports.findCustomer = async (req, res) => {
    const phone = req.body.phone
    try {
        const customer = await customerUserServices.findCustomer(phone);

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