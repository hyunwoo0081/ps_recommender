import React from 'react';
import 'container/styles/UserSearchCard.scss';
import Fetch from "../controller/Fetch";

interface Iprops {
  name:string,
  rank:number,
  handle:Function
}

const UserSearchCard = ({name, rank, handle} :Iprops) => {
  function delayedAddUser() {
    Fetch.getSolvedProblems(name, (data: object) => handle(name, rank, data));
  }

  return (
    <div className="user_search_card" onClick={delayedAddUser} >
      <img src={`https://static.solved.ac/tier_small/${rank}.svg`} alt="rank"/>
      <h6>{name}</h6>
    </div>
  );
}

export default UserSearchCard;
