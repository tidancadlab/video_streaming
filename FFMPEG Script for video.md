ffmpeg -i video.mkv -filter_complex "[v:0]scale=256:144[v144]; [v:0]scale=426:240[v240]; [v:0]scale=640:360[v360]; [v:0]scale=854:480[v480]; [v:0]scale=1280:720[v720]; [v:0]scale=1920:1080[v1080]" -map "[v144]" -c:v:0 h264 -b:v:0 0.2M -map "[v240]" -c:v:1 h264 -b:v:1 0.5M -map "[v360]" -c:v:2 h264 -b:v:2 1M -map "[v480]" -c:v:3 h264 -b:v:3 2M -map "[v720]" -c:v:4 h264 -b:v:4 3M -map "[v1080]" -c:v:5 h264 -b:v:5 5M -c:a aac -strict -2 -var_stream_map "v:0,a:0 v:1,a:1 v:2,a:2 v:3,a:3 v:4,a:4 v:5,a:5" -hls_time 10 -hls_list_size 6 master_playlist.m3u8

ffmpeg -report -i video.mkv -filter*complex "[0:v]split=6[v144][v240][v360][v480][v720][v1080]; [v:0]scale=256:144[v144]; [v:0]scale=426:240[v240]; [v:0]scale=640:360[v360]; [v:0]scale=854:480[v480]; [v:0]scale=1280:720[v720]; [v:0]scale=1920:1080[v1080]" -map "[v144]" -c:v:0 h264 -b:v:0 0.2M -map "[v240]" -c:v:1 h264 -b:v:1 0.5M -map "[v360]" -c:v:2 h264 -b:v:2 1M -map "[v480]" -c:v:3 h264 -b:v:3 2M -map "[v720]" -c:v:4 h264 -b:v:4 3M -map "[v1080]" -c:v:5 h264 -b:v:5 5M -c:a aac -strict -2 -f hls -var_stream_map "v:0 v:1 v:2 v:3 v:4 v:5" -hls_time 3 -hls_list_size 6 -master_pl_name master_playlist.m3u8 -hls_segment_filename "output*%v\_%03d.ts" -y

---

ffmpeg -hwaccel cuda -hwaccel_output_format cuda -i C:/Coding/backup/Video_Streaming/Lib/public/Media/output.mp4 \
"scale=256:144[v144]; scale=426:240[v240]; scale=640:360[v360]; scale=854:480[v480]; scale=1280:720[v720]; scale=1920:1080[v1080]"\
 -c:v h264 -b:v:0 0.2M -c:v h264 -b:v:1 0.5M -c:v h264 -b:v:2 1M -c:v h264 -b:v:3 2M -c:v h264 -b:v:4 3M -c:v h264 -b:v:5 5M -c:a aac \
-var_stream_map "v:0,a:0,name:144p v:1,a:1,name:240p v:2,a:2,name:360p v:3,a:3,name:480p v:4,a:4,name:720p v:5,a:5,name:1080p" \
-preset slow -hls_list_size 10 -threads 0 -f hls -hls_playlist_type event\
-hls_time 3 -hls_flags independent_segments -master_pl_name "master.m3u8" \
 "C:/Coding/backup/Video_Streaming/bin/mission/%v/manifest.m3u8"

---

ffmpeg -i test.mp4 `-filter_complex`
"[0:v]split=3[v1][v2][v3]; `[v1]copy[v1out]; [v2]scale=w=1280:h=720[v2out]; [v3]scale=w=640:h=360[v3out]"`
-map "[v1out]" -c:v:0 libx264 -x264-params "nal-hrd=cbr:force-cfr=1" -b:v:0 5M -maxrate:v:0 5M -minrate:v:0 5M -bufsize:v:0 10M -preset slow -g 48 -sc*threshold 0 -keyint_min 48 `-map "[v2out]" -c:v:1 libx264 -x264-params "nal-hrd=cbr:force-cfr=1" -b:v:1 3M -maxrate:v:1 3M -minrate:v:1 3M -bufsize:v:1 3M -preset slow -g 48 -sc_threshold 0 -keyint_min 48`
-map "[v3out]" -c:v:2 libx264 -x264-params "nal-hrd=cbr:force-cfr=1" -b:v:2 1M -maxrate:v:2 1M -minrate:v:2 1M -bufsize:v:2 1M -preset slow -g 48 -sc_threshold 0 -keyint_min 48 `-map a:0 -c:a:0 aac -b:a:0 96k -ac 2`
-map a:0 -c:a:1 aac -b:a:1 96k -ac 2 `-map a:0 -c:a:2 aac -b:a:2 48k -ac 2`
-f hls `-hls_time 2`
-hls_playlist_type vod `-hls_flags independent_segments`
-hls_segment_type mpegts `
-hls_segment_filename data*%v*%02d.ts `-master_pl_name master.m3u8`
-var_stream_map "v:0,a:0 v:1,a:1 v:2,a:2" stream*%v.m3u8

