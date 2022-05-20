import React from 'react';
import 'styles/UserCard.scss'

interface Iprops {
  name:string,
  rank:number,
  deleteHandler: Function
}

const UserCard = ({name, rank, deleteHandler} :Iprops) => {
  return (
    <div className="user_card">
      <div className="user_layer">
        <img src={`https://static.solved.ac/tier_small/${rank}.svg`} alt="rank"/>
        <h6>{name}</h6>
      </div>
      <button className="delete_user_card"
              onClick={() => deleteHandler(name)}
      >x</button>
    </div>
  );
}

export default UserCard;
