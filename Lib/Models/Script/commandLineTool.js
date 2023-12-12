const { exec } = require('child_process');

const commandLineTool = async (command) => {
  const cmd = exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`FFmpeg Output: ${stderr}`);
      return;
    }
    console.info('successfully Completed.');
  });
  cmd.on('close', (code) => {
    console.info(code);
    if (code <= 1) {
      console.info('>>>>>>>>>>>>>>>>>>>>>>>>>>>>> command Executed Successfully.');
    } else {
      console.info('>>>>>>>>>>>>>>>>>>>>>>>>>>>>> command Execution stopped due to some Reason.');
    }
  });
};

module.exports = commandLineTool;
