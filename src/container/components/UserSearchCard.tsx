import React from 'react';
import 'styles/UserSearchCard.scss';

interface Iprops {
  name:string,
  rank:number,
  handle:Function
}

const UserSearchCard = ({name, rank, handle} :Iprops) => {
  return (
    <div className="user_search_card" onClick={() => handle(name, rank)} >
      <img src={`https://static.solved.ac/tier_small/${rank}.svg`} alt="rank"/>
      <h6>{name}</h6>
    </div>
  );
}

export default UserSearchCard;
