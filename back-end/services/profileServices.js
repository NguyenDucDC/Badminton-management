const User = require('../models/user');
const { Op, where } = require('sequelize');
const bcrypt = require('bcrypt');
const FacilitySales = require('../models/facility-sales');

exports.updateAvatar = async (userId, imageUrl) => {
    await User.update({ avatarURL: imageUrl }, { where: { id: userId } });
};

exports.getUser = async (id) => {
    return await User.findOne({ where: { id } })
};

exports.updatePassword = async (userId, data) => {
    const user = await User.findOne({ where: { id: userId } })

    if (!user) {
        return { success: false, message: 'Người dùng không tồn tại!' };
    }

    const match = await bcrypt.compare(data.password, user.password);

    if (!match) {
        return { success: false, message: 'Mật khẩu không đúng!' };
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    await User.update({ password: hashedPassword }, { where: { id: userId } });
};

exports.updateInfoUser = async (userId, data) => {
    const user = await User.findOne({ where: { id: userId } })

    if (!user) {
        return { success: false, message: 'Người dùng không tồn tại!' };
    }

    await User.update({ username: data.username, phone: data.phone }, { where: { id: userId } });
};

// update info sales
exports.updateInfoUser_sales = async (userId, data) => {
    const user = await User.findOne({ where: { id: userId } })

    if (!user) {
        return { success: false, message: 'Người dùng không tồn tại!' };
    }

    await FacilitySales.update({
        sale_name: data.username
    }, {
        where: {
            sale_id: userId
        }
    })
    await User.update({ username: data.username, phone: data.phone }, { where: { id: userId } });
};