---

ffmpeg -ss 8.58909090909091 -i lib\public\Media\ce8c2fe3-dde9-4372-a114-d70fb1567a3b\ce8c2fe3-dde9-4372-a114-d70fb1567a3b.mp4 -y -filter_complex split=10[screen0][screen1][screen2][screen3][screen4][screen5][screen6][screen7][screen8][screen9] -vframes 1 -map [screen0] lib\public\media\ce8c2fe3-dde9-4372-a114-d70fb1567a3b\snapshots\tn_1.png -vframes 1 -map [screen1] -ss 8.58909090909091 lib\public\media\ce8c2fe3-dde9-4372-a114-d70fb1567a3b\snapshots\tn_2.png -vframes 1 -map [screen2] -ss 17.17818181818182 lib\public\media\ce8c2fe3-dde9-4372-a114-d70fb1567a3b\snapshots\tn_3.png -vframes 1 -map [screen3] -ss 25.76727272727273 lib\public\media\ce8c2fe3-dde9-4372-a114-d70fb1567a3b\snapshots\tn_4.png -vframes 1 -map [screen4] -ss 34.35636363636364 lib\public\media\ce8c2fe3-dde9-4372-a114-d70fb1567a3b\snapshots\tn_5.png -vframes 1 -map [screen5] -ss 42.94545454545455 lib\public\media\ce8c2fe3-dde9-4372-a114-d70fb1567a3b\snapshots\tn_6.png -vframes 1 -map [screen6] -ss 51.534545454545466 lib\public\media\ce8c2fe3-dde9-4372-a114-d70fb1567a3b\snapshots\tn_7.png -vframes 1 -map [screen7] -ss 60.123636363636365 lib\public\media\ce8c2fe3-dde9-4372-a114-d70fb1567a3b\snapshots\tn_8.png -vframes 1 -map [screen8] -ss 68.71272727272728 lib\public\media\ce8c2fe3-dde9-4372-a114-d70fb1567a3b\snapshots\tn_9.png -vframes 1 -map [screen9] -ss 77.30181818181819 lib\public\media\ce8c2fe3-dde9-4372-a114-d70fb1567a3b\snapshots\tn_10.png start

---

ffmpeg -i C:/Coding/backup/Video_Streaming/Lib/public/Media/output.mp4 \
-map 0:v:0 -map 0:a:0 -map 0:v:0 -map 0:a:0 -map 0:v:0 -map 0:a:0 \
-c:v libx264 -crf 22 -c:a aac -ar 48000 \
-filter:v:0 scale=w=480:h=360 -maxrate:v:0 600k -b:a:0 64k \
-filter:v:1 scale=w=640:h=480 -maxrate:v:1 900k -b:a:1 128k \
-filter:v:2 scale=w=1280:h=720 -maxrate:v:2 900k -b:a:2 128k \
-var_stream_map "v:0,a:0,name:360p v:1,a:1,name:480p v:2,a:2,name:720p" \
-preset slow -hls_list_size 0 -threads 0 -f hls -hls_playlist_type event -hls_time 3 \
-hls_flags independent_segments -master_pl_name "master.m3u8" \
"C:/Coding/backup/Video_Streaming/bin/output/vs%v/manifest.m3u8"

---

