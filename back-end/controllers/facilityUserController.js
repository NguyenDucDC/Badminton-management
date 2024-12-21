const facilityUserServices = require('../services/facilityUserServices');

// get all facility
exports.getAllFacility = async (req, res) => {
    try {
        const facilities = await facilityUserServices.getAllFacility();

        res.status(200).json({
            message: 'Lấy danh sách cơ sở thành công!',
            status: 1,
            facilities
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
        const facility = await facilityUserServices.getDetailFacility(id);

        res.status(200).json({
            message: 'Lấy chi tiết cơ sở thành công!',
            status: 1,
            facility
        });
    } catch (err) {
        console.log("err: ", err)
        res.status(500).json({ message: `${err}` });
    }
};

// get price facility
exports.getPriceFacility = async (req, res) => {

    const id = req.params.id

    try {
        const price = await facilityUserServices.getPriceFacility(id);

        res.status(200).json({
            message: 'Lấy giá cơ sở thành công!',
            status: 1,
            price
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
        const imageUrls = await facilityUserServices.getImageFacility(id);

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