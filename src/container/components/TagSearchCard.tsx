import React from 'react';

interface Iprops {
  tagName: string,
  tagKey: string,
  addTag: Function,
}

const TagSearchCard = ({tagName, tagKey, addTag} :Iprops) => {
  return (
    <li className="tag_search_card" onClick={() => addTag(tagName)}>
      <span>{tagName}</span>
      {tagKey}
    </li>
  );
}

export default TagSearchCard;
