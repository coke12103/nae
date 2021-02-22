const MPlayer = require('mplayer');

const MainWindow = require('./main_window.js');

const player = new MPlayer();
exports.player = player;

const playlist = [];
var playlist_index = 0;
exports.playlist = playlist;
exports.playlist_index = playlist_index;

const main_window = new MainWindow();

async function start(){
  main_window.show();
  global.win = main_window;
}

start();
