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

    // calculate user mean
    for (let user of userInfo) {
      let means = [];
      for (let info of user.solvedField) {
        means.push(info.count > 0 ? info.levelSum/info.count : 0);
      }
      userMeans.push(means);
    }

    // calculate field mean stdDiv
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

    for (let id of tagIds) {
      let min = Math.floor(this.mean[id])+problemLevel-1;
      let max = Math.ceil(this.mean[id])+problemLevel-1;
      min = Math.min(Math.max(1, min), 30);
      max = Math.min(Math.max(1, max), 30);
      result.push({id: id, min: min, max: max});
    }
    return result;
  }
}

export default LevelCalculator;