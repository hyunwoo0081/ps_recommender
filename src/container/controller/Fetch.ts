const Fetch = {
  getUserSuggestion(name: string, handle: Function) {
    fetch(`https://solved.ac/api/v3/search/suggestion?query=${name}`)
      .then((response) => response.json())
      .then((data) => handle(data["users"]));
  },
  getTagsList(handle: Function) {
    fetch(`https://solved.ac/api/v3/tag/list`)
      .then((response) => response.json())
      .then((data) => {
        handle(data.items);
      });
  },
  getSolvedProblems(name: string, updateFunc: Function, finishFunc: Function) {
    this.getAllProblems(`@${name}&sort=level&direction=desc`, 1, updateFunc, finishFunc);
  },
  getRandomProblems100(query: string, handle: Function) {
    query = `https://solved.ac/api/v3/search/problem?query=${query}&page=1&sort=random&direction=asc`;
    console.log(query);
    fetch(query)
      .then((response) => response.json())
      .then((data) => {
        handle(data.items);
      });
  },
  getAllProblems(query: string, page: number, updateFunc: Function, finishFunc: Function) {
    fetch(`https://solved.ac/api/v3/search/problem?query=${query}&page=${page}`)
      .then((response) => response.json())
      .then((data) => {
        updateFunc(data.items);

        if(page < data.count / 100)
          this.getAllProblems(query, page+1, updateFunc, finishFunc);
        else
          finishFunc();
      });
  }
};

export default Fetch;