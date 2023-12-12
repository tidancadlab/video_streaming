const { randomUUID } = require('crypto');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const dbConfig = require('../../Config/Database/dbConfig');

// middleware
const storage = multer.diskStorage({
  destination(req, file, cb) {
    req.uuid = randomUUID();
    const filePath = `./lib/public/Media/${req.uuid}`;
    fs.mkdirSync(filePath, { recursive: true });
    cb(null, filePath); // Destination folder for uploaded files
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, req.uuid + ext); // Unique filename based on timestamp
  },
});

const upload = multer({ storage });

const insertVideoDataInDBTable = async (req) => {
  const {
    id = req.uuid,
    titleName,
    uploadedBy,
    description,
    uploadedOn = Date.now(),
  } = req.file;

  try {
    await dbConfig.run(`INSERT INTO 
    video (id, title_name, uploaded_on, uploaded_by, description) 
    values ('${id}', '${titleName}','${uploadedOn}','${uploadedBy}', '${description}' )`, (error, row) => {
      if (error) { console.error(error); return; }
      console.info(row);
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = { upload, insertVideoDataInDBTable };
