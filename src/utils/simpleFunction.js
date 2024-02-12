const { randomUUID } = require("crypto");
const { existsSync, mkdirSync } = require("fs");
const { infoLog } = require("../logger");

/**
 * @param {string | number} id
 * @returns {Promise<`${string}-${string}-${string}-${string}-${string}`>}
 */
const videoId = async (id) => (id.length < 20 ? randomUUID() : id);

/**
 * @param {string} path
 */
const mkDir = async (path) => {
  if (!existsSync(path)) {
    const result = mkdirSync(path, { recursive: true });
    infoLog(result, __filename);
  }
};

/**
 * @param {string} id
 * @param {string} path
 * @param {object} file
 */
const waitingListNewItem = (id, path, file) => ({
  id,
  thumbnailId: randomUUID(),
  watchId: randomUUID(),
  metaId: randomUUID(),
  videoId: randomUUID(),
  path,
  destination: path,
  duration: file.streams[1].duration,
});

module.exports = { videoId, mkDir, waitingListNewItem };
