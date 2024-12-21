const authServices = require('../services/authServices');

// register
exports.register = async (req, res) => {
    const { phone, username, password, role } = req.body;

    if (!phone || !password || !username) {
        return res.status(400).send('Phone, username, and password are required');
    }

    try {
        const result = await authServices.register(phone, username, password, role);
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

// login
exports.login = async (req, res) => {
    const { phone, password } = req.body;

    if (!phone || !password) {
        return res.status(400).send('Phone and password are required');
    }

    try {
        const result = await authServices.login(phone, password);
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
