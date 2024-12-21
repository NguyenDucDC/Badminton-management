const express = require('express');
const router = express.Router();
const multer = require('multer');
const Authorization = require('../middleware/authorization');
const postsController = require('../controllers/postsController');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/create-posts', Authorization.authenToken(), upload.array('images', 20), postsController.createPosts );
router.get('/get-all-posts', postsController.getAllPosts);
router.delete('/delete-posts/:id', Authorization.authenToken(), postsController.deletePosts);
router.patch('/update-posts/:id', Authorization.authenToken(), upload.array('images', 20), postsController.updatePosts);

router.get('/get-posts/:id', Authorization.authenToken(), postsController.getPostsByUserId);


module.exports = router;
