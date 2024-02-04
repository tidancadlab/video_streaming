const { ffmpegThumbnailScript } = require('../../Script/ScriptGenerator');
const commandLineTool = require('../../Script/commandLineTool');
const { infoLog, errorLog } = require('../console');
/**
 *
 * @param {*} file
 * @param {*} numberOfThumbnails
 * @returns it will return the unique _id of file
 */
async function generateThumbnails(file, numberOfThumbnails = 3) {
  if (!file) { infoLog('No Data', 'thumbnail generator'); return; }

  const { id, path, destination } = file;
  try {
    const command = await ffmpegThumbnailScript(path, numberOfThumbnails, destination);
    const data = await commandLineTool(command);
    if (data) {
      return id;
    }
  } catch (error) {
    errorLog(error, 'thumbnail generator');
  }
}

module.exports = { generateThumbnails };
