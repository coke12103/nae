const MPlayer = require('mplayer');

const MainWindow = require('./main_window.js');

const main_window = new MainWindow();
const player = new MPlayer();

exports.player = player;

async function start(){
  main_window.show();
  global.win = main_window;

//  player.on('start', console.log.bind(this, 'playback started'));
//  player.on('status', console.log);
//
//  player.openFile('./test/test.mp3');
}

start();
