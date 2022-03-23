type historyType = {
  navigate: any;
  push: (page: string, ...rest: any) => any;
};

const history: historyType = {
  navigate: null,
  push: (page: string, ...rest: any) =>
    history.navigate ? history.navigate(page, ...rest) : null,
};

export default history;
