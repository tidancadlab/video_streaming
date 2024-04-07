const multer = require('multer');
const { Router } = require('express');
const controllers = require('../../controller');
const userAuthentication = require('../../auth');

const router = Router();
const multerStorage = multer({ storage: multer.memoryStorage() });

router.route('/').post(userAuthentication, multerStorage.single('video'), controllers.video.videoUpload);

module.exports = router;
