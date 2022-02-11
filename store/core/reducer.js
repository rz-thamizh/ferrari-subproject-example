import ActionType from './types';
import { initialState } from './state';

export default function reducer(
  state = initialState,
  { type, payload },
) {
  switch (type) {
    case ActionType.LOADING:
      return {
        ...state,
        id: payload.id,
        loading: payload.loading,
      };
    case ActionType.SUCCESS:
      return {
        ...state,
        id: payload.id,
        success: payload.success,
      };
    case ActionType.ERROR:
      return {
        ...state,
        id: payload.id,
        error: payload.error,
      };
    case ActionType.USER_CONTEXT:
      return {
        ...state,
        ...payload,
      };
    default:
      return state;
  }
}
