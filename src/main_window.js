const {
  QMainWindow,
  QStackedWidget,
  WindowType,
  QWidget,
  QBoxLayout,
  Direction,
  QPushButton,
  QMouseEvent
} = require('@nodegui/nodegui');

const PlayerView = require('./player_view.js');
const PlaylistView = require('./playlist_view.js');

module.exports = class MainWindow extends QMainWindow{
  constructor(){
    super();

    this.mouse_click_x_coordinate;
    this.mouse_click_y_coordinate;

    this.root = new QWidget(this);
    this.root_layout = new QBoxLayout(Direction.TopToBottom);

    this.control = new QWidget();
    this.control_layout = new QBoxLayout(Direction.LeftToRight);

    this.close = new QPushButton();

    this.stack = new QStackedWidget(this);

    this.player_view = new PlayerView();
    this.playlist_view = new PlaylistView();

    this.setWindowTitle('苗');
    this.setObjectName('RootWindow');
    this.setMinimumSize(300, 150);
    this.setMaximumSize(300, 150);
    this.setWindowFlag(WindowType.FramelessWindowHint, true);

    this.setCentralWidget(this.root);

    this.root.setLayout(this.root_layout);
    this.root.setObjectName('Root');

    this.root_layout.setContentsMargins(0,0,0,0);
    this.root_layout.setSpacing(0);

    this.root_layout.addWidget(this.control);
    this.root_layout.addWidget(this.stack, 1);

    this.control.setLayout(this.control_layout);
    this.control.setObjectName('Control');

    this.control_layout.setContentsMargins(4,4,4,4);
    this.control_layout.setSpacing(0);

    this.control_layout.addStretch(1);
    this.control_layout.addWidget(this.close);

    this.close.setFixedSize(14, 14);

    this.stack.addWidget(this.player_view);
    this.stack.addWidget(this.playlist_view);

    this.stack.setCurrentWidget(this.player_view);

    this.control.addEventListener('MouseButtonPress', function(ev){
        ev = new QMouseEvent(ev);
        this.mouse_click_x_coordinate = ev.x();
        this.mouse_click_y_coordinate = ev.y();
    }.bind(this));

    this.control.addEventListener('MouseMove', function(ev){
        ev = new QMouseEvent(ev);
        console.log(ev.globalX() - this.mouse_click_x_coordinate, ev.globalY() - this.mouse_click_y_coordinate)
        this.move(ev.globalX() - this.mouse_click_x_coordinate, ev.globalY() - this.mouse_click_y_coordinate);

    }.bind(this));

    this.close.addEventListener('clicked', () => {
        process.exit(0);
    });
  }
}
