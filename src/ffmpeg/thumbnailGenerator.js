const { exec } = require('child_process');
const path = require('path');
const { mkDir } = require('../utils/simpleFunction');
const { joinPath } = require('../utils');
const { infoLog } = require('../logger');

/**
 * @param {string} videoSource - should be absolute path.
 * @param {object} [config]
 * @param {string} [config.folder] - default value is thumbnails
 * @param {string} [config.filename] - default value is thumbnail
 * @param {Array} [config.size] - default value is -1 means original.
 * @param {number} [config.time] - should be in seconds and default value is 1.
 * @returns {Promise<[{url: string, size: number}] | Error>}
 */

const createThumbnail = async (videoSource, config) => {
  const rest = config || {};
  if (!videoSource) return new Error('Please pass all required parameters');
  const { dir } = path.parse(videoSource);
  const folder = rest.folder || 'thumbnails';
  if (path.isAbsolute(folder)) return new Error('folder name should not be absolute, it should be relative from source folder');
  const filename = rest.filename || 'thumbnail';
  let extension = filename.split('.', 2)[1];
  const outPath = await joinPath(dir, folder);
  let time;
  let size = [];
  const imageUrls = [];

  await mkDir(outPath);

  if (!extension) {
    extension = `.png`;
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
    return new Error('you did something wrong in size parameter');
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

  infoLog('thumbnail generator started...', 'Thumbnail-generator');
  async function generate(n) {
    const pictureName = `${filename}_${size[n] !== -1 ? size[n] : 'original'}${extension}`;
    const output = await joinPath(outPath, pictureName);
    const url = await joinPath(dir.split('/').pop(), folder, pictureName);
    const command = `ffmpeg -v error -ss ${time} -i ${videoSource} -y -vf "thumbnail=360,scale=-1:${size[n]}" -frames:v 1 ${output}`;
    return new Promise((resolve) => {
      try {
        const exc = exec(command, (err) => err && console.log(err));
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
      } catch (error) {
        console.error(error);
      }
    });
  }
  const data = await generate(size.length - 1);
  infoLog('thumbnail generated', 'Thumbnail-generator');
  return data;
};

module.exports = { createThumbnail };
