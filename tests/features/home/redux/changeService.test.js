import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  HOME_CHANGE_SERVICE_BEGIN,
  HOME_CHANGE_SERVICE_SUCCESS,
  HOME_CHANGE_SERVICE_FAILURE,
  HOME_CHANGE_SERVICE_DISMISS_ERROR,
} from '../../../../src/features/home/redux/constants';

import {
  changeService,
  dismissChangeServiceError,
  reducer,
} from '../../../../src/features/home/redux/changeService';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/changeService', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when changeService succeeds', () => {
    const store = mockStore({});

    return store.dispatch(changeService())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_CHANGE_SERVICE_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_CHANGE_SERVICE_SUCCESS);
      });
  });

  it('dispatches failure action when changeService fails', () => {
    const store = mockStore({});

    return store.dispatch(changeService({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_CHANGE_SERVICE_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_CHANGE_SERVICE_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissChangeServiceError', () => {
    const expectedAction = {
      type: HOME_CHANGE_SERVICE_DISMISS_ERROR,
    };
    expect(dismissChangeServiceError()).toEqual(expectedAction);
  });

  it('handles action type HOME_CHANGE_SERVICE_BEGIN correctly', () => {
    const prevState = { changeServicePending: false };
    const state = reducer(
      prevState,
      { type: HOME_CHANGE_SERVICE_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.changeServicePending).toBe(true);
  });

  it('handles action type HOME_CHANGE_SERVICE_SUCCESS correctly', () => {
    const prevState = { changeServicePending: true };
    const state = reducer(
      prevState,
      { type: HOME_CHANGE_SERVICE_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.changeServicePending).toBe(false);
  });

  it('handles action type HOME_CHANGE_SERVICE_FAILURE correctly', () => {
    const prevState = { changeServicePending: true };
    const state = reducer(
      prevState,
      { type: HOME_CHANGE_SERVICE_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.changeServicePending).toBe(false);
    expect(state.changeServiceError).toEqual(expect.anything());
  });

  it('handles action type HOME_CHANGE_SERVICE_DISMISS_ERROR correctly', () => {
    const prevState = { changeServiceError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_CHANGE_SERVICE_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.changeServiceError).toBe(null);
  });
});

