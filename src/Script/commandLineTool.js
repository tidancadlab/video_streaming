const { exec } = require('child_process');
const { infoLog, errorLog, warnLog } = require('../logger');

/**
 * @param {string} command Script string which will run for terminal.
 * @returns {string} promise with success message or error on unsuccess.
 */

const commandLineTool = async (command) => {
  warnLog(command, 'commandLineTool-top');
  const cmd = exec(command);
  cmd.stdout.on('data', (chunk) => {
    infoLog(chunk, 'commandLineTool-stdout-data');
  });
  cmd.stderr.on('data', (chunk) => {
    infoLog(chunk, 'commandLineTool-stderr-data');
  });
  return new Promise((resolve, reject) => {
    cmd.on('close', (code) => {
      infoLog(code);
      if (code <= 1) {
        infoLog('command Executed Successfully.', `${__dirname} commandingTool`);
        resolve(true);
        return;
      }
      errorLog('command Execution stopped due to some Reason.', `${__dirname} commandingTool`);
      reject(new Error('this is now working'));
    });
  });
};

module.exports = commandLineTool;
