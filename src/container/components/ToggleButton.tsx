import React from 'react';

interface Iprops {
  checked: boolean
  title: string
  onClick: Function
}

const ToggleButton = ({checked, title, onClick}: Iprops) => {
  return (
    <button className={checked ? "toggle_button selected" : "toggle_button"}
            onClick={() => onClick()}>{title}</button>
  );
}

export default ToggleButton;
