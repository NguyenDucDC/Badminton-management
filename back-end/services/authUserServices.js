const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/user');
require('dotenv').config();

const textflow = require("textflow.js");
const { text } = require('body-parser');
textflow.useKey("nsgvJJ7QIzdIQx07SeJQu8vIokcWlgZjYEvKlLaS302QQ3aQtB7Z0hr6yCDCD86i");

exports.verifyOtp = async (phone) => {
    console.log(phone)
    
    var result = await textflow.sendVerificationSMS(phone)

    if(result.ok){
        console.log("oke")
        return { success: true, message: 'Đăng ký thành công!' };
    }
    console.log(result)

    return { success: false, message: 'that bai!' };
};

exports.register = async (phone, username, password) => {
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
        role: 'user'
    });

    return { success: true, message: 'Đăng ký thành công!' };
};

exports.login = async (phone, password) => {
    const user = await User.findOne({ where: { phone } });
    if (!user) {
        return { success: false, message: 'Số điện thoại không đúng!' };
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
        data: {
            user
        }
    };
};
