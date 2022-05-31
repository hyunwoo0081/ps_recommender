import React, {useState} from 'react';
import TagSearchCard from "./TagSearchCard";

interface Iprops {
  tagList: Array<{ ko: string, key: string }>
  addTag:Function
}

const TagSearchView = ({tagList, addTag} :Iprops) => {
  const [searchText, setSearchText]: [searchText: string, setSearchText: Function] = useState("");
  const [searchedList, setSearchedList]: [searchedList: Array<number>, setSearchedList: Function]
    = useState(Array.from({length: tagList.length}, (v, i) => i));

  function changeSearchInput(e: any) {
    let text = e.target.value;
    let isTextAppended = text.length - searchText.length > 0;
    setSearchText(text);

    //search engine
    let list = [];
    const regex = new RegExp(text);
    if (isTextAppended) {
      for (let i of searchedList) {
        let tag = tagList[i];
        if (regex.test(tag.key) || regex.test(tag.ko))
          list.push(i);
      }
    }
    else {
      for (let i in tagList) {
        let tag = tagList[i];
        if (regex.test(tag.key) || regex.test(tag.ko))
          list.push(i);
      }
    }
    setSearchedList(list);
  }

  function tagSelected(tagId: number) {
    setSearchText("");
    addTag(tagId);
  }

  function widgetsSearched() {
    let result = [];
    if (searchText.length === 0) return null;

    for (let i of searchedList.slice(0, 5)) {
      let tag = tagList[i];
      result.push(<TagSearchCard key={i} tagName={tag.ko} tagKey={tag.key} addTag={() => tagSelected(i)}/>)
    }
    return result;
  }

  return (
    <div className="tag_search_layout">
      <input type="text"
             autoComplete="off"
             placeholder="태그를 입력하세요"
             value={searchText}
             onChange={changeSearchInput}/>

      <ul className="tag_search_searched">
        {widgetsSearched()}
      </ul>

    </div>
  );
}

export default TagSearchView;
