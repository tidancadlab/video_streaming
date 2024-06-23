const { randomUUID } = require('crypto');
const { statSync } = require('fs');
const { PATH } = require('../../../../config');
const { joinPath, getFileExtension } = require('../../../utils');

const savedVideoFileMetadata = {};

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {CallableFunction} next
 */

const checkPoint = (req, res, next) => {
  if (!savedVideoFileMetadata[req.body?.id]) {
    const id = req.body?.id || randomUUID();
    savedVideoFileMetadata[id] = {
      sourcePath: joinPath(PATH.VIDEO_STORAGE, id, `original.${getFileExtension(req.file.originalname)}`),
      totalSize: req.file.size,
    };
    console.log(savedVideoFileMetadata);
    next();
    return null;
  }
  const { sourcePath, totalSize } = savedVideoFileMetadata[req.body?.id];
  const savedFileSize = statSync(sourcePath).size;

  if (savedFileSize !== totalSize) {
    savedVideoFileMetadata[req.body?.id].totalSize = totalSize + req.file.size;
    return res.status(200).send('Received already');
  }
  savedVideoFileMetadata[req.body?.id].totalSize = totalSize + req.file.size;
  return next();
};

module.exports = checkPoint;
