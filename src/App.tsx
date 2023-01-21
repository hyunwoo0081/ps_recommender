import React, {ChangeEvent, useEffect, useState} from 'react';

import NavigationBar from "container/components/NavigationBar";
import UserSearchBar from "container/components/UserSearchBar";
import TagSearchBar from "container/components/TagSearchBar";
import LevelSeekbar from "container/components/LevelSeekbar";
import UserCard from "container/components/UserCard";
import FieldCard from "container/components/FieldCard";
import ToggleButton from "container/components/ToggleButton";
import SearchedList from "./container/components/SearchedList";
import Footer from "./container/components/Footer";

import Fetch from "container/controller/Fetch";
import LevelCalculator from "container/controller/LevelCalculator";

import 'container/styles/App.scss';
import 'container/styles/Widgets.scss'

interface UserInfo {
  name: string
  rank: number
  solvedCount: number
  solvedField: Array<{ levelSum: number, count: number }>
}

interface TagName {
  key: string
  ko: string
}

function App() {
  const [ProblemCounts, setProblemCounts]: [ProblemCounts: number, setProblemCounts: Function] = useState(192);
  const [userInfo, setUserInfo]: [userName: Array<UserInfo>, setUserName: Function] = useState([]);
  const [userUpdated, setUserUpdated]: [userUpdated: Array<boolean>, setUserUpdated: Function] = useState([]);
  const [tryNewField, setTryNewField] = useState(false);
  const [tagCounts, setTagCounts]: [tagCounts: Array<number>, setTagCounts: Function] = useState([]);
  const [tagName, setTagName]: [tagName: Array<TagName>, setTagName: Function] = useState([]);
  const [tagToIndex, setTagToIndex]: [tagToIndex: any, setTagToIndex: Function] = useState({});
  // search params
  const [problemLevel, setProblemLevel]: [problemLevel: number, setProblemLevel: Function] = useState(2);
  const [searchField, setSearchField]: [searchField: Array<number>, setSearchField: Function] = useState([]);
  const [problemResult, setProblemResult]: [problemResult: Array<any>, setProblemResult: Function] = useState([]);
  const [searchInfoChanged, setChanged] = useState(true);
  const [cacheSearchArray, setCacheSearchArray]: [Array<number>, Function] = useState([]);
  const [cacheSearchRanges, setCacheSearchRanges]: [Array<any>, Function] = useState([]);
  const [cacheUserQuery, setCacheUserQuery]: [string, Function] = useState("");

  // user setting params
  const [showLevel, setShowLevel]: [showLevel: boolean, setShowLevel: Function] = useState(true);


  //`https://solved.ac/api/v3/user/show?handle=${name}`
  function init() {
    if (tagName.length === 0) {
      Fetch.getTagsList((data: any) => {
        let pCount;
        setProblemCounts(pCount = data.length);

        let names = [];
        let indexes = {};

        for (let i = 0; i < pCount; i++) {
          let item = data[i];
          let key = item.key;
          let ko = item.displayNames[0].name;
          names.push({"key": key, "ko": ko});
          indexes = { ...indexes, [key]: i };
        }
        setTagCounts(Array.from({length: pCount}, () => 0))
        setTagName(names);
        setTagToIndex(indexes);
      });
    }
  }
  init();

  function addUserFrame(name: string, rank: number, solvedCount: number) {
    if (userInfo.some((x) => x.name === name))
      return null;

    let solvedArr = Array.from({length: ProblemCounts}, () => ({ levelSum: 0, count: 0 }));
    let userObj = {name: name, rank: rank, solvedCount: solvedCount, solvedField: solvedArr};

    setUserInfo([...userInfo, userObj]);
    setUserUpdated([...userUpdated, false]);

    return [userObj, tagCounts, setTagCounts, tagToIndex, () => setUserUpdated([...userUpdated, true])];
  }

  function deleteUser(name: string) {
    let userData = userInfo.find(element => element.name === name);
    if (userData === undefined) return;

    for (let key in userData.solvedField) {
      if (userData.solvedField[key].count > 0)
        tagCounts[key]--;
    }
    setTagCounts(tagCounts);

    setUserInfo(userInfo.filter(element => element.name !== name));
  }

  function addSearchField(tagId: number) {
    setSearchField(Array.from(new Set([...searchField, tagId])));
  }

  function deleteSearchField(tagId: number) {
    setSearchField(searchField.filter(element => element !== tagId));
  }

  function changeProblemLevel(level: number) {
    setProblemLevel(level);
  }

  useEffect(() => { setChanged(true); }, [userUpdated, tryNewField, problemLevel, searchField]);

  function findProblems() {
    let searchArray, searchRanges, userQuery;
    if (searchInfoChanged) {
      LevelCalculator.analyzeUserData(userInfo);

      if (tryNewField) {
        searchArray = searchField;

        let ranges = LevelCalculator.getLevelRange(searchArray, problemLevel);
        searchRanges = [{id: -1, min:30, max:1}];
        for (let level of ranges) {
          searchRanges[0].min = Math.min(searchRanges[0].min, level.min);
          searchRanges[0].max = Math.max(searchRanges[0].max, level.max);
        }
      }
      else {
        searchArray = [];
        for (let i in tagCounts) {
          if (tagCounts[i] === userInfo.length)
            searchArray.push(parseInt(i));
        }

        searchRanges = LevelCalculator.getLevelRange(searchArray, problemLevel);
      }

      //make user query
      userQuery = "(";
      for (let user of userInfo) {
        if (user.name !== userInfo[0].name)
          userQuery += "%26";
        userQuery += "!@"+user.name;
      }

      setCacheSearchArray(searchArray);
      setCacheSearchRanges(searchRanges);
      setCacheUserQuery(userQuery);
      setChanged(false);
    }
    else {
      searchArray = cacheSearchArray;
      searchRanges = cacheSearchRanges;
      userQuery = cacheUserQuery;
    }

    if (searchArray.length === 0) {
      setProblemResult([]);
      return
    }

    // make solved.ac query
    let query = userQuery + ")%26(";

    if (tryNewField) {
      for (let item of searchArray)
        query += `%23${tagName[item].key}%26`;
      query += `*${searchRanges[0].min}..${searchRanges[0].max})`;
    }
    else {
      let randIndex = Math.floor(Math.random() * searchArray.length);

      const tag = tagName[searchArray[randIndex]].key;
      const range = searchRanges[randIndex];
      query += `%23${tag}%26*${range.min}..${range.max})`;
    }

    Fetch.getRandomProblems100(query, (data: Array<any>) => {
      // 못푸는 알고리즘 제거 기능 추가 바람
      setProblemResult(data);
    });
  }

  //get Widgets
  function widgetsUserCards() {
    let result = [];
    for (let i in userInfo)
      result.push(<UserCard key={i}
                            user={userInfo[i]}
                            userUpdated={userUpdated[i]}
                            deleteHandler={deleteUser}/>);
    return result;
  }

  function widgetsFieldCard() {
    let result = [];
    for (let i of searchField)
      result.push(<FieldCard key={i}
                             tag={tagName[i]}
                             deleteTag={() => deleteSearchField(i)}/>);
    return result;
  }

  // user setting functions
  function onChangeShowLevel(e: ChangeEvent<HTMLInputElement>) {
    const checked: boolean = e.target.checked

    setShowLevel(checked);
  }

  return (
    <div className="App">
      <NavigationBar/>

      <div className="app_layer">
        <h2>문제 검색</h2>

        <UserSearchBar addUserFrame={addUserFrame}/>

        <div className="users_layout">
          {widgetsUserCards()}
        </div>

        <div className="search_setting_layout">
          <div>
            <ToggleButton checked={!tryNewField} title="풀 수 있는 태그"
                          onClick={() => setTryNewField(false)}/>
            <ToggleButton checked={tryNewField} title="태그 선택"
                          onClick={() => setTryNewField(true)}/>

            { tryNewField &&
                <div className="tag_list_layout">
                  <TagSearchBar tagList={tagName} addTag={addSearchField}/>
                  <div className="tag_list">
                    {widgetsFieldCard()}
                  </div>
                </div>
            }
          </div>

          <LevelSeekbar value={problemLevel} handle={changeProblemLevel}/>
        </div>
        <div>
          <label>
            <input type='checkbox' checked={showLevel} onChange={onChangeShowLevel}/>
            문제 난이도 보이기
          </label>
        </div>
        <button onClick={findProblems}>문제 찾기</button>

        <h2>추천 문제</h2>
        <SearchedList problemList={problemResult} showLevel={showLevel}/>
      </div>

      <Footer/>
    </div>
  );
}

export default App;
