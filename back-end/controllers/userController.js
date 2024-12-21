const userServices = require('../services/userServices');
const s3Service = require('../services/s3Service');


exports.getUser = async (req, res) => {
    const id = req.params.id

    try {
        const user = await userServices.getUser(id);

        res.status(200).json({
            message: 'Lấy user thành công!',
            status: 1,
            user
        });
    } catch (err) {
        console.log("err: ", err)
        res.status(500).json({ message: `${err}` });
    }
};

// update user information
exports.updateUserInfo = async (req, res) => {
    const id = req.user.id
    const data = req.body

    try {
        await userServices.updateUserInfo(id, data);

        res.status(200).json({
            message: 'Cập nhật thông tin người dùng thành công!',
            status: 1,
        });
    } catch (err) {
        console.log("err: ", err)
        res.status(500).json({ message: `${err}` });
    }
};

// change password
exports.changePassword = async (req, res) => {
    const id = req.user.id
    const data = req.body

    try {
        await userServices.changePassword(id, data);

        res.status(200).json({
            message: 'Đổi mật khẩu thành công!',
            status: 1,
        });
    } catch (err) {
        console.log("err: ", err)
        res.status(500).json({ message: `${err}` });
    }
};

// update avatar user
exports.updateAvatar = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        const imageUrl = await s3Service.uploadToS3(req.file);
        const id = req.user.id;

        await userServices.updateAvatar(id, imageUrl);

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

// đổi mật khẩu - admin or manager
exports.resetPassword = async (req, res) => {
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