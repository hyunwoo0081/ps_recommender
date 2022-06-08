import React, {useState} from 'react';

import NavigationBar from "container/components/NavigationBar";
import UserSearchBar from "container/components/UserSearchBar";
import TagSearchBar from "container/components/TagSearchBar";
import LevelSeekbar from "container/components/LevelSeekbar";
import UserCard from "container/components/UserCard";
import FieldCard from "container/components/FieldCard";
import ToggleButton from "container/components/ToggleButton";
import SearchedList from "./container/components/SearchedList";

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

  function findProblems() {
    LevelCalculator.analyzeUserData(userInfo);

    let searchArray: Array<number> = [];
    if (!tryNewField) {
      for (let i in tagCounts) {
        if (tagCounts[i] === userInfo.length)
          searchArray.push(parseInt(i));
      }
    }
    else
      searchArray = searchField;

    if (searchArray.length === 0) {
      setProblemResult([]);
      return
    }

    let ranges = LevelCalculator.getLevelRange(searchArray, problemLevel);

    // make solved.ac query
    let query = "(";
    for (let user of userInfo) {
      if (userInfo[0].name !== user.name)
        query += "%26";
      query += "!@"+user.name;

    }

    if (ranges.length > 20) {
      setProblemResult([]);
    }

    query += ")%26(";
    for (let item of ranges) {
      if (ranges[0].id !== item.id)
        query += "|";
      query += `%23${tagName[item.id].key}%26*${item.min}..${item.max}`;
    }
    query += ")";
    console.log(query);

    Fetch.getRandomProblems100(query, (data: Array<any>) => {
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

        <button onClick={findProblems}>문제 찾기</button>

        <h2>추천 문제</h2>
        <SearchedList problemList={problemResult}/>
      </div>
    </div>
  );
}

export default App;
