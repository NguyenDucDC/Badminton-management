const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/user');
require('dotenv').config();

// register
exports.register = async (phone, username, password, role) => {
    const existingUser = await User.findOne({ where: { phone } });
    if (existingUser) {
        return { success: false, message: 'Số điện thoại đã tồn tại!' };
    }

    const id = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    const avatarURL = "https://s3.ap-southeast-2.amazonaws.com/personal-profile.com/defaultAvt.png";

    await User.create({
        id,
        phone,
        username,
        password: hashedPassword,
        avatarURL: avatarURL,
        role: role
    });

    return { success: true, message: 'Đăng ký thành công!' };
};


// login
exports.login = async (phone, password) => {
    const user = await User.findOne({ where: { phone } });
    if (!user) {
        return { success: false, message: 'Số điện thoại không đúng!' };
    }

    if (user.status === 0) {
        return { success: false, message: 'Tài khoản đã bị vô hiệu hoá!' };
    } else if ( user.role === 'user') {
        return { success: false, message: 'Bạn không có quyền đăng nhập hệ thống này!' };
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return { success: false, message: 'Mật khẩu không đúng!' };
    }

    const token = jwt.sign({ id: user.id, phone: user.phone }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30d' });
    return {
        success: true,
        message: 'Đăng nhập thành công!',
        token: token,
        user: user,
        data: {
            user: user
        }
    };
};
