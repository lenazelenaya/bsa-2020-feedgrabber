import { all, call, put, takeEvery } from 'redux-saga/effects';
import apiClient from "../../helpers/apiClient";
import { toastr } from 'react-redux-toastr';
import {
  loadCompanyFeedRoutine,
  loadCompanyFeedItemRoutine,
  saveCompanyFeedItemRoutine,
  createCompanyFeedItemRoutine,
  reactOnNewsRoutine
} from './routines';
import { ICompanyFeedItem } from '../../models/companyFeed/ICompanyFeedItem';

const defaultItem = {
  title: '',
  body: '',
  image: null,
  createdAt: new Date().toLocaleString(),
  type: '',
  user: { id: '', username: '' }
} as ICompanyFeedItem;

function* loadCompanyFeed() {
  try {
	const res = yield call(apiClient.get, '/api/news');
    yield put(loadCompanyFeedRoutine.success(res.data.data));
  } catch (error) {
    yield put(loadCompanyFeedRoutine.failure());
    toastr.error('Unable to load company feed');
  }
}

function* loadCompanyFeedItem(action) {
  try {
    const { id } = action.payload;
    if (!id) {
      // return defaultItem
      yield put(loadCompanyFeedItemRoutine.success(defaultItem));
      return;
    }
    const res = yield call(apiClient.get, `/api/news/${id}`);
    const feedItem = res.data.data;
    yield put(loadCompanyFeedItemRoutine.success(feedItem));
  } catch (error) {
    yield put(loadCompanyFeedItemRoutine.failure());
    toastr.error('Can not load feed');
  }
}

function* reactOnNews(action) {
  try {
    yield call(apiClient.post, '/api/news/reaction', action.payload);
  } catch (error) {
    toastr.error('Can not react on news');
  }
}

function* createCompanyFeedItem(action) {
  try {
    const res = yield call(apiClient.post, '/api/news', action.payload);
    yield put(createCompanyFeedItemRoutine.success(res.data.data));
    yield put(loadCompanyFeedRoutine.trigger());
  } catch (err) {
    yield put(createCompanyFeedItemRoutine.failure());
    toastr.error('Unable to create feed item');
  }
}

function* saveCompanyFeedItem(action) {
  try {
    // here well be api-call
    yield put(saveCompanyFeedItemRoutine.success());
  } catch (error) {
    toastr.error('Unable to save feed item');
  }
}

export default function* companyFeedSaga() {
  yield all([
    yield takeEvery(loadCompanyFeedRoutine.TRIGGER, loadCompanyFeed),
    yield takeEvery(loadCompanyFeedItemRoutine.TRIGGER, loadCompanyFeedItem),
    yield takeEvery(saveCompanyFeedItemRoutine.TRIGGER, saveCompanyFeedItem),
    yield takeEvery(createCompanyFeedItemRoutine.TRIGGER, createCompanyFeedItem),
    yield takeEvery(reactOnNewsRoutine.TRIGGER, reactOnNews)
  ]);
}
