import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  HOME_ADD_SERVICE_BEGIN,
  HOME_ADD_SERVICE_SUCCESS,
  HOME_ADD_SERVICE_FAILURE,
  HOME_ADD_SERVICE_DISMISS_ERROR,
} from '../../../../src/features/home/redux/constants';

import {
  addService,
  dismissAddServiceError,
  reducer,
} from '../../../../src/features/home/redux/addService';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/addService', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when addService succeeds', () => {
    const store = mockStore({});

    return store.dispatch(addService())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_ADD_SERVICE_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_ADD_SERVICE_SUCCESS);
      });
  });

  it('dispatches failure action when addService fails', () => {
    const store = mockStore({});

    return store.dispatch(addService({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_ADD_SERVICE_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_ADD_SERVICE_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissAddServiceError', () => {
    const expectedAction = {
      type: HOME_ADD_SERVICE_DISMISS_ERROR,
    };
    expect(dismissAddServiceError()).toEqual(expectedAction);
  });

  it('handles action type HOME_ADD_SERVICE_BEGIN correctly', () => {
    const prevState = { addServicePending: false };
    const state = reducer(
      prevState,
      { type: HOME_ADD_SERVICE_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addServicePending).toBe(true);
  });

  it('handles action type HOME_ADD_SERVICE_SUCCESS correctly', () => {
    const prevState = { addServicePending: true };
    const state = reducer(
      prevState,
      { type: HOME_ADD_SERVICE_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addServicePending).toBe(false);
  });

  it('handles action type HOME_ADD_SERVICE_FAILURE correctly', () => {
    const prevState = { addServicePending: true };
    const state = reducer(
      prevState,
      { type: HOME_ADD_SERVICE_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addServicePending).toBe(false);
    expect(state.addServiceError).toEqual(expect.anything());
  });

  it('handles action type HOME_ADD_SERVICE_DISMISS_ERROR correctly', () => {
    const prevState = { addServiceError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_ADD_SERVICE_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.addServiceError).toBe(null);
  });
});

