import React, {useState} from 'react';
import UserSearchPopup from "./container/components/UserSearchPopup";
import UserCard from "container/components/UserCard";
import './App.scss';

interface UserInfo {
  name:string,
  rank:number
}

function App() {
  const [userInfo, setUserInfo] :[userName:Array<UserInfo>, setUserName:Function] = useState([]);
  const [isSearchPopupOpened, openUserSearch] = useState(false);
  const [tryNewField, setTryNewField] = useState(false);
  //`https://solved.ac/api/v3/user/show?handle=${name}`
  //`https://solved.ac/api/v3/tag/list`
  //`https://solved.ac/api/v3/user/problem_tag_stats?handle=${name}&sort=problemCount`

  function getUserCards() {
    let result = [];
    for (let info of userInfo) {
       result.push(<UserCard name={info.name} rank={info.rank} deleteHandler={deleteUser}/>);
    }
    return result;
  }

  function deleteUser(name :string) {
    setUserInfo(userInfo.filter((element) => {
      return element.name !== name;
    }));
  }

  function addUserAndClosePopup(name :string, rank :number) {
    setUserInfo([
      ...userInfo,
      {name: name, rank: rank}
    ]);
    openUserSearch(false);
  }

  function getFieldList(newField: boolean) {

    return "";
  }

  function getSolvedField() {

  }

  return (
    <div className="App">
      { isSearchPopupOpened ?
        <UserSearchPopup
          addUser={addUserAndClosePopup}
          canceled={() => openUserSearch(false)}
        />
        : null
      }

      <div className="app_layer">
        <h1>Solved.ac 문제 추천</h1>
        <h2>사용자 선택</h2>
        <div className="users_layout">
          {getUserCards()}

          <button className="add_user" onClick={
            () => openUserSearch(true)
          }>+</button>
        </div>

        {
          userInfo.length > 0 &&
          <div className="search_setting_layout">
            <h2>알고리즘 선택 기준</h2>
            <button onClick={() => setTryNewField(false)}>
                풀던 알고리즘 추천
            </button>
            <button onClick={() => setTryNewField(true)}>
                새로운 알고리즘 추천
            </button>
            <h2>주제 선택</h2>
            <ul>
              {getFieldList(tryNewField)}
            </ul>
          </div>
        }

        {
          <h2>추천 문제</h2>
        }

      </div>
    </div>
  );
}

export default App;
