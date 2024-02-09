const { ffmpegThumbnailScript } = require('../../Script/ScriptGenerator');
const commandLineTool = require('../../Script/commandLineTool');
const { infoLog, errorLog } = require('../console');
/**
 *
 * @param {object} file
 * @param {number} numberOfThumbnails by default 3
 * @returns {Promise<object | null>}
 */
async function generateThumbnails(file, numberOfThumbnails = 3) {
  if (!file) { infoLog('No Data', 'thumbnail generator'); return null; }
  try {
    const command = await ffmpegThumbnailScript(file.path, numberOfThumbnails, file.destination);
    await commandLineTool(command);
    return file;
  } catch (error) {
    errorLog(error, 'thumbnail generator');
    return null;
  }
}

module.exports = { generateThumbnails };
