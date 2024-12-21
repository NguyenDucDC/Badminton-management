import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { notification, Modal } from 'antd'
import { uploadImageFacility, getImageFacility, deleteImageFacility } from 'src/services/facility';
import styles from "./ImageFacility.module.scss";
import classNames from "classnames/bind";
import { useParams } from 'react-router-dom';
import CIcon from '@coreui/icons-react';
import { cilTrash } from '@coreui/icons';

const cx = classNames.bind(styles);

function ImageFacility() {
    const user = useSelector(state => state.user.data);
    const params = useParams();
    const id = params.id
    const [visibleDeleteModal, setVisibleDeleteModal] = useState(false)
    const [selectedImages, setSelectedImages] = useState([]);
    const [data, setData] = useState([])


    useEffect(() => {
        handleGetImageFacility()
    }, []);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedImages(prevImages => [...prevImages, ...files]);
    };

    const removeImage = (indexToRemove) => {
        setSelectedImages(prevImages => prevImages.filter((_, index) => index !== indexToRemove));
    };

    const uploadImages = async () => {
        const formData = new FormData();
        selectedImages.forEach((image) => {
            formData.append('images', image);
        });

        try {
            const res = await uploadImageFacility(id, formData)
            if (res.status === 1) {
                setSelectedImages([]);
                handleGetImageFacility();

                notification.success({
                    message: "Upload ảnh thành công!",
                    placement: 'bottomRight',
                    duration: 2,
                });
            }
        } catch (error) {
            notification.error({
                message: "Upload ảnh thất bại!",
                placement: 'bottomRight',
                duration: 2,
            });
            console.error('Error uploading images:', error);
        }
    };

    const handleGetImageFacility = async () => {
        try {
            const res = await getImageFacility(id)
            if (res.status === 1) {
                setData(res.imageUrls)
            }
        } catch (err) {
            console.error("err: ", err)
        }
    }

    const handleDeleteImage = async (imageUrl) => {
        try {
            const res = await deleteImageFacility(imageUrl)
            if (res.status === 1) {
                setVisibleDeleteModal(false)
                handleGetImageFacility()
                notification.success({
                    message: "Xoá ảnh thành công!",
                    placement: 'bottomRight',
                    duration: 2,
                });
            }
        } catch (err) {
            console.log("err: ", err)
            notification.error({
                message: "Xoá ảnh thất bại!",
                placement: 'bottomRight',
                duration: 2,
            });
        }
    }

    return (
        <>
            <Modal
                open={visibleDeleteModal}
                onCancel={() => setVisibleDeleteModal(false)}
                onOk={() => handleDeleteImage(visibleDeleteModal)}
                title="Bạn muốn xoá ảnh này?"
                style={{ paddingTop: '50px' }}
            >
                <div className={cx('delete-image')}>
                    <img src={visibleDeleteModal} />
                </div>
            </Modal>

            <div className={cx('image-facility')}>
                <h3>Ảnh sân</h3>

                {user.role === 'manager' && (
                    <div className={cx('add-image')}>
                        <div>Thêm ảnh:</div>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            name="images"
                            onChange={handleImageChange}
                        />
                    </div>
                )}

                {selectedImages.length > 0 && (
                    <div>
                        <button className={cx('upload-button')} onClick={uploadImages}>
                            Upload
                        </button>
                        <div className={cx('image-preview')}>
                            {selectedImages.map((image, index) => (
                                <div key={index} className={cx('image-container')}>
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt={`preview-${index}`}
                                        className={cx('preview-image')}
                                    />
                                    <button
                                        className={cx('remove-button')}
                                        onClick={() => removeImage(index)}
                                    >
                                        X
                                    </button>
                                </div>
                            ))}
                        </div>
                        <hr />
                    </div>
                )}

                <div className={cx('image')}>
                    {data && data.map((image) => (
                        <div key={image.id} className={cx('list-image')}>
                            <img
                                src={image.imageURL}
                                className={cx('image-item')}
                            />
                            {user.role === 'manager' && (
                                <button
                                    className={cx('button-delete')}
                                    onClick={() => setVisibleDeleteModal(image.imageURL)}
                                >
                                    <CIcon icon={cilTrash} />
                                </button>
                            )}
                        </div>
                    ))
                    }
                </div>
            </div>
        </>
    );
}

export default ImageFacility;
