import React from 'react';

import TagImg from "container/static/tag.png";
import XImg from "container/static/xb.png";

interface Iprops {
  tag: { key: string, ko: string }
  deleteTag: Function
}

const FieldCard = ({tag, deleteTag}: Iprops) => {
  return (
    <div className="tag_card">
      <img src={TagImg} alt="🏷"/>
      <h5>{tag.ko}</h5>
      <h6>{tag.key}</h6>
      <button onClick={() => deleteTag()}>
        <img src={XImg} alt="x"/>
      </button>
    </div>
  );
}

export default FieldCard;
