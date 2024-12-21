const salesService = require('../services/salesServices');
const s3Service = require('../services/s3Service');

// update avatar - admin or manager
exports.updateAvatar = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        const imageUrl = await s3Service.uploadToS3(req.file);
        const id = req.params.id;

        await salesService.updateAvatar(id, imageUrl);

        res.status(200).json({
            message: 'Cập nhật ảnh đại diện thành công!',
            status: 1,
            imageUrl: imageUrl,
        });
    } catch (err) {
        console.error('Error uploading to S3:', err);
        res.status(500).json({ message: 'S3 upload failed' });
    }
};

// create sales
exports.createSales = async (req, res) => {
    if (req.user.role !== "admin" && req.user.role !== "manager") {
        return res.status(400).json({ message: 'you are not admin or manager' })
    }

    const data = req.body

    try {
        await salesService.createSales(data);

        res.status(200).json({
            message: 'Thêm sales thành công!',
            status: 1,
        });
    } catch (err) {
        console.log("err: ", err)
        res.status(500).json({ message: `${err}` });
    }
};

exports.updateSales_ManagerAndAdmin = async (req, res) => {

    const id = req.params.id
    const managerId = req.user.id
    const data = req.body

    try {
        if (req.user.role === "admin") {
            await salesService.updateSales_Admin(id, data);
        } else if (req.user.role === "manager") {
            await salesService.updateSales_Manager(managerId, id, data);
        } else {
            return res.status(400).json({ message: 'you are not admin or manager' })
        }

        res.status(200).json({
            message: 'Cập nhật cơ sở thành công!',
            status: 1,
        });
    } catch (err) {
        console.log("err: ", err)
        res.status(500).json({ message: `${err}` });
    }
};

// đổi mật khẩu - admin or manager
exports.resetPassword = async (req, res) => {
    if (req.user.role !== "admin" && req.user.role !== "manager") {
        return res.status(400).json({ message: 'you are not admin or manager' })
    }

    const id = req.params.id
    const data = req.body

    try {
        await salesService.resetPassword(id, data);

        res.status(200).json({
            message: 'Cập nhật mật khẩu thành công!',
            status: 1,
        });
    } catch (err) {
        console.log("err: ", err)
        res.status(500).json({ message: `${err}` });
    }
};

exports.getAllSales = async (req, res) => {

    const id = req.user.id

    try {
        let sales = {}
        if (req.user.role === "admin") {
            sales = await salesService.getAllSales_Admin();
        } else if (req.user.role === 'manager') {
            sales = await salesService.getAllSales_Manager(id);
        } else {
            return res.status(400).json({ message: 'you are not admin or manager' })
        }

        res.status(200).json({
            message: 'Lấy danh sách sales thành công!',
            status: 1,
            sales
        });
    } catch (err) {
        console.log("err: ", err)
        res.status(500).json({ message: `${err}` });
    }
};

exports.getSalesOfFacility = async (req, res) => {

    const id = req.params.id

    try {
        sales = await salesService.getSalesOfFacility(id);

        res.status(200).json({
            message: 'Lấy danh sách sales thành công!',
            status: 1,
            sales
        });
    } catch (err) {
        console.log("err: ", err)
        res.status(500).json({ message: `${err}` });
    }
};

exports.getDetailSales = async (req, res) => {
    const id = req.params.id

    try {
        const sales = await salesService.getDetailSales(id);

        res.status(200).json({
            message: 'Lấy chi tiết sales thành công!',
            status: 1,
            sales
        });
    } catch (err) {
        console.log("err: ", err)
        res.status(500).json({ message: `${err}` });
    }
};