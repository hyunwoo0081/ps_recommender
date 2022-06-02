import React from 'react';

import SearchBar from "./SearchBar";
import TagImg from "container/static/tag.png";

interface Iprops {
  tagList: Array<{ ko: string, key: string }>
  addTag: Function
}

const TagSearchBar = ({tagList, addTag} :Iprops) => {
  let searchedList = [0];

  function changeSearchTag(text: string, setSearched: Function) {
    //search engine
    let list: Array<number> = [];
    const regex = new RegExp(text);

    for (let i in tagList) {
      let tag = tagList[i];
      if (regex.test(tag.key) || regex.test(tag.ko))
        list.push(parseInt(i));
    }
    searchedList = list;

    // set Search Result
    let searched = [];
    for (let i = 0; i < Math.min(5, searchedList.length); i++) {
      let tag = tagList[searchedList[i]];
      searched.push({img: TagImg, title: tag.ko, subTitle: tag.key});
    }
    setSearched(searched);
  }

  function addHandle(index: number) {
    addTag(searchedList[index]);
  }

  return (
    <SearchBar src={TagImg}
               placeholder="태그를 입력하세요"
               searchHandle={changeSearchTag}
               addHandle={addHandle}/>
  );
}

export default TagSearchBar;
