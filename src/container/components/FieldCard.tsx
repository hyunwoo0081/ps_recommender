import React from 'react';

interface Iprops {
  tag: { key: string, ko: string }
  deleteTag: Function
}

const FieldCard = ({tag, deleteTag}: Iprops) => {
  return (
    <div className="tag_card">
      <img src="/tag.png" alt="🏷"/>
      <h5>{tag.ko}</h5>
      <h6>{tag.key}</h6>
      <button onClick={() => deleteTag()}>
        <img src="/xb.png" alt="x"/>
      </button>
    </div>
  );
}

export default FieldCard;
