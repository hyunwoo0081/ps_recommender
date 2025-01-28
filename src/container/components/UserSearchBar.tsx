import React from 'react';

import SearchBar from "./SearchBar";
import Fetch from "container/controller/Fetch";

interface Iprops {
  addUserFrame: Function
}

const UserSearchBar = ({addUserFrame}: Iprops) => {
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
    let user = userList[index];
    let userFrame = addUserFrame(user.handle, user.tier, user.solvedCount);
    if (userFrame == null) return;

    let [userObj, tagCounts, setTagCounts, tagToIndex, updateUserList] = userFrame;

    Fetch.getSolvedProblems(user.handle, (data: Array<any>) => {
      let userSolvedList = userObj.solvedField;

      for (let item of data) {
        for (let tag of item.tags) {
          let tagId = tagToIndex[tag.key];

          if (userSolvedList[tagId].count === 0)
            tagCounts[tagId]++;

          if (userSolvedList[tagId].count < 30) {
            userSolvedList[tagId].count++;
            userSolvedList[tagId].levelSum += item.level;
          }
        }
      }
      setTagCounts(tagCounts);
    }, updateUserList);
  }

  return (
    <SearchBar src="/name.png" placeholder={"사용자를 입력하세요"} searchHandle={changeSearchName} addHandle={addHandle}/>
  );
}

export default UserSearchBar;
