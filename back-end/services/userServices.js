const User = require('../models/user');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/database');

// get user information
exports.getUser = async (id) => {
    return await User.findOne({ where: { id } });
};

// update user information
exports.updateUserInfo = async (id, data) => {
    await User.update(
        {
            username: data.username
        },
        { where: { id } });
};

// update avatar
exports.updateAvatar = async (id, imageUrl) => {
    await User.update(
        {
            avatarURL: imageUrl
        },
        { where: { id } });
};

// change password
exports.changePassword = async (id, data) => {
    const user = await User.findOne({ where: { id } });
    if (!user) {
        throw new Error('Người dùng không tồn tại.');
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
        throw new Error('Mật khẩu không chính xác.');
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);

    await User.update(
        {
            password: hashedPassword
        },
        { where: { id } }
    );
};



