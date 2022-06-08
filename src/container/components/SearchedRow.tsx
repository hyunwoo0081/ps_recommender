import React from 'react';

interface Iprops {
  problem: any
}

const SearchedRow = ({problem} :Iprops) => {
  return (
    <tr>
      <td>
        <div>
          <img src={`https://static.solved.ac/tier_small/${problem.level}.svg`} alt={problem.level}/>
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
