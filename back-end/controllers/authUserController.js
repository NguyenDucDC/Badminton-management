const authUserServices = require('../services/authUserServices');

const ACCOUNT_SID = 'AC575df1ee59ece00cb0afac6c25bb89a8'
const AUTH_TOKEN = 'cde996e08504547434a0c4d4d845cc11'

exports.register = async (req, res) => {
    const { phone, username, password } = req.body;

    if (!phone || !password || !username) {
        return res.status(400).send('Phone, username, and password are required');
    }

    try {
        const result = await authUserServices.register(phone, username, password);
        if (result.success) {
            res.status(200).json({ message: result.message, status: 1 });
        } else {
            res.status(200).json({ message: result.message, status: 0 });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error server!');
    }
};

exports.login = async (req, res) => {
    const { phone, password } = req.body;

    if (!phone || !password) {
        return res.status(400).send('Phone and password are required');
    }

    try {
        const result = await authUserServices.login(phone, password);
        if (result.success) {
            res.status(200).json({
                message: result.message,
                status: 1,
                token: result.token,
                data: result.data
            });
        } else {
            res.status(200).json({ message: result.message, status: 0 });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "server error!", status: 0 });
    }
};

exports.checkAccount = async (req, res) => {
    const { phone } = req.body;

    try {
        const result = await authUserServices.checkAccount(phone);
        if (result.success) {
            res.status(200).json({
                message: result.message,
                status: 1,
            });
        } else {
            res.status(200).json({
                message: result.message,
                status: 0
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "server error!", status: 0 });
    }
};

exports.changePassword = async (req, res) => {
    const { phone, password } = req.body;

    try {
        const result = await authUserServices.changePassword(phone, password);
        if (result.success) {
            res.status(200).json({
                message: result.message,
                status: 1,
            });
        } else {
            res.status(200).json({
                message: result.message,
                status: 0
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "server error!", status: 0 });
    }
};



