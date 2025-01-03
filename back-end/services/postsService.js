const { v4: uuidv4 } = require('uuid');
const Posts = require('../models/posts');
const User = require('../models/user');
const { Op } = require('sequelize');
const PostsImage = require('../models/posts-image');
const sequelize = require('../config/database');
const s3 = require('../config/s3Client');
const s3Service = require('../services/s3Service')

exports.createPosts = async (userId, content, imageUrls) => {
    const posts_id = uuidv4()

    await Posts.create({
        id: posts_id,
        user_id: userId,
        content: content
    })

    if (imageUrls.length > 0) {
        await PostsImage.bulkCreate(
            imageUrls.map(imageURL => ({
                id: uuidv4(),
                posts_id: posts_id,
                imageURL: imageURL
            }))
        )
    }
};

// get all posts
exports.getAllPosts = async () => {
    const query = `
      SELECT 
        posts.id, 
        posts.user_id, 
        posts.content,
        posts.createdAt,
        users.username,
        users.avatarURL,
        JSON_ARRAYAGG(postsImages.imageURL) AS imageURLs
      FROM posts
      LEFT JOIN postsImages ON postsImages.posts_id = posts.id
      JOIN users ON users.id = posts.user_id
      GROUP BY posts.id
      ORDER BY posts.createdAt DESC
    `;

    const [results] = await sequelize.query(query);

    return results
};

exports.getPostsByUserId = async (userId) => {
    try {
        const posts = await Posts.findAll({
            where: { userId },
            include: [
                {
                    model: User,
                    attributes: ['username', 'avatarURL'],
                },
                {
                    model: Reaction,
                    attributes: ['reaction', 'userId'],
                }
            ],
            order: [['createdAt', 'DESC']],
        });

        return {
            status: 200,
            data: {
                message: 'Lấy bài đăng thành công!',
                status: 1,
                data: posts,
            },
        };
    } catch (error) {
        console.error('Error retrieving user posts:', error);
        return { status: 500, data: { message: 'Failed to retrieve user posts' } };
    }
};

// update posts
exports.updatePosts = async (posts_id, content, imageURLs) => {
    // update content
    await Posts.update({
        content: content
    }, {
        where: { id: posts_id }
    })

    // delete old images
    const imagesToDelete = await PostsImage.findAll({
        where: {
            posts_id: posts_id,
            imageURL: { [Op.notIn]: imageURLs }
        }
    });

    // Xóa ảnh khỏi S3
    await Promise.all(imagesToDelete.map(async (image) => {
        await s3Service.deleteFromS3(image.imageURL);
    }));

    await PostsImage.destroy({ where: { posts_id } }) // delete all images

    // create new images
    if (imageURLs.length > 0) {
        try {
            console.log("check imageURLs: ", imageURLs)
            console.log("check posts_id: ", posts_id)

            await PostsImage.bulkCreate(
                imageURLs.map(imageURL => ({
                    id: uuidv4(),
                    posts_id: posts_id,
                    imageURL: imageURL
                }))
            )
        } catch (err) {
            console.log("check err: ", err)
        }

    }

};

// delete posts
exports.deletePosts = async (id) => {
    await Posts.destroy({ where: { id } })

    // delete images from s3
    const images = await PostsImage.findAll({ where: { posts_id: id } })
    await Promise.all(images.map(async (image) => {
        await s3Service.deleteFromS3(image.imageURL);
    }));

    await PostsImage.destroy({ where: { posts_id: id } })
};
