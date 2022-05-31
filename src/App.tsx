import React, {useState} from 'react';
import UserSearchPopup from "./container/components/UserSearchPopup";
import LevelSeekbar from "./container/components/LevelSeekbar";
import TagSearchView from "./container/components/TagSearchView";
import UserCard from "container/components/UserCard";
import FieldCard from "./container/components/FieldCard";
import './container/styles/App.scss';
import Fetch from "./container/controller/Fetch";
import LevelCalculator from "./container/controller/LevelCalculator";

interface UserInfo {
  name: string,
  rank: number,
  solvedField: Array<{ levelSum: number, count: number }>,
}

interface TagName {
  key: string,
  ko: string,
}

function App() {
  const [ProblemCounts, setProblemCounts]: [ProblemCounts: number, setProblemCounts: Function] = useState(192);
  const [userInfo, setUserInfo]: [userName: Array<UserInfo>, setUserName: Function] = useState([]);
  const [isSearchPopupOpened, openUserSearch] = useState(false);
  const [tryNewField, setTryNewField] = useState(false);
  const [tagCounts, setTagCounts]: [tagCounts: Array<number>, setTagCounts: Function] = useState([]);
  const [tagName, setTagName]: [tagName: Array<TagName>, setTagName: Function] = useState([]);
  const [tagToIndex, setTagToIndex]: [tagToIndex: any, setTagToIndex: Function] = useState({});
  // search params
  const [problemLevel, setProblemLevel]: [problemLevel: number, setProblemLevel: Function] = useState(2);
  const [searchField, setSearchField]: [searchField: Array<number>, setSearchField: Function] = useState([]);

  //`https://solved.ac/api/v3/user/show?handle=${name}`
  //`https://solved.ac/api/v3/tag/list`
  //`https://solved.ac/api/v3/user/problem_tag_stats?handle=${name}&sort=problemCount`
  //`https://solved.ac/api/v3/search/problem?query=@${name}&sort=level&direction=desc`
  function init() {
    if (tagName.length === 0) {
      Fetch.getTagsList((data: any) => {
        let pCount;
        setProblemCounts(pCount = data.length);

        let names = [];
        let indexes = {};

        for (let i = 0; i < pCount; i++) {
          let item = data[i];
          let key = item.tag.key;
          let ko = item.tag.displayNames[0].name;
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

  function addUserAndClosePopup(name: string, rank: number, solvedData: any[]) {
    openUserSearch(false);
    if (userInfo.some((x) => x.name === name)) return;

    let solvedArr = Array.from({length: ProblemCounts}, () => {return {"levelSum": 0, "count": 0}});

    for (let item of solvedData) {
      for (let tag of item.tags) {
        let tagId = tagToIndex[tag.key];

        if (solvedArr[tagId].count === 0)
          tagCounts[tagId]++;

        if (solvedArr[tagId].count < 30) {
          solvedArr[tagId].count++;
          solvedArr[tagId].levelSum += item.level;
        }
      }
    }
    console.log(tagCounts);
    setTagCounts(tagCounts);

    setUserInfo([
      ...userInfo,
      {name: name, rank: rank, solvedField: solvedArr}
    ]);
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
    let result = LevelCalculator.getLevelRange(searchField, problemLevel);

    console.log(result);
    //range 받고, 문제 추적하기...
  }

  //get Widgets
  function widgetsUserCards() {
    let result = [];
    for (let info of userInfo)
      result.push(<UserCard name={info.name} rank={info.rank} deleteHandler={deleteUser}/>);

    return result;
  }

  function widgetsLevelButtons() {
    let result = [];
    const text = ["쉬움", "약간 쉬움", "보통", "약간 어려움", "어려움"];

    for (let i = 0; i < 5; i++) {
      result.push(<button className={problemLevel === i ? "toggle_button selected" : "toggle_button"}
                          onClick={() => changeProblemLevel(i)}>{text[i]}</button>);
    }
    return result;
  }

  function widgetsFieldCard() {
    let result = [];
    for (let i of searchField) {
      let tag = tagName[i];
      result.push(<FieldCard key={i} tagName={tag.ko} tagKey={tag.key} deleteTag={() => deleteSearchField(i)}/>);
    }
    return result;
  }

  return (
    <div className="App">
      {isSearchPopupOpened &&
          <UserSearchPopup
              addUser={addUserAndClosePopup}
              canceled={() => openUserSearch(false)}
          />
      }

      <div className="app_layer">
        <h1>Solved.ac 문제 추천</h1>
        <h2>사용자 입력</h2>
        <div className="users_layout">
          {widgetsUserCards()}

          <button className="add_user"
                  onClick={() => openUserSearch(true)}>
          +</button>
        </div>

        <div className="search_setting_layout">
          <h2>알고리즘 선택 기준</h2>
          <button className={tryNewField ? "toggle_button" : "toggle_button selected"}
                  onClick={() => setTryNewField(false)}>
            풀 수 있는 문제 랜덤
          </button>
          <button className={tryNewField ? "toggle_button selected" : "toggle_button"}
                  onClick={() => setTryNewField(true)}>
            주제 선택 후 랜덤
          </button>
          {tryNewField &&
              <>
                <h2>주제 선택</h2>
                <TagSearchView tagList={tagName} addTag={addSearchField}/>
                {widgetsFieldCard()}
              </>
          }

          <h2>난이도 선택</h2>
          {widgetsLevelButtons()}
          { ProblemCounts === 0 &&
            <LevelSeekbar handle={changeProblemLevel}/>
          }
        </div>

        <button onClick={findProblems}>문제 찾기</button>

        {
          <h2>추천 문제</h2>
        }

      </div>
    </div>
  );
}

export default App;
