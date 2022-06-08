import React from 'react';

interface Iprops {
  value: number
  handle:Function
}

const LevelSeekbar = ({value, handle} :Iprops) => {
  function widgetsLabel() {
    let result = [];
    const text = ["쉬움", "약간 쉬움", "보통", "약간 어려움", "어려움"];
    for (let label of text)
      result.push(<p key={label}>{label}</p>);

    return result;
  }

  return (
    <div className="level_seekbar">
      <input type="range"
             min="0"
             max="4"
             step="number"
             list="seekbar_list"
             value={value}
             onChange={(e) => handle(parseInt(e.target.value))}/>
      <div className="label_layout">
        {widgetsLabel()}
      </div>
    </div>
  );
}

export default LevelSeekbar;
