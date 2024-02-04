const { exec } = require('child_process');
const { errorLog, infoLog } = require('../Helper/console');

/**
 * @param {*} command Script string which will run for terminal.
 * @returns promise with success message or error on unsuccess.
 */

const commandLineTool = async (command) => {
  const cmd = exec(command, (error, stdout, stderr) => {
    if (error) {
      errorLog(`Error: ${error.message}`, 'cmd');
      return;
    }
    if (stderr) {
      errorLog(`FFmpeg Output: ${stderr}`, 'cmd');
      return;
    }
    infoLog('successfully Completed.', 'cmd');
  });
  return new Promise((resolve, reject) => {
    cmd.on('close', (code) => {
      infoLog(code);
      if (code <= 1) {
        infoLog('command Executed Successfully.', 'cmd');
        resolve(true);
        return;
      }
      errorLog('command Execution stopped due to some Reason.', 'cmd');
      reject(new Error('this is now working'));
    });
  });
};

module.exports = commandLineTool;
