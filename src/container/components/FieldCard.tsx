import React from 'react';

interface Iprops {
  tagName: string,
  tagKey: string,
  deleteTag: Function
}

const FieldCard = ({tagName, tagKey, deleteTag}: Iprops) => {
  return (
    <div className="tag_search_layout">
      <span>{tagName}</span>
      {tagKey}
      <button onClick={() => deleteTag()}>x</button>
    </div>
  );
}

export default FieldCard;
