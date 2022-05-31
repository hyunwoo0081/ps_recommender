interface UserInfo {
  name: string,
  rank: number,
  solvedField: Array<{ levelSum: number, count: number }>,
}

const LevelCalculator = {
  mean: [0],
  stdDev: [0],
  analyzeUserData(userInfo: Array<UserInfo>) {
    let userMeans = [];
    if (userInfo.length === 0) return;

    // 각 유저마다 분야별 평균 구하기
    for (let user of userInfo) {
      let means = [];
      for (let info of user.solvedField) {
        means.push(info.count > 0 ? info.levelSum/info.count : 0);
      }
      userMeans.push(means);
    }

    // 분야 별 평균과 표준편차 구하기
    let mean = Array.from({length: userMeans[0].length}, () => 0);
    let stdDev = Array.from({length: userMeans[0].length}, () => 0);

    for (let tagId in userMeans[0]) {
      for (let user in userMeans) {
        mean[tagId] += userMeans[user][tagId];
      }
      mean[tagId] /= userInfo.length;

      for (let user in userMeans) {
        stdDev[tagId] += Math.pow(userMeans[user][tagId] - mean[tagId], 2);
      }
      stdDev[tagId] = Math.sqrt(stdDev[tagId] / userInfo.length);
    }

    this.mean = mean;
    this.stdDev = stdDev;
  },
  getLevelRange(tagIds: Array<number>, problemLevel: number) {
    let result = [];
    // 일단 평균에서 +- 해서 내보내자
    for (let id of tagIds) {
      let range = [Math.floor(this.mean[id])+problemLevel-2, Math.ceil(this.mean[id])+problemLevel-2];
      range[0] = Math.max(0, range[0]);
      range[1] = Math.max(0, range[1]);
      result.push(range);
    }
    return result;
  }
}

export default LevelCalculator;