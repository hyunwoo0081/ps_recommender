import React, {useState} from 'react';

import SearchCard from "./SearchCard";

interface Iprops {
  src: any
  placeholder: string
  searchHandle: Function,
  addHandle :Function
}

interface Isearch {
  img: any,
  title: string,
  subTitle: string,
  handle: Function,
}

const SearchBar = ({src, placeholder, searchHandle, addHandle} :Iprops) => {
  const [searchText, setSearchText]: [searchText: string, setSearchText: Function] = useState("");
  const [searched, setSearched]: [Isearch: Array<Isearch>, setSearched: Function] = useState([]);
  const [showList, setShowList]: [showList: boolean, setShowList: Function] = useState(false);

  function changedText(e :any) {
    const text = e.target.value;
    setSearchText(text);

    if (!!text) {
      searchHandle(text, setSearched);
      setShowList(true);
    }
    else {
      setSearched([]);
      setShowList(false);
    }
  }

  function selected(index: number) {
    setSearchText("");
    setSearched([]);
    setShowList(false);
    addHandle(index);
  }

  function widgetsSearchedList() {
    const result = [];
    for (let i in searched) {
      let item = searched[i];
      result.push(<SearchCard key={parseInt(i)}
                              index={parseInt(i)}
                              img={item.img}
                              title={item.title}
                              subTitle={item.subTitle}
                              handle={selected}/>);
    }
    return result;
  }

  // focus 꺼질 때 구현하기 (input만 타겟되서 목록 선택이 안됨)
  return (
    <div className="search_bar_layout"
         onFocus={() => setShowList(true)}>

      <div className="input_layer">
        <img src={src} alt=""/>
        <input id="user_search_input"
               type="text"
               autoComplete="off"
               value={searchText}
               placeholder={placeholder}
               onChange={changedText}/>
      </div>
      { searched.length > 0 && showList &&
          <div className="searched_layer">
            {widgetsSearchedList()}
          </div>
      }

    </div>
  );
}

export default SearchBar;
