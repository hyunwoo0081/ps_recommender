import React, {useState} from 'react';
import 'container/styles/LevelSeekbar.scss';

interface Iprops {
  handle:Function
}

const LevelSeekbar = ({handle} :Iprops) => {
  const [x, setX] = useState(0);

  function onDrag(e :any) {
    e = e || window.event;
    e.preventDefault();

    let elmnt = document.querySelector(".circle");
    if (elmnt === null) return;
    console.log(e);
    setX(e.clientX - e.target.offsetLeft);
  }

  function onDragEnd(e :any) {
    setX(e.clientX - e.target.offsetLeft);
    console.log("finished", e);
  }

  return (
    <div className="level_seekbar" draggable="true" onDrag={onDrag} onDragEnd={onDragEnd}>
      <div className="circle" style={{left: x+"px"}}/>
    </div>
  );
}

export default LevelSeekbar;
