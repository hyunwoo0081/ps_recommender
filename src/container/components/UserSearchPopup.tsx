import React, {useState} from 'react';
import UserSearchCard from "./UserSearchCard";
import 'container/styles/UserSearchPopup.scss';
import Fetch from "../controller/Fetch";

interface Iprops {
  addUser :Function
  canceled :Function
}

const UserSearchPopup = ({addUser, canceled} :Iprops) => {
  const [searchName, setSearchName] = useState("");
  const [userArray, setUserArray] = useState([]);

  function changeSearchName(e :any) {
    const name = e.target.value;
    setSearchName(name);

    if (!!name) {
      Fetch.getUserSuggestion(name, setUserArray);
    }
    else {
      setUserArray([]);
    }
  }

  function widgetsSearchedList() {
    const result = [];
    for (let user of userArray) {
      result.push(<UserSearchCard name={user["handle"]} rank={user["tier"]} handle={addUser} />);
    }
    return result;
  }

  return (
    <div className="user_search_popup">
      <div>
        <h1>닉네임 검색</h1>
        <div className="input_layer">
          <input id="user_search_input"
                 type="text"
                 autoComplete="off"
                 value={searchName}
                 placeholder="아이디를 입력하세요"
                 onChange={changeSearchName}/>
          <button onClick={() => canceled()}>X</button>
        </div>
        {widgetsSearchedList()}
      </div>
    </div>
  );
}

export default UserSearchPopup;
