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
    let range = LevelCalculator.getLevelRange(searchField, problemLevel);

    // make solved.ac query
    let query = "";
    for (let user of userInfo)
      query += "!%40"+user.name+"%26";
    for (let i in searchField)
      query += "%23"+tagName[i].key+"%26";
    query += "*"+range[0]+".."+range[1];

    Fetch.getRandomProblems100(query, (data: Array<any>) => {
      setProblemResult(data);
    });
  }

  //get Widgets
  function widgetsUserCards() {
    let result = [];
    for (let i in userInfo) {
      let info = userInfo[i];
      result.push(<UserCard user={info} userUpdated={userUpdated[i]} deleteHandler={deleteUser}/>);
    }

    return result;
  }

  function widgetsFieldCard() {
    let result = [];
    for (let i of searchField) {
      let tag = tagName[i];
      result.push(<FieldCard key={i} tag={tag} deleteTag={() => deleteSearchField(i)}/>);
    }
    return result;
  }

  function widgetsLevelButtons() {
    let result = [];
    const text = ["쉬움", "약간 쉬움", "보통", "약간 어려움", "어려움"];

    for (let i = 0; i < 5; i++) {
      result.push(<ToggleButton checked={problemLevel === i} title={text[i]}
                                onClick={() => changeProblemLevel(i)}/>);
    }
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

          {widgetsLevelButtons()}
          <LevelSeekbar handle={changeProblemLevel}/>
        </div>

        <button onClick={findProblems}>문제 찾기</button>

        <h2>추천 문제</h2>
        <SearchedList problemList={problemResult}/>

      </div>
    </div>
  );
}

export default App;
