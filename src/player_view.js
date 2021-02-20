const {
  QWidget,
  QBoxLayout,
  Direction,
  QLabel,
  QSlider,
  QPushButton,
  AlignmentFlag,
  Orientation,
  QFileDialog,
  FileMode,
  QMouseEvent
} = require('@nodegui/nodegui');
const mime = require('mime-types');
const fs = require('fs');
const path = require('path');

const App = require('./index.js');

const STATUS = {
  STOP: 0,
  PLAY: 1,
  PAUSE: 2,
  CHANGE: 3,
  END: 4
};

const ParseTime = function(time){
  var min = parseInt(time / 60);
  var sec = parseInt(time % 60);

  if(sec < 10) sec = '0' + sec;

  return `${min}:${sec}`;
}

module.exports = class PlayerView extends QWidget{
  constructor(){
    super();

    this.status = STATUS.STOP;
    this.isSlid = false;

    this.layout = new QBoxLayout(Direction.TopToBottom);

    this.info = new QWidget();
    this.info_layout = new QBoxLayout(Direction.LeftToRight);

    this.progress = new QWidget();
    this.progress_layout = new QBoxLayout(Direction.LeftToRight);

    this.control = new QWidget();
    this.control_layout = new QBoxLayout(Direction.LeftToRight);

    this.vol = new QWidget();
    this.vol_layout = new QBoxLayout(Direction.LeftToRight);

    // info
    this.title = new QLabel();
    this.status_icon = new QLabel();

    // progress
    this.current = new QLabel();
    this.progress_bar = new QSlider();
    this.end = new QLabel();

    // control
    this.search_button = new QPushButton();
    this.back_button = new QPushButton();
    this.play_button = new QPushButton();
    this.next_button = new QPushButton();
    this.list_button = new QPushButton();

    // vol
    this.vol_icon_1 = new QLabel();
    this.vol_control = new QSlider();
    this.vol_icon_2 = new QLabel();

    this.setObjectName('PlayerView');
    this.setLayout(this.layout);

    this.layout.setContentsMargins(10, 5, 10, 5);
    this.layout.setSpacing(5);

    this.layout.addWidget(this.info);
    this.layout.addWidget(this.progress);
    this.layout.addWidget(this.control);
    this.layout.addWidget(this.vol);

    this.info.setObjectName('Info');
    this.info.setLayout(this.info_layout);

    this.info_layout.setContentsMargins(0,0,0,0);
    this.info_layout.setSpacing(5);

    this.info_layout.addWidget(this.title, 1);
    this.info_layout.addWidget(this.status_icon);

    this.progress.setObjectName('Progress');
    this.progress.setLayout(this.progress_layout);

    this.progress_layout.setContentsMargins(10,0,10,0);
    this.progress_layout.setSpacing(5);

    this.progress_layout.addWidget(this.current);
    this.progress_layout.addWidget(this.progress_bar, 1);
    this.progress_layout.addWidget(this.end);

    this.control.setObjectName('PlayerControl');
    this.control.setLayout(this.control_layout);

    this.control_layout.setContentsMargins(0,0,0,0);
    this.control_layout.setSpacing(5);

    this.control_layout.addWidget(this.search_button);
    this.control_layout.addWidget(this.back_button);
    this.control_layout.addWidget(this.play_button);
    this.control_layout.addWidget(this.next_button);
    this.control_layout.addWidget(this.list_button);

    this.vol.setObjectName('Vol');
    this.vol.setLayout(this.vol_layout);

    this.vol_layout.setContentsMargins(0,0,0,0);
    this.vol_layout.setSpacing(5);

    this.vol_layout.addWidget(this.vol_icon_1);
    this.vol_layout.addWidget(this.vol_control, 1);
    this.vol_layout.addWidget(this.vol_icon_2);

    this.title.setObjectName('Title');
    this.title.setWordWrap(false);
    this.title.setAlignment(AlignmentFlag.AlignCenter);
    this.title.setText('No Playlist')

    this.status_icon.setObjectName('StatusIcon');
    this.status_icon.setAlignment(AlignmentFlag.AlignCenter);

    this.current.setObjectName('Current');
    this.current.setAlignment(AlignmentFlag.AlignVCenter|AlignmentFlag.AlignRight);
    this.current.setWordWrap(false);
    this.current.setText('0:00');

    this.progress_bar.setObjectName('ProgressBar');
    this.progress_bar.setOrientation(Orientation.Horizontal);

    this.end.setObjectName('End');
    this.end.setAlignment(AlignmentFlag.AlignVCenter|AlignmentFlag.AlignLeft);
    this.end.setWordWrap(false);
    this.end.setText('0:00');

    this.search_button.setObjectName('SearchButton');
    this.search_button.setFlat(true);
    this.search_button.setText('Search');

    this.back_button.setObjectName('BackButton');
    this.back_button.setFlat(true);
    this.back_button.setText('Back');

    this.play_button.setObjectName('PlayButton');
    this.play_button.setFlat(true);
    this.play_button.setText('Play');

    this.next_button.setObjectName('NextButton');
    this.next_button.setFlat(true);
    this.next_button.setText('Next');

    this.list_button.setObjectName('ListButton');
    this.list_button.setFlat(true);
    this.list_button.setText('List');

    this.vol_icon_1.setObjectName('VolIcon1');
    this.vol_icon_1.setAlignment(AlignmentFlag.AlignCenter);

    this.vol_control.setObjectName('VolControl');
    this.vol_control.setOrientation(Orientation.Horizontal);

    this.vol_icon_2.setObjectName('VolIcon2');
    this.vol_icon_2.setAlignment(AlignmentFlag.AlignCenter);

    this.search_button.addEventListener('clicked', function(){
        const dialog = new QFileDialog();
        dialog.setFileMode(FileMode.Directory);
        dialog.exec();

        if(dialog.result() != 1) return;

        var dir = dialog.selectedFiles()[0];
        var files = fs.readdirSync(dir);
        App.playlist.length = 0;

        for(var file of files){
          file = path.join(dir, file);

          if(
            (fs.statSync(file) && fs.statSync(file).isDirectory()) ||
            !(mime.lookup(file) && mime.lookup(file).match(/^audio/))
          ) continue;

          App.playlist.push(file);
        }

        this.title.setText('Ready');
        console.log(App.playlist);
    }.bind(this));

    this.play_button.addEventListener('clicked', function(){
        if(!App.playlist.length <= 0) this.play();
    }.bind(this));

    this.next_button.addEventListener('clicked', function(){
        this.next();
    }.bind(this));

    this.back_button.addEventListener('clicked', function(){
        this.back();
    }.bind(this));

    this.progress_bar.addEventListener('sliderPressed', function(){
        this.isSlid = true;
    }.bind(this));

    this.progress_bar.addEventListener('sliderReleased', function(){
        if(this.status == STATUS.PLAY || this.status == STATUS.PAUSE) App.player.seek(this.progress_bar.value());
        this.isSlid = false;
    }.bind(this));

    this.progress_bar.addEventListener('MouseButtonPress', function(ev){
        ev = new QMouseEvent(ev);
        this.progress_bar.setValue((this.progress_bar.maximum() * ev.x()) / this.progress_bar.size().width());
    }.bind(this));

    App.player.on('start', async function(){
        var len = await App.player.mediaLength();

        this.end.setText(ParseTime(len));
        this.progress_bar.setRange(0, parseInt(len));
    }.bind(this));

    App.player.on('time', function(time){
        if(this.isSlid){
          this.current.setText(ParseTime(this.progress_bar.value()));
        }else{
          this.current.setText(ParseTime(time));
          this.progress_bar.setValue(parseInt(time));
        }
    }.bind(this));

    App.player.on('stop', function(){
        if(this.status == STATUS.CHANGE || this.status == STATUS.STOP) return;
        if(this.status == STATUS.END) return;

        this.status = STATUS.STOP;
        this.next();
    }.bind(this));
  }

  play(){
    switch(this.status){
      case STATUS.STOP:
      case STATUS.CHANGE:
      case STATUS.END:
        var media = App.playlist[App.playlist_index];

        App.player.openFile(media);
        this.title.setText(path.parse(media).name)
        this.status = STATUS.PLAY;
        this.play_button.setText('Pause');
        break;
      case STATUS.PLAY:
        App.player.pause();
        this.status = STATUS.PAUSE;
        this.play_button.setText('Play');
        break;
      case STATUS.PAUSE:
        App.player.play();
        this.status = STATUS.PLAY;
        this.play_button.setText('Pause');
    }
  }

  next(){
    this.status = STATUS.CHANGE;
    App.player.stop();

    // 止まったのを確認した上で発火しないと無限に飛びまくる
    App.player.once('stop', function(){
        App.playlist_index++;

        if(App.playlist_index >= App.playlist.length){
          this.status = STATUS.END;
          this.play_button.setText('Play');
          this.title.setText('END');
          this.progress_bar.setValue(0);
          this.current.setText('0:00');
          this.end.setText('0:00');
          App.playlist_index = 0;
          return;
        }

        this.play();
    }.bind(this));
  }

  back(){
    this.status = STATUS.CHANGE;
    App.player.stop();

    App.playlist_index--;

    if(App.playlist_index < 0) App.playlist_index = 0;

    // 止まったのを確認した上で発火しないと無限に飛びまくる
    App.player.once('stop', function(){
        this.play();
    }.bind(this));
  }
}
