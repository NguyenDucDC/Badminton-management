const facilityServices = require('../services/facilityServices');
const s3Service = require('../services/s3Service')

exports.createFacility = async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(400).json({ message: 'you are not admin' })
    }

    const data = req.body

    try {

        const imageUrl = await s3Service.uploadToS3(req.file);
        data.imageUrl = imageUrl;

        await facilityServices.createFacility(data);

        res.status(200).json({
            message: 'Thêm cơ sở thành công!',
            status: 1,
        });
    } catch (err) {
        console.log("err: ", err)
        res.status(500).json({ message: `${err}` });
    }
};

// update info facility
exports.updateFacility = async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(400).json({ message: 'you are not admin' })
    }

    const id = req.params.id
    const data = req.body

    if (req.file) {
        const facility = await facilityServices.getDetailFacility(id)
        const imageUrl = await s3Service.updateImageOnS3(facility.avatarURL, req.file);
        data.imageUrl = imageUrl;
    }

    try {
        await facilityServices.updateFacility(id, data);

        res.status(200).json({
            message: 'Cập nhật cơ sở thành công!',
            status: 1,
        });
    } catch (err) {
        console.log("err: ", err)
        res.status(500).json({ message: `${err}` });
    }
};

// update price facility
exports.updatePriceFacility = async (req, res) => {
    if (req.user.role !== "admin" && req.user.role !== "manager") {
        return res.status(400).json({ message: 'you are not admin or manager' })
    }

    const id = req.params.id
    const data = req.body

    try {
        await facilityServices.updatePriceFacility(id, data);

        res.status(200).json({
            message: 'Cập nhật giá thành công!',
            status: 1,
        });
    } catch (err) {
        console.log("err: ", err)
        res.status(500).json({ message: `${err}` });
    }
};

exports.updatePersonnelFacility = async (req, res) => {
    const id = req.params.id
    const data = req.body

    try {
        if (req.user.role === "admin") {
            await facilityServices.updatePersonnelFacility_admin(id, data);
        } else if (req.user.role === 'manager') {
            await facilityServices.updatePersonnelFacility_manager(id, data);
        } else {
            return res.status(400).json({ message: 'you are not admin or manager' })
        }


        res.status(200).json({
            message: 'Cập nhật cơ sở thành công!',
            status: 1,
        });
    } catch (err) {
        console.log("err: ", err)
        res.status(500).json({ message: `${err}` });
    }
};

exports.updateStatusFacility = async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(400).json({ message: 'you are not admin' })
    }

    const id = req.params.id
    const data = req.body

    try {
        await facilityServices.updateStatusFacility(id, data);

        res.status(200).json({
            message: 'Cập nhật cơ sở thành công!',
            status: 1,
        });
    } catch (err) {
        console.log("err: ", err)
        res.status(500).json({ message: `${err}` });
    }
};

// get all facility
exports.getFacility = async (req, res) => {
    try {
        const id = req.user.id
        let facility = {}

        if (req.user.role === "admin") {
            facility = await facilityServices.getAllFacility();
        } else if (req.user.role === "manager") {
            facility = await facilityServices.getFacilityOfManager(id);
        } else if (req.user.role === "sale") {
            facility = await facilityServices.getFacilityOfSales(id);
        } else {
            return res.status(400).json({ message: 'you are not admin' })
        }

        res.status(200).json({
            message: 'Lấy danh sách cơ sở thành công!',
            status: 1,
            facility
        });
    } catch (err) {
        console.log("err: ", err)
        res.status(500).json({ message: `${err}` });
    }
};

// get detail facility
exports.getDetailFacility = async (req, res) => {

    const id = req.params.id

    try {
        const facility = await facilityServices.getDetailFacility(id);

        res.status(200).json({
            message: 'Lấy danh sách cơ sở thành công!',
            status: 1,
            facility
        });
    } catch (err) {
        console.log("err: ", err)
        res.status(500).json({ message: `${err}` });
    }
};

// get list price of facility
exports.getPriceFacility = async (req, res) => {

    const id = req.params.id

    try {
        const price = await facilityServices.getPriceFacility(id);

        res.status(200).json({
            message: 'Lấy danh sách cơ sở thành công!',
            status: 1,
            price
        });
    } catch (err) {
        console.log("err: ", err)
        res.status(500).json({ message: `${err}` });
    }
};

