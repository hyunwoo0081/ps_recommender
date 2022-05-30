const Fetch = {
  getUserSuggestion(name: string, handle: Function) {
    fetch(`https://solved.ac/api/v3/search/suggestion?query=${name}`)
      .then((response) => response.json())
      .then((data) => handle(data["users"]));
  },
  getTagsList(handle: Function) {
    fetch(`https://solved.ac/api/v3/user/problem_tag_stats?handle=none&sort=problemCount`)
      .then((response) => response.json())
      .then((data) => {
        handle(data.items);
      });
  },
  getSolvedProblems(name: string, handle: Function) {
    fetch(`https://solved.ac/api/v3/search/problem?query=@${name}&sort=level&direction=desc`)
      .then((response) => response.json())
      .then((data) => {
        handle(data.items);
      });
  }
};

export default Fetch;