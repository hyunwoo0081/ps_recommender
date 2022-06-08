import React from 'react';

interface Iprops {
  index: number,
  img: any,
  title: string,
  subTitle: string,
  handle: Function,
}

const SearchCard = ({index, img, title, subTitle, handle} :Iprops) => {
  return (
    <div className="search_card_layout" onClick={() => handle(index)} >
      <img src={img} alt={`${index}`}/>
      <div className="search_card_title_layout">
        <h5>{title}</h5>
        <h6>{subTitle}</h6>
      </div>
    </div>
  );
}

export default SearchCard;
