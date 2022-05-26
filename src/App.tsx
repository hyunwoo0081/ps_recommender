import React, {useState} from 'react';
import UserSearchPopup from "./container/components/UserSearchPopup";
import UserCard from "container/components/UserCard";
import './styles/App.scss';
import LevelSeekbar from "./container/components/LevelSeekbar";

interface UserInfo {
  name: string,
  rank: number,
  solvedField: number[],
}

interface TagName {
  key: string,
  ko: string,
}

function App() {
  const [userInfo, setUserInfo]: [userName: Array<UserInfo>, setUserName: Function] = useState([]);
  const [isSearchPopupOpened, openUserSearch] = useState(false);
  const [tryNewField, setTryNewField] = useState(false);
  const [tagCounts, setTagCounts]: [tagCounts: Array<number>, setTagCounts: Function] = useState([]);
  const [tagName, setTagName]: [tagName: Array<TagName>, setTagName: Function] = useState([]);

  //`https://solved.ac/api/v3/user/show?handle=${name}`
  //`https://solved.ac/api/v3/tag/list`
  //`https://solved.ac/api/v3/user/problem_tag_stats?handle=${name}&sort=problemCount`

  function addUserAndClosePopup(name: string, rank: number, solvedData: any[]) {
    let solvedCounts = [];

    if (tagName.length === 0) {
      for (let item of solvedData) {
        tagName.push({"key": item.tag.key, "ko": item.tag.displayNames[0].name});
        tagCounts.push(0);
      }
      setTagName(tagName);
    }

    for (let key in solvedData) {
      solvedCounts.push(solvedData[key].solved);
      if (solvedCounts[key] > 0) tagCounts[key]++;
    }
    setTagCounts(tagCounts);

    setUserInfo([
      ...userInfo,
      {name: name, rank: rank, solvedField: solvedCounts}
    ]);
    openUserSearch(false);
  }

  function deleteUser(name: string) {
    let userData = userInfo.find(element => element.name === name);
    if (userData === undefined) return;

    for (let key in userData.solvedField) {
      if (userData.solvedField[key] > 0)
        tagCounts[key]--;
    }
    setTagCounts(tagCounts);

    setUserInfo(userInfo.filter(element => element.name !== name));
  }

  function widgetsUserCards() {
    let result = [];
    for (let info of userInfo)
      result.push(<UserCard name={info.name} rank={info.rank} deleteHandler={deleteUser}/>);

    return result;
  }

  function widgetsFieldList(newField: boolean) {
    if (userInfo.length === 0) return null;

    let result = [];
    for (let key in tagName)
      if (tagCounts[key] === userInfo.length)
        result.push(<li>{tagName[key].ko}</li>);

    return result;
  }

  function setLevels() {

    return "";
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
                  onClick={ () => openUserSearch(true) }>
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
                <ul>
                  {widgetsFieldList(tryNewField)}
                </ul>
              </>
          }

          <h2>난이도 선택</h2>
          <LevelSeekbar handle={setLevels}/>
        </div>

        {
          <h2>추천 문제</h2>
        }

      </div>
    </div>
  );
}

export default App;
