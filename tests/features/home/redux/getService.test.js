import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  HOME_GET_SERVICE_BEGIN,
  HOME_GET_SERVICE_SUCCESS,
  HOME_GET_SERVICE_FAILURE,
  HOME_GET_SERVICE_DISMISS_ERROR,
} from '../../../../src/features/home/redux/constants';

import {
  getService,
  dismissGetServiceError,
  reducer,
} from '../../../../src/features/home/redux/getService';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/getService', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when getService succeeds', () => {
    const store = mockStore({});

    return store.dispatch(getService())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_GET_SERVICE_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_GET_SERVICE_SUCCESS);
      });
  });

  it('dispatches failure action when getService fails', () => {
    const store = mockStore({});

    return store.dispatch(getService({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_GET_SERVICE_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_GET_SERVICE_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissGetServiceError', () => {
    const expectedAction = {
      type: HOME_GET_SERVICE_DISMISS_ERROR,
    };
    expect(dismissGetServiceError()).toEqual(expectedAction);
  });

  it('handles action type HOME_GET_SERVICE_BEGIN correctly', () => {
    const prevState = { getServicePending: false };
    const state = reducer(
      prevState,
      { type: HOME_GET_SERVICE_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getServicePending).toBe(true);
  });

  it('handles action type HOME_GET_SERVICE_SUCCESS correctly', () => {
    const prevState = { getServicePending: true };
    const state = reducer(
      prevState,
      { type: HOME_GET_SERVICE_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getServicePending).toBe(false);
  });

  it('handles action type HOME_GET_SERVICE_FAILURE correctly', () => {
    const prevState = { getServicePending: true };
    const state = reducer(
      prevState,
      { type: HOME_GET_SERVICE_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getServicePending).toBe(false);
    expect(state.getServiceError).toEqual(expect.anything());
  });

  it('handles action type HOME_GET_SERVICE_DISMISS_ERROR correctly', () => {
    const prevState = { getServiceError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_GET_SERVICE_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.getServiceError).toBe(null);
  });
});

