/**
 * @param {string} path path of source file
 * @param {string} numberOfThumbnails Quantity of picture which will generator
 * @param {string} destination Location where pictures will save in drive
 * @returns FFMPEG script for thumbnail
 */
const ffmpegThumbnailScript = async (path, numberOfThumbnails, destination) => `
        ffmpeg -ss 4 -i ${path} -vf "thumbnail,scale=640:360" -frames:v \
        ${numberOfThumbnails} -c:v h264_nvenc -vsync vfr -f image2 \
        ${destination}/images/thumb%d.jpg
        `;

/**
 *
 * @param {string} dirPath Absolute path of video directory
 * @param {string} destinationPath Name of video file which want to convert in HLS
 * @param {import('fluent-ffmpeg').FfprobeStream} metadata
 * @returns
 */
const ffmpegVideoHlsScript = (dirPath, destinationPath, metadata) => {
  const { rotation } = metadata || {};
  const path = dirPath.split(/\/|\\/).slice(0, -1).join('/');
  const destination = destinationPath ? `${destinationPath}/%v/manifest.m3u8` : `${path}/hls/%v/manifest.m3u8`;
  const script = `ffmpeg -loglevel debug -stats -v error -hwaccel nvdec -hwaccel_output_format cuda -extra_hw_frames 5 -i "${dirPath}" \
  -filter:v transpose=1 -map 0:v:0 -map 0:a:0 -metadata:s:a:0 language=hin -metadata:s:a:0 title="Hindi" \
  -map 0:v:0 -map 0:a:0 -map 0:v:0 -map 0:a:0 -map 0:v:0 -map 0:a:0 -map 0:v:0 -map 0:a:0 \
  -c:v h264_nvenc -crf 22 -c:a aac -ar 48000 \
  -filter:v:0 "scale_cuda=h=480:w=-1" -b:v:0 700k -b:a:0 64k  \
  -filter:v:1 "scale_cuda=h=720:w=-1" -b:v:1 1500k -b:a:1 128k  \
  -filter:v:2 "scale_cuda=h=1080:w=-1" -b:v:2 2500k -b:a:2 192k  \
  -filter:v:3 "scale_cuda=h=144:w=-1" -b:v:3 300k -b:a:3 64k  \
  -filter:v:4 "scale_cuda=h=360:w=-1" -b:v:4 500k -b:a:4 64k  \
  -var_stream_map "v:0,a:0,name:480p v:1,a:1,name:720p v:2,a:2,name:1080p v:3,a:3,name:144p v:4,a:4,name:360p" \
  -preset fast -hls_list_size 10 -threads 0 -f hls -hls_playlist_type event -hls_time 3 \
  -hls_flags independent_segments -master_pl_name "master.m3u8" \
"${destination}"`;
  return { script, destination: `${path.split('/').pop()}/hls/master.m3u8` };
};

module.exports = {
  ffmpegThumbnailScript,
  ffmpegVideoHlsScript,
};
