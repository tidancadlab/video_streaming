const commandLineTool = require('../../Script/commandLineTool');

const generateThumbnails = async (file, numberOfThumbnails = 3) => {
  if (!file) { console.info('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> no Data'); return; }

  const { id, path, destination } = file;
  const command = `ffmpeg -i ${path} -vf "thumbnail,scale=640:360" -frames:v ${numberOfThumbnails} -c:v h264_nvenc -vsync vfr -f image2 ${destination}/Images/thumb%d.jpg`;
  try {
    await commandLineTool(command);
    return id;
  } catch (error) {
    return undefined;
  }
};

module.exports = { generateThumbnails };