ffmpeg -i C:/Coding/backup/Video_Streaming/Lib/public/Media/output.mp4 -filter_complex \
 "[v:0]split=5[s0][s1][s2][s3][s4]; \
 [s0]scale=w=1920:h=1080:flags=lanczos[y0]; \
 [s1]scale=w=1280:h=720:flags=lanczos[y1]; \
 [s2]scale=w=854:h=480:flags=lanczos[y2]; \
 [s3]scale=w=480:h=360:flags=lanczos[y3]; \
 [s4]scale=w=426:h=240:flags=lanczos[y4]; \
 [y0]yadif=deint=interlaced[y0]; \
 [y1]yadif=deint=interlaced[y1]; \
 [y2]yadif=deint=interlaced[y2]; \
 [y3]yadif=deint=interlaced[y3]; \
 [y4]yadif=deint=interlaced[y4]" \
 -map "[y0]" -pix_fmt yuv420p -r 23.976 -vcodec libx264 -b:v:0 12M -preset medium -profile:v baseline -keyint_min 24 -level 3.0 -s 1920x1080 -g 48 -x264opts no-scenecut -strict experimental -map_metadata -1 \
 -map "[y1]" -pix_fmt yuv420p -r 23.976 -vcodec libx264 -b:v:1 7.5M -preset medium -profile:v baseline -keyint_min 24 -level 3.0 -s 1280x720 -g 48 -x264opts no-scenecut -strict experimental -map_metadata -1 \
 -map "[y2]" -pix_fmt yuv420p -r 23.976 -vcodec libx264 -b:v:2 4M -preset medium -profile:v baseline -keyint_min 24 -level 3.0 -s 854x480 -g 48 -x264opts no-scenecut -strict experimental -map_metadata -1 \
 -map "[y3]" -pix_fmt yuv420p -r 23.976 -vcodec libx264 -b:v:3 1.5M -preset medium -profile:v baseline -keyint_min 24 -level 3.0 -s 480x360 -g 48 -x264opts no-scenecut -strict experimental -map_metadata -1 \
 -map "[y4]" -pix_fmt yuv420p -r 23.976 -vcodec libx264 -b:v:4 1M -preset medium -profile:v baseline -keyint_min 24 -level 3.0 -s 426x240 -g 48 -x264opts no-scenecut -strict experimental -map_metadata -1 \
 -map a:0 -map a:0 -map a:0 -map a:0 -map a:0 -c:a aac -b:a 96k -af "aresample=async=1:min_hard_comp=0.100000:first_pts=0" \
 -f hls -var_stream_map "v:0,a:0 v:1,a:1, v:2,a:2, v:3,a:3, v:4,a:4" \
 -hls_time 10 -master_pl_name master.m3u8 "C:/Coding/backup/Video_Streaming/bin/output/vs%v/manifest.m3u8"

---

ffmpeg -i input.mp4 \
 -vf "scale=w1:h1" -c:v h264 -b:v:0 500k -map 0:a -c:a:0 aac -b:a:0 64k \
 -vf "scale=w2:h2" -c:v h264 -b:v:1 800k -map 0:a -c:a:1 aac -b:a:1 128k \
 -vf "scale=w3:h3" -c:v h264 -b:v:2 1200k -map 0:a -c:a:2 aac -b:a:2 192k \
 "v:0,a:0,name:360p v:1,a:1,name:480p v:2,a:2,name:720p" \
 -f hls -hls_time 10 -hls_playlist_type vod output.m3u8

------------------------------------------Final----------------------------------

ffmpeg -v error -hwaccel nvdec -hwaccel*output_format cuda -extra_hw_frames 10 -i C:/Coding/backup/Video_Streaming/Lib/public/Media/output.mp4 \
 -map 0:v:0 -map 0:a:0 -map 0:v:0 -map 0:a:0 -map 0:v:0 -map 0:a:0 \
 -c:v h264_nvenc -crf 22 -c:a aac -ar 48000 \
 -filter:v:0 "scale=h=144:w=-1" -b:v:0 500k -b:a:0 64k \
 -filter:v:1 "scale=h=360:w=-1" -b:v:1 700k -b:a:1 64k \
 -filter:v:2 "scale=h=480:w=-1" -b:v:2 1100k -b:a:2 128k \
 -filter:v:3 "scale=h=720:w=-1" -b:v:3 2500k -b:a:3 192k \
 -filter:v:4 "scale=h=1080:w=-1" -b:v:4 5000k -b:a:4 192k \
 -var_stream_map "v:0,a:0,name:144p v:1,a:1,name:360p v:2,a:2,name:480p v:3,a:3,name:720p v:4,a:4,name:1080p" \
 -preset slow -hls_list_size 10 -threads 0 -f hls event -hls_segment_filename abc*%03d.ts -hls_time 3 \
 -hls_flags independent_segments -master_pl_name "master.m3u8" -progress progress.log -stats \
 "C:/Coding/backup/Video_Streaming/bin/mission6/%v/manifest.m3u8"

----------------------------Updating--------------------------------------------------------

