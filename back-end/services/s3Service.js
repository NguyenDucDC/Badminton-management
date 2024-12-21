const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const s3 = require('../config/s3Client');
const dotenv = require('dotenv');
dotenv.config();

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

exports.uploadToS3 = async (file) => {
    const fileName = `${Date.now()}-${file.originalname}`;
    const params = {
        Bucket: bucketName,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);

    const imageUrl = `https://s3.${bucketRegion}.amazonaws.com/${bucketName}/${fileName}`;
    return imageUrl;
};


exports.deleteFromS3 = async (fileUrl) => {

    const fileName = fileUrl.split('/').pop();
    const params = {
        Bucket: bucketName,
        Key: fileName,
    };

    try {
        const command = new DeleteObjectCommand(params);
        await s3.send(command);
    } catch (err) {
        console.error('Error deleting image from S3:', err);
        return { status: 500, data: { message: 'S3 image deletion failed' } };
    }
};


exports.updateImageOnS3 = async (oldFileUrl, newFile) => {
    // Lấy tên file cũ từ URL để xóa nó trước
    try {
        await this.deleteFromS3(oldFileUrl);
    } catch (err) {
        console.error('Error deleting old image from S3:', err);
        return { status: 500, data: { message: 'Failed to delete old image from S3' } };
    }

    // Tải ảnh mới lên S3
    try {
        const newImageUrl = await this.uploadToS3(newFile);
        return newImageUrl;
    } catch (err) {
        console.error('Error uploading new image to S3:', err);
        return { status: 500, data: { message: 'Failed to upload new image to S3' } };
    }
};