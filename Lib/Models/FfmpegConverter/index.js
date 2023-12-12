const { exec } = require('child_process');
const Ffmpeg = require('fluent-ffmpeg');
const { Tail } = require('tail');
const dbConfig = require('../../Config/Database/dbConfig');
const {
  deleteCompletedItem, getWaitingList, dumpItem,
} = require('./WaitingRoom');
const { timeStrToSeconds } = require('../Helper/timeStrToSec');
const { generateThumbnails } = require('../Helper/ImageGenrater/thumbnailGenrater');

let underProgress = false;

const toHLS = async (file, duration = 90) => {
  if (underProgress) { console.info('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> the system is busy please wait'); return; }
  if (!file) { console.info('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> no Data'); return; }

  const { id, path, destination } = file;
  const command = `ffmpeg -loglevel debug -stats -v error -hwaccel nvdec -hwaccel_output_format cuda -extra_hw_frames 10 -i "${path}" \
  -map 0:v:0 -map 0:a:0 -metadata:s:a:0 language=hin -metadata:s:a:0 title="Hindi" \
  -map 0:v:0 -map 0:a:0 -map 0:v:0 -map 0:a:0 -map 0:v:0 -map 0:a:0 -map 0:v:0 -map 0:a:0 \
  -c:v h264_nvenc -crf 22 -c:a aac -ar 48000 \
  -filter:v:0 "scale_cuda=h=480:w=-1" -b:v:0 700k -b:a:0 64k  \
  -filter:v:1 "scale_cuda=h=720:w=-1" -b:v:1 1500k -b:a:1 128k  \
  -filter:v:2 "scale_cuda=h=1080:w=-1" -b:v:2 2500k -b:a:2 192k  \
  -filter:v:3 "scale_cuda=h=144:w=-1" -b:v:3 300k -b:a:3 64k  \
  -filter:v:4 "scale_cuda=h=360:w=-1" -b:v:4 500k -b:a:4 64k  \
  -var_stream_map "v:0,a:0,name:480p v:1,a:1,name:720p v:2,a:2,name:1080p v:3,a:3,name:144p v:4,a:4,name:360p" \
  -preset slow -hls_list_size 10 -threads 0 -f hls -hls_playlist_type event -hls_time 3 \
  -hls_flags independent_segments -master_pl_name "master.m3u8" -progress progress.log \
  "${destination}/hls/%v/manifest.m3u8"`;
  try {
    const exc = exec(command);
    exc.on('close', (code) => {
      console.info('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> close', code);
      underProgress = false;
      console.info(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>${JSON.stringify(file)}`);
      generateThumbnails(file)
        .then((i) => deleteCompletedItem(i))
        .then(async (s) => {
          console.info(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> isItem Delete completed: ${s}`);
          if (s) {
            getWaitingList().then(async (data) => {
              console.info('>>>>>>>>>>>>>>>>>>>>>> inside FFMPEG', data, new Date());
              await toHLS(data);
            });
          }
        });
    });
    exc.on('error', (code) => {
      console.info('error', code);
    });
    exc.on('exit', async (code) => {
      console.info('exit', code);
      if (code > 1) {
        console.info('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Dumping Started');
        await dumpItem(file).then(async (itemId) => {
          deleteCompletedItem(itemId);
        });
      }
    });
    exc.on('message', (code) => {
      console.info('message', code);
    });
    exc.stderr.on('data', async (data) => {
      timeStrToSeconds(data, duration);
      underProgress = true;
    });
    exc.stdout.on('data', (data) => {
      const frame = new Buffer(data).toString('base64');
      console.info(frame);
    });
  } catch (error) {
    console.error('error', error);
  }
};

const snapShot = (file) => {
  Ffmpeg(file.path)
    .on('end', () => {
      console.info('Screenshots and color palette generated successfully.');
    })
    .on('error', (err) => {
      console.error('Error:', err);
    })
    .output(`./lib/public/media/${file.filename.split('.')[0]}/Images/Thumbnails/M%d.jpg`)
    .outputOptions('-q:v', '2', '-vf', 'fps=1/10,scale=-1:200,tile=4x4')
    .output(`./lib/public/media/${file.filename.split('.')[0]}/Images/colors/color%d.png`)
    .run();
};

const getMeteData = (req, res, next) => {
  Ffmpeg.ffprobe(req.file.path, (err, data) => {
    if (err) {
      console.error(err);
    } else {
      req.file = { ...data, ...req.file };
      next();
    }

    // dbConfig.run(`insert into video_meta_data values('${req.file.filename.split('.')[0]}', '${JSON.stringify(req.file)}')`, (er, row) => {
    //   if (er) {
    //     console.error(er);
    //   }
    //   console.info(row);
    // });
  });
};

const streamUpdate = () => {
  const filepath = 'C:/Coding/backup/Video_Streaming/progress.log';
  const options = { fromBeginning: true };
  const tail = new Tail(filepath, options);
  tail.on('line', (data) => {
    console.info(data);
  });
  tail.on('error', (error) => {
    console.error('ERROR: ', error);
  });
  tail.watch();
};

module.exports = {
  toHLS, snapShot, getMeteData, streamUpdate,
};
