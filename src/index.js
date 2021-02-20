const MPlayer = require('mplayer');

const MainWindow = require('./main_window.js');

const main_window = new MainWindow();
const player = new MPlayer();

const playlist = [];
var playlist_index = 0;

exports.playlist = playlist;
exports.playlist_index = playlist_index;
exports.player = player;

async function start(){
  main_window.show();
  global.win = main_window;

  player.on('start', console.log.bind(this, 'playback started'));
  player.on('status', console.log);
}

start();
