import ActionType from './types';

export const setError = (error, id) => (dispatch) => dispatch({
  type: ActionType.ERROR,
  payload: { id, error },
});

export const setSuccess = (success, id) => (dispatch) => dispatch({
  type: ActionType.SUCCESS,
  payload: { id, success },
});

export const setLoading = (loading, id) => (dispatch) => dispatch({
  type: ActionType.LOADING,
  payload: { id, loading },
});

export const updateUser = (context) => (dispatch) => dispatch({
  type: ActionType.USER_CONTEXT,
  payload: context,
});
