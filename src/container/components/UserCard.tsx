import React from 'react';

import XImg from "container/static/x.png";

interface Iprops {
  name: string
  rank: number
  solvedCount: number
  deleteHandler: Function
}

const UserCard = ({name, rank, solvedCount, deleteHandler} :Iprops) => {
  const RankName = ["un", "br", "si", "go", "pl", "da", "ru", "ma"];

  return (
    <div className="user_card">
      <div className={`img_layer ${RankName[Math.floor((rank+4)/5)]}`}>
        <img src={`https://static.solved.ac/tier_small/${rank}.svg`} alt="rank"/>
      </div>
      <div className="info_layer">
        <h5>{name}</h5>
        <h6>{`${solvedCount} solved`}</h6>
      </div>
      <button className="delete_user_card"
              onClick={() => deleteHandler(name)}>
        <img src={XImg} alt="x"/>
      </button>
    </div>
  );
}

export default UserCard;
