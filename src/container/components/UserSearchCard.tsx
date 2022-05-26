import React from 'react';
import 'styles/UserSearchCard.scss';

interface Iprops {
  name:string,
  rank:number,
  handle:Function
}

const UserSearchCard = ({name, rank, handle} :Iprops) => {
  function delayedAddUser() {
    fetch(`https://solved.ac/api/v3/user/problem_tag_stats?handle=${name}&sort=problemCount`)
      .then((response) => response.json())
      .then((data) => {
        handle(name, rank, data.items);
      });
  }

  return (
    <div className="user_search_card" onClick={delayedAddUser} >
      <img src={`https://static.solved.ac/tier_small/${rank}.svg`} alt="rank"/>
      <h6>{name}</h6>
    </div>
  );
}

export default UserSearchCard;
