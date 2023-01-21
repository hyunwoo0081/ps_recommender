import React from 'react';

interface Iprops {
  problem: any
  showLevel: boolean
}

const SearchedRow = ({problem, showLevel} :Iprops) => {
  return (
    <tr>
      <td>
        <div>
          {showLevel ?
            <img src={`https://static.solved.ac/tier_small/${problem.level}.svg`} alt={problem.level}/>
            : null
          }
          <a href={`https://www.acmicpc.net/problem/${problem.problemId}`} target="_blank" rel="noreferrer">
            {problem.problemId}</a>
        </div>
      </td>
      <td>
        <div>
          <a href={`https://www.acmicpc.net/problem/${problem.problemId}`} target="_blank" rel="noreferrer">
            {problem.titleKo}</a>
          { problem.isLevelLocked &&
            <div className="searched_standard">STANDARD</div>
          }
        </div>
      </td>
      <td>{problem.acceptedUserCount}</td>
      <td>{problem.averageTries}</td>
    </tr>
  );
}

export default SearchedRow;
