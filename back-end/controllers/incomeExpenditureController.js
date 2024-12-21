const incomeExpenditureServices = require('../services/incomeExpenditureServices');
const s3Service = require('../services/s3Service')

// create income or expenditure
exports.createIncomeExpenditure = async (req, res) => {
    if (req.user.role !== "manager") {
        return res.status(400).json({ message: 'you are not manager' })
    }

    const data = req.body
    let imageUrls = []

    if (req.files) {
        for (const file of req.files) {
            try {
                const imageUrl = await s3Service.uploadToS3(file);
                imageUrls.push(imageUrl);
            } catch (err) {
                console.error("Error uploading to S3: ", err);
                return res.status(500).json({ message: 'Error uploading images' });
            }
        }
    }

    try {
        await incomeExpenditureServices.createIncomeExpenditure(data, imageUrls);

        res.status(200).json({
            message: 'Thêm khoản thu/chi thành công!',
            status: 1,
        });
    } catch (err) {
        console.log("err: ", err)
        res.status(500).json({ message: `${err}` });
    }
};

// update income or expenditure
exports.updateIncomeExpenditure = async (req, res) => {
    if (req.user.role !== "manager") {
        return res.status(400).json({ message: 'you are not manager' })
    }

    const id = req.params.id
    const data = req.body
    let imageUrls = []

    if (req.files) {
        for (const file of req.files) {
            try {
                const imageUrl = await s3Service.uploadToS3(file);
                imageUrls.push(imageUrl);
            } catch (err) {
                console.error("Error uploading to S3: ", err);
                return res.status(500).json({ message: 'Error uploading images' });
            }
        }
    }

    try {
        await incomeExpenditureServices.updateIncomeExpenditure(id, data, imageUrls);

        res.status(200).json({
            message: 'Thêm khoản thu/chi thành công!',
            status: 1,
        });
    } catch (err) {
        console.log("err: ", err)
        res.status(500).json({ message: `${err}` });
    }
};

// get list income or expenditure
exports.getListIncomeExpenditure = async (req, res) => {
    if (req.user.role !== "manager" && req.user.role !== 'admin') {
        return res.status(400).json({ message: 'you are not manager or manager' })
    }

    const role = req.user.role
    const id = req.user.id
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    try {
        const IncomeExpenditure = await incomeExpenditureServices.getListIncomeExpenditure(id, page, pageSize, role);

        res.status(200).json({
            message: 'Lấy danh sách khoản thu/chi thành công!',
            status: 1,
            IncomeExpenditure
        });
    } catch (err) {
        console.log("err: ", err)
        res.status(500).json({ message: `${err}` });
    }
};

// get detail income or expenditure
exports.getDetailIncomeExpenditure = async (req, res) => {
    if (req.user.role !== "manager" && req.user.role !== 'admin') {
        return res.status(400).json({ message: 'you are not manager or manager' })
    }

    const id = req.params.id

    try {
        const IncomeExpenditure = await incomeExpenditureServices.getDetailIncomeExpenditure(id);

        res.status(200).json({
            message: 'Lấy chi tiết khoản thu/chi thành công!',
            status: 1,
            IncomeExpenditure
        });
    } catch (err) {
        console.log("err: ", err)
        res.status(500).json({ message: `${err}` });
    }
};

// get filter order
exports.filterIncomeExpenditure = async (req, res) => {
    if (req.user.role !== "manager" && req.user.role !== 'admin') {
        return res.status(400).json({ message: 'you are not manager or manager' })
    }

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const data = req.body
    const user = req.user

    try {
        const IncomeExpenditure = await incomeExpenditureServices.filterIncomeExpenditure(page, pageSize, user, data);

        res.status(200).json({
            message: 'Lọc khoản thu/chi thành công!',
            status: 1,
            IncomeExpenditure
        });
    } catch (err) {
        console.log("err: ", err)
        res.status(500).json({ message: `${err}` });
    }
};

// delete images contract
exports.deleteImageContract = async (req, res) => {
    if (req.user.role !== "manager" && req.user.role !== 'admin') {
        return res.status(400).json({ message: 'you are not manager or manager' })
    }

    const imageUrl = req.body.imageUrl

    try {
        await s3Service.deleteFromS3(imageUrl);

        await incomeExpenditureServices.deleteImageContract(imageUrl)

        res.status(200).json({
            message: 'Lấy ảnh cơ sở thành công!',
            status: 1,
        });
    } catch (err) {
        console.log("err: ", err)
        res.status(500).json({ message: `${err}` });
    }
};