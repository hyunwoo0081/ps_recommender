import React from 'react';

import SearchBar from "./SearchBar";
import NameImg from "../static/name.png";
import Fetch from "../controller/Fetch";

interface Iprops {
  addUserData :Function
}

const UserSearchBar = ({addUserData} :Iprops) => {
  let userList: Array<any> = [];

  function changeSearchName(name: string, setSearched: Function) {
    Fetch.getUserSuggestion(name, (data: Array<any>) => {
      let result = [];
      for (let user of data) {
        result.push({img: `https://static.solved.ac/tier_small/${user.tier}.svg`,
                    title: user.handle, subTitle: ""});
      }
      setSearched(result);
      userList = data;
    });
  }

  function addHandle(index: number) {
    let name = userList[index].handle;
    let rank = userList[index].tier;
    let solvedCount = userList[index].solvedCount;
    Fetch.getSolvedProblems(name, (data: object) => addUserData(name, rank, solvedCount, data));
  }

  return (
    <SearchBar src={NameImg} placeholder={"사용자를 입력하세요"} searchHandle={changeSearchName} addHandle={addHandle}/>
  );
}

export default UserSearchBar;
