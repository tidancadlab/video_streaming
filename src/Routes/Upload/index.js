const multer = require('multer');
const { Router } = require('express');
const controllers = require('../../controller');
const userAuthentication = require('../../auth');
const config = require('../../../config');
const { getFileExtension, joinPath, createDirectory } = require('../../utils');

const router = Router();
const multerStorage = multer({ storage: multer.memoryStorage() });

// TODO: below multer config can store video in single without chunk

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const dir = joinPath(config.PATH.VIDEO_STORAGE, req.body.id);
    createDirectory(dir);
    cb(null, dir);
  },
  filename(req, file, cb) {
    console.log(req);
    const ext = getFileExtension(file.originalname);
    cb(null, `original.${ext}`);
  },
});

const singleFileMulter = multer({ storage });

router.route('/').post(userAuthentication, multerStorage.single('video'), controllers.video.videoUpload);
router.route('/single').post(userAuthentication, singleFileMulter.single('video'), controllers.video.videoSingleUpload);

module.exports = router;
