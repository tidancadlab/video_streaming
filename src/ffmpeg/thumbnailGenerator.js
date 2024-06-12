const { exec } = require('child_process');
const path = require('path');
const { joinPath, createDirectory } = require('../utils');
const { infoLog } = require('../logger');
const { CustomError, CODES } = require('../error');

/**
 * @param {string} source - should be absolute path.
 * @param {object} [config]
 * @param {string} [config.folder] - default value is thumbnails
 * @param {string} [config.filename] - default value is thumbnail
 * @param {Array} [config.size] - default value is -1 means original.
 * @param {number} [config.time] - should be in seconds and default value is 1.
 * @returns {Promise<[{url: string, size: number, outPath: string}]>}
 */

const createThumbnail = async (source, config) => {
  infoLog('Generator start', 'thumbnail-item-insert');
  if (!source || typeof source !== 'string') {
    throw new CustomError({ ...CODES.THUMBNAIL_GENERATE_PARAMS_ERROR, name: 'thumbnail-generator-no-params' });
  }

  const rest = config || {};
  const isImage = ['jpeg', 'jpg', 'png'].includes(source.split('.').at(-1));
  const { dir } = path.parse(source);
  const folder = rest.folder || 'thumbnail';
  if (path.isAbsolute(folder)) {
    throw new CustomError(
      'folder name should not be absolute, it should be relative from source folder',
      'thumbnail-generator-path',
      CODES.THUMBNAIL_GENERATE_ERROR.code,
    );
  }
  const filename = rest.filename || 'thumbnail';
  let extension = filename.split('.', 2)[1];
  const outPath = isImage ? dir : joinPath(dir, folder);
  let time;
  let size = [];
  const imageUrls = [];

  await createDirectory(outPath);

  if (!extension) {
    extension = `.jpeg`;
  } else {
    extension = `.${extension}`;
  }

  if (!('size' in rest)) {
    size = [-1];
  } else if (Array.isArray(rest.size)) {
    size = config.size;
  } else if (typeof rest.size === 'number') {
    size = [config.size];
  } else {
    throw new CustomError('you did something wrong in size parameter.', 'thumbnail-generator-no-size', CODES.THUMBNAIL_GENERATE_ERROR.code);
  }

  if (!('time' in rest)) {
    time = 1;
  } else {
    time = Number(rest.time);
    if (Number.isNaN(time)) {
      time = 1;
    } else {
      time = rest.time;
    }
  }

  infoLog('start', 'Thumbnail-generator');
  async function generate(n) {
    const pictureName = `${filename}_${size[n] !== -1 ? size[n] : 'original'}${extension}`;
    const output = joinPath(outPath, pictureName);
    const url = isImage ? joinPath(dir.split('/').at(-2), folder, pictureName) : joinPath(dir.split('/').pop(), folder, pictureName);
    const command = `ffmpeg -v error ${!isImage ? `-ss ${time}` : ''} -i ${source} -y -vf "thumbnail=360,scale=-1:${size[n]}" -frames:v 1 ${output}`;
    console.log(command);
    return new Promise((resolve, reject) => {
      const exc = exec(command, (err) => {
        if (err) {
          console.error(err);
          reject(new CustomError(err.message, err.name, CODES.THUMBNAIL_GENERATE_ERROR.code));
        }
      });
      exc.on('close', (code) => {
        if (code === 0) {
          imageUrls.push({ url, size: size[n], output });
          if (n > 0) {
            resolve(generate(n - 1));
          } else {
            resolve(imageUrls);
          }
        }
      });
    });
  }
  const data = await generate(size.length - 1);
  infoLog('thumbnail generated Successfully', 'Thumbnail-generator');
  return data;
};

module.exports = { createThumbnail };
