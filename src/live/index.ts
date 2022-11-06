import { Logger } from '@nestjs/common';
import config from 'src/config/config';
import { Md5 } from 'src/utils/utils';

const NodeMediaServer = require('node-media-server');

const configOptions = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60,
  },
  http: {
    port: 7003,
    mediaroot: './media',
    allow_origin: '*',
  },
  // auth: {
  //   play: true,
  //   publish: true,
  //   secret: config.keys,
  // },
  // trans: {
  //   ffmpeg: './plugins/ffmpeg.exe',
    // tasks: [
    //   {
    //     app: 'live',
    //     mp4: true,
    //     mp4Flags: '[movflags=frag_keyframe+empty_moov]',
    //   },
    // ],
    // tasks: [
    //   {
    //     app: 'live',
    //     ac: 'acc',
    //     vc: 'libx264',
    //     hls: true,
    //     hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
    //     dash: true,
    //     dashFlags: '[f=dash:window_size=3:extra_window_size=5]',
    //   },
    // ],
  // },
};
// http://localhost:7003/livestream/.flv

function startLiveServer() {
  const logger = new Logger('Live');
  const nms = new NodeMediaServer(configOptions);
  nms.run();
  const time = new Date().getTime() + 1000 * 100;
  const rmtpUrl = Md5(`/live/stream-${time}-${config.keys}`);
  logger.log(`Live推流测试地址：rtmp://127.0.0.1:${configOptions.rtmp.port}/live/stream?sign=${rmtpUrl}`);
  logger.log(`Live服务启动:127.0.0.1:${configOptions.http.port}`);
}

export default startLiveServer;
