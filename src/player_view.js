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
  FileMode
} = require('@nodegui/nodegui');
const mime = require('mime-types');
const fs = require('fs');
const path = require('path');

const App = require('./index.js');

module.exports = class PlayerView extends QWidget{
  constructor(){
    super();

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
    this.search = new QPushButton();
    this.back = new QPushButton();
    this.play = new QPushButton();
    this.next = new QPushButton();
    this.list = new QPushButton();

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

    this.control_layout.addWidget(this.search);
    this.control_layout.addWidget(this.back);
    this.control_layout.addWidget(this.play);
    this.control_layout.addWidget(this.next);
    this.control_layout.addWidget(this.list);

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

    this.search.setObjectName('Search');
    this.search.setFlat(true);
    this.search.setText('Search');

    this.back.setObjectName('Back');
    this.back.setFlat(true);
    this.back.setText('Back');

    this.play.setObjectName('Play');
    this.play.setFlat(true);
    this.play.setText('Play');

    this.next.setObjectName('Next');
    this.next.setFlat(true);
    this.next.setText('Next');

    this.list.setObjectName('List');
    this.list.setFlat(true);
    this.list.setText('List');

    this.vol_icon_1.setObjectName('VolIcon1');
    this.vol_icon_1.setAlignment(AlignmentFlag.AlignCenter);

    this.vol_control.setObjectName('VolControl');
    this.vol_control.setOrientation(Orientation.Horizontal);

    this.vol_icon_2.setObjectName('VolIcon2');
    this.vol_icon_2.setAlignment(AlignmentFlag.AlignCenter);

    this.search.addEventListener('clicked', function(){
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
            !(mime.lookup && mime.lookup(file).match(/^audio/))
          ) continue;

          App.playlist.push(file);
        }

        console.log(App.playlist);
    }.bind(this));
  }
}
