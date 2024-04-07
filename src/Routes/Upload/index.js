const { Router } = require("express");
const multer = require("multer");
const auth = require("../../auth");
const { videoUpload } = require("../../controller/video");

// variables
const router = Router();
const multerStorage = multer({ storage: multer.memoryStorage() });

router
  .route("/")
  .post(auth, multerStorage.single("video"), videoUpload);

module.exports = router;
