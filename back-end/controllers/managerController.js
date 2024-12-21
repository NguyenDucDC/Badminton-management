const managerService = require('../services/managerServices');
const s3Service = require('../services/s3Service')

exports.updateAvatar = async (req, res) => {
    if(req.user.role !== "admin"){
        return res.status(400).json( {message: 'you are not admin'})
    }
    
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        const imageUrl = await s3Service.uploadToS3(req.file);
        const id = req.params.id;

        await managerService.updateAvatar(id, imageUrl);

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

exports.createManager = async (req, res) => {
    if(req.user.role !== "admin"){
        return res.status(400).json( {message: 'you are not admin'})
    }

    const userId = req.user.id
    const data = req.body

    try {
        await managerService.createManager(userId, data);

        res.status(200).json({
            message: 'Thêm manager thành công!',
            status: 1,
        });
    } catch (err) {
        console.log("err: ", err)
        res.status(500).json({ message: `${err}` });
    }
};

exports.updateManager = async (req, res) => {
    if(req.user.role !== "admin"){
        return res.status(400).json( {message: 'you are not admin'})
    }

    const id = req.params.id
    const data = req.body

    try {
        await managerService.updateManager(id, data);

        res.status(200).json({
            message: 'Cập nhật manager thành công!',
            status: 1,
        });
    } catch (err) {
        console.log("err: ", err)
        res.status(500).json({ message: `${err}` });
    }
};

exports.updateStatusManager = async (req, res) => {
    if(req.user.role !== "admin"){
        return res.status(400).json( {message: 'you are not admin'})
    }

    const id = req.params.id
    const data = req.body

    try {
        await managerService.updateStatusManager(id, data);

        res.status(200).json({
            message: 'Cập nhật cơ sở thành công!',
            status: 1,
        });
    } catch (err) {
        console.log("err: ", err)
        res.status(500).json({ message: `${err}` });
    }
};

// get all manager
exports.getManager = async (req, res) => {
    if(req.user.role !== "admin"){
        return res.status(400).json( {message: 'you are not admin'})
    }

    try {
        const manager = await managerService.getManager();

        res.status(200).json({
            message: 'Lấy danh sách manager thành công!',
            status: 1,
            manager
        });
    } catch (err) {
        console.log("err: ", err)
        res.status(500).json({ message: `${err}` });
    }
};

// get detail manager
exports.getDetailManager = async (req, res) => {
    if(req.user.role !== "admin"){
        return res.status(400).json( {message: 'you are not admin'})
    }

    const id = req.params.id

    try {
        const manager = await managerService.getDetailManager(id);

        res.status(200).json({
            message: 'Lấy chi tiết manager thành công!',
            status: 1,
            manager
        });
    } catch (err) {
        console.log("err: ", err)
        res.status(500).json({ message: `${err}` });
    }
};

// đổi mật khẩu - admin or manager
exports.resetPassword = async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(400).json({ message: 'you are not admin' })
    }

    const id = req.params.id
    const data = req.body

    try {
        await managerService.resetPassword(id, data);

        res.status(200).json({
            message: 'Cập nhật mật khẩu thành công!',
            status: 1,
        });
    } catch (err) {
        console.log("err: ", err)
        res.status(500).json({ message: `${err}` });
    }
};