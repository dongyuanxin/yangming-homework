import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  HOME_COUNT_SERVICE_BEGIN,
  HOME_COUNT_SERVICE_SUCCESS,
  HOME_COUNT_SERVICE_FAILURE,
  HOME_COUNT_SERVICE_DISMISS_ERROR,
} from '../../../../src/features/home/redux/constants';

import {
  countService,
  dismissCountServiceError,
  reducer,
} from '../../../../src/features/home/redux/countService';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/countService', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when countService succeeds', () => {
    const store = mockStore({});

    return store.dispatch(countService())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_COUNT_SERVICE_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_COUNT_SERVICE_SUCCESS);
      });
  });

  it('dispatches failure action when countService fails', () => {
    const store = mockStore({});

    return store.dispatch(countService({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_COUNT_SERVICE_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_COUNT_SERVICE_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissCountServiceError', () => {
    const expectedAction = {
      type: HOME_COUNT_SERVICE_DISMISS_ERROR,
    };
    expect(dismissCountServiceError()).toEqual(expectedAction);
  });

  it('handles action type HOME_COUNT_SERVICE_BEGIN correctly', () => {
    const prevState = { countServicePending: false };
    const state = reducer(
      prevState,
      { type: HOME_COUNT_SERVICE_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.countServicePending).toBe(true);
  });

  it('handles action type HOME_COUNT_SERVICE_SUCCESS correctly', () => {
    const prevState = { countServicePending: true };
    const state = reducer(
      prevState,
      { type: HOME_COUNT_SERVICE_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.countServicePending).toBe(false);
  });

  it('handles action type HOME_COUNT_SERVICE_FAILURE correctly', () => {
    const prevState = { countServicePending: true };
    const state = reducer(
      prevState,
      { type: HOME_COUNT_SERVICE_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.countServicePending).toBe(false);
    expect(state.countServiceError).toEqual(expect.anything());
  });

  it('handles action type HOME_COUNT_SERVICE_DISMISS_ERROR correctly', () => {
    const prevState = { countServiceError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_COUNT_SERVICE_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.countServiceError).toBe(null);
  });
});

