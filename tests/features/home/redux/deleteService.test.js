import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

import {
  HOME_DELETE_SERVICE_BEGIN,
  HOME_DELETE_SERVICE_SUCCESS,
  HOME_DELETE_SERVICE_FAILURE,
  HOME_DELETE_SERVICE_DISMISS_ERROR,
} from '../../../../src/features/home/redux/constants';

import {
  deleteService,
  dismissDeleteServiceError,
  reducer,
} from '../../../../src/features/home/redux/deleteService';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('home/redux/deleteService', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('dispatches success action when deleteService succeeds', () => {
    const store = mockStore({});

    return store.dispatch(deleteService())
      .then(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_DELETE_SERVICE_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_DELETE_SERVICE_SUCCESS);
      });
  });

  it('dispatches failure action when deleteService fails', () => {
    const store = mockStore({});

    return store.dispatch(deleteService({ error: true }))
      .catch(() => {
        const actions = store.getActions();
        expect(actions[0]).toHaveProperty('type', HOME_DELETE_SERVICE_BEGIN);
        expect(actions[1]).toHaveProperty('type', HOME_DELETE_SERVICE_FAILURE);
        expect(actions[1]).toHaveProperty('data.error', expect.anything());
      });
  });

  it('returns correct action by dismissDeleteServiceError', () => {
    const expectedAction = {
      type: HOME_DELETE_SERVICE_DISMISS_ERROR,
    };
    expect(dismissDeleteServiceError()).toEqual(expectedAction);
  });

  it('handles action type HOME_DELETE_SERVICE_BEGIN correctly', () => {
    const prevState = { deleteServicePending: false };
    const state = reducer(
      prevState,
      { type: HOME_DELETE_SERVICE_BEGIN }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteServicePending).toBe(true);
  });

  it('handles action type HOME_DELETE_SERVICE_SUCCESS correctly', () => {
    const prevState = { deleteServicePending: true };
    const state = reducer(
      prevState,
      { type: HOME_DELETE_SERVICE_SUCCESS, data: {} }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteServicePending).toBe(false);
  });

  it('handles action type HOME_DELETE_SERVICE_FAILURE correctly', () => {
    const prevState = { deleteServicePending: true };
    const state = reducer(
      prevState,
      { type: HOME_DELETE_SERVICE_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteServicePending).toBe(false);
    expect(state.deleteServiceError).toEqual(expect.anything());
  });

  it('handles action type HOME_DELETE_SERVICE_DISMISS_ERROR correctly', () => {
    const prevState = { deleteServiceError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_DELETE_SERVICE_DISMISS_ERROR }
    );
    expect(state).not.toBe(prevState); // should be immutable
    expect(state.deleteServiceError).toBe(null);
  });
});

