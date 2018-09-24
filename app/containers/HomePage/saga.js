import { call, put } from 'redux-saga/effects';
// import { LOAD_DATAS } from 'containers/App/constants';
import { filesLoaded, filesLoadingError } from 'containers/App/actions';

import request from 'utils/request';

export function* getDatas() {
  const requestURL = 'Request URL';

  try {
    // Call our request helper (see 'utils/request')
    const files = yield call(request, requestURL);
    yield put(filesLoaded(files, ''));
  } catch (err) {
    yield put(filesLoadingError(err));
  }
}
