const { existsSync, mkdirSync } = require("fs");
const { infoLog } = require("../logger");

/**
 * @param {string} path
 */
const mkDir = async (path) => {
  if (!existsSync(path)) {
    const result = mkdirSync(path, { recursive: true });
    infoLog(result, __filename);
  }
};

module.exports = { mkDir };
