import React from 'react';
import SearchedRow from "./SearchedRow";

interface Iprops {
  problemList: Array<any>
}

const SearchedList = ({problemList} :Iprops) => {
  function widgetsSearchedProblems() {
    let result = [];
    for (let problem of problemList)
      result.push(<SearchedRow key={problem.problemId} problem={problem}/>);

    return result;
  }

  return (
    <>
    { problemList.length === 0 ?
      <h4>조건을 만족하는 문제가 없습니다</h4>
      :
      <table>
        <tr>
          <th>#</th>
          <th>제목</th>
          <th>해결</th>
          <th>평균 시도</th>
        </tr>
        {widgetsSearchedProblems()}
      </table>
    }
    </>
  );
}


export default SearchedList;
