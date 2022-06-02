import React from 'react';

import XImg from "container/static/xw.png";

interface Iprops {
  user: {
    name: string
    rank: number
    solvedCount: number
    solvedField: Array<{ levelSum: number, count: number }>
  }
  userUpdated: boolean
  deleteHandler: Function
}

const UserCard = ({user, userUpdated, deleteHandler} :Iprops) => {
  const RankName = ["un", "br", "si", "go", "pl", "di", "ru", "ma"];
  const {name, rank, solvedCount} = user;

  return (
    <div className="user_card">
      <div className={`img_layer ${RankName[Math.floor((rank+4)/5)]}`}>
        { userUpdated &&
          <img src={`https://static.solved.ac/tier_small/${rank}.svg`} alt="rank"/>
        }
      </div>
      <div className="info_layer">
        <h5 onClick={() => window.open(`https://solved.ac/profile/${name}`)}>{name}</h5>
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
