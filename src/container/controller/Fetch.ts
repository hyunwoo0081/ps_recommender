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
  getSolvedProblems(name: string, handle: Function) {
    this.getAllProblems(`@${name}&sort=level&direction=desc`, [], 1, handle);
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
  getAllProblems(query: string, list: Array<any>, page: number, handle: Function) {
    fetch(`https://solved.ac/api/v3/search/problem?query=${query}&page=${page}`)
      .then((response) => response.json())
      .then((data) => {
        if(page < data.count / 100)
          this.getAllProblems(query, [...list, ...data.items], page+1, handle);
        else
          handle([...list, ...data.items]);
      });
  }
};

export default Fetch;