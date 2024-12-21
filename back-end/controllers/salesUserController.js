const salesUserService = require('../services/salesUserService');

// update avatar - admin or manager
exports.getSalesFacility = async (req, res) => {
    try {
        const id = req.params.id;

        const sales = await salesUserService.getSalesFacility(id);

        res.status(200).json({
            message: 'Lấy danh sách sales thành công!',
            status: 1,
            sales
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lấy danh sách sales thất bại!' });
    }
};
