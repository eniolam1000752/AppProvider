import React from 'react';

const initState = {
  error: {},
  shouldPersist: true,
  saveAsList: '{}',
  baseUrl: '',
  __shouldRender__: false,
};

const useController = (initData) => {
  const [state, dispatch] = React.useReducer(
    (state, value) => ({...state, ...value}),
    {...initData, ...initState},
  );

  return {dispatch, state};
};

export {useController};
