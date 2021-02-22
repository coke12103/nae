const {
  QWidget,
  QBoxLayout,
  Direction,
  QLabel,
  QSlider,
  AlignmentFlag,
  Orientation,
  QMouseEvent
} = require('@nodegui/nodegui');

module.exports = class Progress extends QWidget{
  constructor(){
    super();

    this.layout = new QBoxLayout(Direction.LeftToRight);

    this.current = new QLabel();
    this.bar = new QSlider();
    this.end = new QLabel();

    this.setObjectName('Progress');
    this.setLayout(this.layout);

    this.layout.setContentsMargins(10,0,10,0);
    this.layout.setSpacing(5);

    this.layout.addWidget(this.current);
    this.layout.addWidget(this.bar, 1);
    this.layout.addWidget(this.end);

    this.current.setObjectName('Current');
    this.current.setAlignment(AlignmentFlag.AlignVCenter|AlignmentFlag.AlignRight);
    this.current.setWordWrap(false);

    this.bar.setObjectName('ProgressBar');
    this.bar.setOrientation(Orientation.Horizontal);

    this.end.setObjectName('End');
    this.end.setAlignment(AlignmentFlag.AlignVCenter|AlignmentFlag.AlignLeft);
    this.end.setWordWrap(false);

    this.bar.addEventListener('MouseButtonPress', function(ev){
        ev = new QMouseEvent(ev);
        this.bar.setValue((this.bar.maximum() * ev.x()) / this.bar.size().width());
    }.bind(this));

    this.reset();
  }

  reset(){
    this.bar.setRange(0,0);
    this.bar.setValue(0,0);
    this.current.setText('0:00');
    this.end.setText('0:00');
  }
}
