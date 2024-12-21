// sync.js
const sequelize = require('./config/database');
const db = require('./models/index');

sequelize.sync({ alter: true })
    .then(() => {
        console.log('Các bảng đã được đồng bộ thành công.');
    })
    .catch((err) => {
        console.error('Lỗi khi đồng bộ các bảng:', err);
    });
