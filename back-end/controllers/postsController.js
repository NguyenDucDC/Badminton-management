const postsService = require('../services/postsService');
const s3Service = require('../services/s3Service')

exports.createPosts = async (req, res) => {
    if (req.user.role !== "sale") {
        return res.status(400).json({ message: 'you are not sales' })
    }

    const content = req.body.content;
    const userId = req.user.id
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
        await postsService.createPosts(userId, content, imageUrls);

        res.status(200).json({
            message: 'Thêm bài viết thành công!',
            status: 1
        });
    } catch (err) {
        console.log("err: ", err)
        res.status(500).json({ message: `${err}` });
    }
};

exports.getPostsByUserId = async (req, res) => {
    const userId = req.params.id;

    try {
        const response = await postsService.getPostsByUserId(userId);
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error retrieving user posts:', error);
        res.status(500).json({ message: 'Failed to retrieve user posts' });
    }
};

exports.getAllPosts = async (req, res) => {

    try {
        const posts = await postsService.getAllPosts();
        res.status(200).json({
            message: 'Lấy danh sách bài đăng thành công!',
            status: 1,
            posts
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve all posts' });
    }
};

exports.deletePosts = async (req, res) => {
    if (req.user.role !== "sale") {
        return res.status(400).json({ message: 'you are not sales' })
    }

    const { id } = req.params;

    try {
        await postsService.deletePosts(id);

        res.status(200).json({
            message: 'Xoá bài viết thành công!',
            status: 1
        });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: 'Database delete failed' });
    }
};

exports.updatePosts = async (req, res) => {
    if (req.user.role !== "sale") {
        return res.status(400).json({ message: 'you are not sales' })
    }

    const { id } = req.params;
    const content = req.body.content;
    let imageURLs = JSON.parse(req.body.oldImages); // image need to add database after delete all images of posts

    if (req.files) {
        for (const file of req.files) {
            try {
                const imageUrl = await s3Service.uploadToS3(file);
                imageURLs.push(imageUrl);
            } catch (err) {
                console.error("Error uploading to S3: ", err);
                return res.status(500).json({ message: 'Error uploading images' });
            }
        }
    }

    try {
        await postsService.updatePosts(id, content, imageURLs);

        res.status(200).json({
            message: 'Cập nhật bài viết thành công!',
            status: 1
        });
    } catch (err) {
        console.log("err: ", err)
        res.status(500).json({ message: `${err}` });
    }
};


