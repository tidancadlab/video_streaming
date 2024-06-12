const { randomUUID } = require('crypto');
const { statSync, writeFileSync } = require('fs');

const models = require('../Database/models');
const config = require('../../config');
const { joinPath, createDirectory, getFileExtension } = require('../utils');
const { setVideoProfile } = require('../Database/models/video');

// Object to store video data temporarily
const items = {};

/**
 * @param {string} id
 * @param {Express.Multer.File} [file]
 * @param {{thumbnail: string, title: string, category: string, description: string, tags: Array}} [body]
 * @returns {Promise<{filename: string, videoDirectoryPath: string, videoSourcePath: string, videoId: string, hasThumbnail: boolean}>}
 * @description Creates a new video directory for the specified video directory path and video source path.
 */
const createVideoEnvironment = async (id, file, body) => {
  if (typeof id !== 'string') throw new Error('First parameter "id" should be of type string.');

  const item = items[id];
  if (item) return { videoId: id, ...item };

  if (!file) throw new Error('file object required to create new video Environment');

  const extension = getFileExtension(file.originalname);
  if (!['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(extension.toLowerCase())) {
    throw new Error(`The file extension .${extension} is not supported. It must be mp4, mov, or avi.`);
  }

  const videoId = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(id) ? id : randomUUID();
  const filename = `${config.FILENAME.VIDEO_ORIGINAL}.${extension}`;
  const videoDirectoryPath = joinPath(config.PATH.VIDEO_STORAGE, videoId);
  createDirectory(videoDirectoryPath);

  const videoItem = {
    filename,
    videoDirectoryPath,
    videoSourcePath: joinPath(videoDirectoryPath, filename),
    hasThumbnail: !!body.thumbnail,
  };

  items[videoId] = videoItem;

  // Insert video profile like title, category, description, tags
  await setVideoProfile({
    videoId: id,
    title: body.title,
    category: body.category || 'other',
    description: body.description || '',
    tags: body.tags || [],
  });

  // Save Thumbnail file and insert into table if is first request
  if (body.thumbnail) {
    try {
      const thumbnailPath = joinPath(videoDirectoryPath, config.FOLDERNAME.THUMBNAIL);
      const filePath = joinPath(thumbnailPath, 'original.jpeg');
      createDirectory(thumbnailPath);
      writeFileSync(filePath, body.thumbnail, 'base64');
      console.log('thumbnail saved');

      const fileSize = statSync(filePath).size;
      const result = await models.thumbnail.insert(videoId, `${id}/thumbnail/original.jpeg`, fileSize);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }

  return { videoId, ...videoItem };
};

module.exports = { createVideoEnvironment, items };
