const jwt = require('jsonwebtoken');
const HttpException = require('../exceptions/HttpException');
const ServerException = require('../exceptions/ServerException');
const connection = require('../config/connect');
require('dotenv').config();

exports.authenToken = () => {
    return (req, res, next) => {
        try {
            const authorizationHeader = req.headers['authorization'];

            // 'Beaer [token]'
            const token = authorizationHeader && authorizationHeader.split(' ')[1];
            if (!token) {
                return next(new HttpException(401, 'authorization_failed'));
            }

            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
                const query = 'SELECT * FROM users WHERE id = ?';
                connection.query(query, [data.id], (error, results) => {
                    if (error || results.length === 0) {
                        return next(new HttpException(401, 'authorization_failed'));
                    }

                    req.user = results[0];
                    next();
                });
            });
        } catch (error) {
            return next(new ServerException());
        }
    };
};