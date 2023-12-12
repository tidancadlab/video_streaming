const fs = require('fs');
const { argv } = require('yargs');

const baseVideo = argv.video;
const { exec } = require('child_process');

// Function to create a directory if it doesn't exist
function createDirectoryIfNotExists(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
}

// Function to run ffmpeg command for each input
function runFFmpegCommand(outputDirectory, outputFileName, input = baseVideo) {
  const command = `ffmpeg -i ${input} -s 854x480 -c:v libx264 -b:v 1000k -c:a aac -b:a 128k -f dash -use_timeline 0 -min_seg_duration 500000 -init_seg_name "init-$RepresentationID$.m4s" -media_seg_name "chunk-$RepresentationID$-$Number%05d$.m4s" -adaptation_sets "id=0,streams=v id=1,streams=a" ${outputDirectory}/${outputFileName}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error running ffmpeg: ${stderr}`);
    } else {
      console.log(`FFmpeg command executed successfully: ${stdout}`);
    }
  });
}

function runFfmpeg() {
  // List of input files and corresponding output directories and filenames
  const inputFiles = ['input1.mkv', 'input2.mkv', 'input3.mkv'];
  const outputDirectories = ['output1', 'output2', 'output3'];
  const outputFilenames = ['480p_output.mpd', '720p_output.mpd', '1080p_output.mpd'];

  // Create directories and run ffmpeg commands for each input
  for (let i = 0; i < 3; i++) {
    const outputDirectory = outputDirectories[i];
    const outputFilename = outputFilenames[i];

    createDirectoryIfNotExists(outputDirectory);
    runFFmpegCommand(outputDirectory, outputFilename);
  }

  // Create main MPD file
  const mainMpdContent = `
    <?xml version="1.0" encoding="utf-8"?>
    <MPD xmlns="urn:mpeg:dash:schema:mpd:2011" profiles="urn:mpeg:dash:profile:isoff-live:2011" minBufferTime="PT1S" type="dynamic" publishTime="1970-01-01T00:00:00Z">
      <Period>
        <AdaptationSet segmentAlignment="true" maxWidth="1920" maxHeight="1080" maxFrameRate="24" par="16:9" lang="und">
          <Representation id="480p" mimeType="video/mp4" codecs="avc1.64001F" bandwidth="1000000">
            <BaseURL>${outputDirectories[0]}/${outputFilenames[0]}</BaseURL>
          </Representation>
          <Representation id="720p" mimeType="video/mp4" codecs="avc1.64001F" bandwidth="2000000">
            <BaseURL>${outputDirectories[1]}/${outputFilenames[1]}</BaseURL>
          </Representation>
          <Representation id="1080p" mimeType="video/mp4" codecs="avc1.64001F" bandwidth="4000000">
            <BaseURL>${outputDirectories[2]}/${outputFilenames[2]}</BaseURL>
          </Representation>
        </AdaptationSet>
      </Period>
    </MPD>
    `;

  fs.writeFileSync('main.mpd', mainMpdContent);
}

module.exports = runFfmpeg;
