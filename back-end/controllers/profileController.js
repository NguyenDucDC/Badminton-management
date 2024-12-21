const profileService = require('../services/profileServices');
const s3Service = require('../services/s3Service')

exports.updateAvatar = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        const imageUrl = await s3Service.uploadToS3(req.file);
        const userId = req.user.id;

        await profileService.updateAvatar(userId, imageUrl);

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


exports.getUser = async (req, res) => {
    const id = req.user.id;

    try {
        const user = await profileService.getUser(id);

        if (!user) {
            return res.status(400).json({
                message: 'User not found!',
                status: 0,
            });
        }

        res.status(200).json({
            message: 'Successfully!',
            status: 1,
            user
        });
    } catch (err) {
        console.error('Error retrieving user:', err);
        res.status(500).json({ message: 'Failed to retrieve user' });
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const data = req.body;
        const userId = req.user.id

        await profileService.updatePassword(userId, data);

        res.status(200).json({
            message: 'Cập nhật mật khẩu thành công!',
            status: 1,
        });
    } catch (err) {
        console.log("check err: ", err)
        res.status(500).json({ message: 'Cập nhật mật khẩu thất bại!' });
    }
};

exports.updateInfoUser = async (req, res) => {
    try {
        const data = req.body;
        const userId = req.user.id

        if (req.user.role === "sale") {
            await profileService.updateInfoUser_sales(userId, data);
        } else {
            await profileService.updateInfoUser(userId, data);
        }

        res.status(200).json({
            message: 'Cập nhật thông tin thành công!',
            status: 1,
        });
    } catch (err) {
        console.log("check err: ", err)
        res.status(500).json({ message: 'Cập nhật thông tin thất bại!' });
    }
};