exports.getFacilityEmpty = async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(400).json({ message: 'you are not admin' })
    }

    try {
        const facility = await facilityServices.getFacilityEmpty();

        res.status(200).json({
            message: 'Lấy danh sách cơ sở thành công!',
            status: 1,
            facility
        });
    } catch (err) {
        console.log("err: ", err)
        res.status(500).json({ message: `${err}` });
    }
};

// get facility to add manager available
exports.getFacilityAvailable = async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(400).json({ message: 'you are not admin' })
    }

    const id = req.params.id

    try {
        const facility = await facilityServices.getFacilityAvailable(id);

        res.status(200).json({
            message: 'Lấy danh sách cơ sở thành công!',
            status: 1,
            facility
        });
    } catch (err) {
        console.log("err: ", err)
        res.status(500).json({ message: `${err}` });
    }
};

// lock facility
exports.lockFacility = async (req, res) => {
    if (req.user.role !== "admin" && req.user.role !== 'manager') {
        return res.status(400).json({ message: 'you are not admin or manager' })
    }

    const data = req.body

    try {
        await facilityServices.lockFacility(data);

        res.status(200).json({
            message: 'Khoá cơ sở thành công!',
            status: 1,
        });
    } catch (err) {
        console.log("err: ", err)
        res.status(500).json({ message: `${err}` });
    }
};

// upload images facility
exports.uploadImageFacility = async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(400).json({ message: 'you are not admin' })
    }

    if (!req.files) {
        return res.status(500).json({ message: 'no file upload' });
    }

    const id = req.params.id
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
        await facilityServices.uploadImageFacility(id, imageUrls);

        res.status(200).json({
            message: 'Thêm ảnh cơ sở thành công!',
            status: 1,
        });
    } catch (err) {
        console.log("err: ", err)
        res.status(500).json({ message: `${err}` });
    }
};


// get images facility
exports.getImageFacility = async (req, res) => {
    const id = req.params.id

    try {
        const imageUrls = await facilityServices.getImageFacility(id);

        res.status(200).json({
            message: 'Lấy ảnh cơ sở thành công!',
            status: 1,
            imageUrls
        });
    } catch (err) {
        console.log("err: ", err)
        res.status(500).json({ message: `${err}` });
    }
};

// get list lock facility
exports.getListLockFacility = async (req, res) => {
    const id = req.user.id
    const role = req.user.role

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    try {
        let listLock = {}

        if (role === 'admin') {
            listLock = await facilityServices.getListLockFacility(page, pageSize);
        } else if (role === 'manager') {
            listLock = await facilityServices.getListLockFacility_manager(id, page, pageSize);
        } else if (role === 'sale') {
            listLock = await facilityServices.getListLockFacility_sale(id, page, pageSize);
        }

        res.status(200).json({
            message: 'Lấy danh sách khoá cơ sở thành công!',
            status: 1,
            listLock
        });
    } catch (err) {
        console.log("err: ", err)
        res.status(500).json({ message: `${err}` });
    }
};

// get detail lock facility
exports.getDetailLockFacility = async (req, res) => {
    const id = req.params.id

    try {
        const detailLock = await facilityServices.getDetailLockFacility(id);

        res.status(200).json({
            message: 'Lấy chi tiết khoá cơ sở thành công!',
            status: 1,
            detailLock
        });
    } catch (err) {
        console.log("err: ", err)
        res.status(500).json({ message: `${err}` });
    }
};

// update lock facility
exports.updateLockFacility = async (req, res) => {
    const id = req.params.id
    const data = req.body

    try {
        await facilityServices.updateLockFacility(id, data);

        res.status(200).json({
            message: 'Cập nhật khoá cơ sở thành công!',
            status: 1,
        });
    } catch (err) {
        console.log("err: ", err)
        res.status(500).json({ message: `${err}` });
    }
};

// delete images facility
exports.deleteImageFacility = async (req, res) => {
    const imageUrl = req.body.imageUrl

    try {
        await s3Service.deleteFromS3(imageUrl);
        
        await facilityServices.deleteImageFacility(imageUrl)

        res.status(200).json({
            message: 'Lấy ảnh cơ sở thành công!',
            status: 1,
        });
    } catch (err) {
        console.log("err: ", err)
        res.status(500).json({ message: `${err}` });
    }
};