ffmpeg -v error -hwaccel nvdec -hwaccel*output_format cuda -extra_hw_frames 10 -i C:/Coding/backup/Video_Streaming/Lib/public/Media/output.mp4 \
 -map 0:v:0 -map 0:a:0 -map 0:v:0 -map 0:a:0 -map 0:v:0 -map 0:a:0 -map 0:v:0 -map 0:a:0 -map 0:v:0 -map 0:a:0 \
 -c:v h264_nvenc -crf 22 -c:a aac -ar 48000 \
 -filter:v:0 "scale=h=144:w=-1" -b:v:0 500k -b:a:0 64k \
 -filter:v:1 "scale=h=360:w=-1" -b:v:1 700k -b:a:1 64k \
 -filter:v:2 "scale=h=480:w=-1" -b:v:2 1100k -b:a:2 128k \
 -filter:v:3 "scale=h=720:w=-1" -b:v:3 2500k -b:a:3 192k \
 -filter:v:4 "scale=h=1080:w=-1" -b:v:4 5000k -b:a:4 192k \
 -var_stream_map "v:0,a:0,name:144p v:1,a:1,name:360p v:2,a:2,name:480p v:3,a:3,name:720p v:4,a:4,name:1080p" \
 -preset slow -hls_list_size 10 -threads 0 -f hls event -hls_time 3 \
 -hls_flags independent_segments -master_pl_name "master.m3u8" -progress progress.log -stats \
 "C:/Coding/backup/Video_Streaming/bin/mission6/%v/manifest*%v.m3u8"

----------------------------------working on it------------------------------------------------------
``` 
   ffmpeg -stats -v error -hwaccel nvdec -hwaccel_output_format cuda -extra_hw_frames 10 -i "${req.body.file}" \
  -map 0:v:0 -map 0:a:0 -map 0:v:0 -map 0:a:0 -map 0:v:0 -map 0:a:0 -map 0:v:0 -map 0:a:0 -map 0:v:0 -map 0:a:0 \
  -c:v h264_nvenc -crf 22 -c:a aac -ar 48000 \
  -filter:v:0 "drawtext=text='480p':fontsize=24:fontcolor=white:x=10:y=10, scale=h=480:w=-1" -b:v:0 700k -b:a:0 64k  \
  -filter:v:1 "drawtext=text='720p':fontsize=24:fontcolor=white:x=10:y=10, scale=h=720:w=-1" -b:v:1 1500k -b:a:1 128k  \
  -filter:v:2 "drawtext=text='1080p':fontsize=24:fontcolor=white:x=10:y=10, scale=h=1080:w=-1" -b:v:2 2500k -b:a:2 192k  \
  -filter:v:3 "drawtext=text='144p':fontsize=24:fontcolor=white:x=10:y=10, scale=h=144:w=-1" -b:v:3 300k -b:a:3 64k  \
  -filter:v:4 "drawtext=text='360p':fontsize=24:fontcolor=white:x=10:y=10, scale=h=360:w=-1" -b:v:4 500k -b:a:4 64k  \
  -var_stream_map "v:0,a:0,name:480p v:1,a:1,name:720p v:2,a:2,name:1080p v:3,a:3,name:144p v:4,a:4,name:360p" \
  -preset slow -hls_list_size 10 -threads 0 -f hls -hls_playlist_type event -hls_time 3 \
  -hls_flags independent_segments -master_pl_name "master.m3u8" -progress progress.log \
  "C:/Coding/backup/Video_Streaming/bin/${req.body.out}/%v/manifest.m3u8"
 ```


## Final Script for HLS 144p to 1080p Resolution Video Format

```javascript
const command = `ffmpeg -loglevel debug -stats -v error -hwaccel nvdec -hwaccel_output_format cuda -extra_hw_frames 5 -i "${req.body.file}" 
-map 0:v:0 -map 0:a:0 -metadata:s:a:0 language=hin -metadata:s:a:0 title="Hindi" 
-map 0:v:0 -map 0:a:0 -map 0:v:0 -map 0:a:0 -map 0:v:0 -map 0:a:0 -map 0:v:0 -map 0:a:0 
-c:v h264_nvenc -crf 22 -c:a aac -ar 48000 
-filter:v:0 "scale_cuda=h=480:w=-1" -b:v:0 700k -b:a:0 64k  
-filter:v:1 "scale_cuda=h=720:w=-1" -b:v:1 1500k -b:a:1 128k  
-filter:v:2 "scale_cuda=h=1080:w=-1" -b:v:2 2500k -b:a:2 192k  
-filter:v:3 "scale_cuda=h=144:w=-1" -b:v:3 300k -b:a:3 64k  
-filter:v:4 "scale_cuda=h=360:w=-1" -b:v:4 500k -b:a:4 64k  
-var_stream_map "v:0,a:0,name:480p v:1,a:1,name:720p v:2,a:2,name:1080p v:3,a:3,name:144p v:4,a:4,name:360p" 
-preset slow -hls_list_size 10 -threads 0 -f hls -hls_playlist_type event -hls_time 3 
-hls_flags independent_segments -master_pl_name "master.m3u8" -progress progress.log 
"C:/Coding/backup/Video_Streaming/bin/${req.body.out}/%v/manifest.m3u8"
 `;
```
