import {
  LOAD_DATAS,
  LOAD_DATAS_SUCCESS,
  LOAD_DATAS_ERROR,
} from './constants';

/**
 * Load the repositories, this action starts the request saga
 *
 * @return {object} An action object with a type of LOAD_REPOS
 */
export function loadFiles() {
  return {
    type: LOAD_DATAS,
  };
}

/**
 * Dispatched when the repositories are loaded by the request saga
 *
 * @param  {array} repos The repository data
 * @param  {string} username The current username
 *
 * @return {object}      An action object with a type of LOAD_REPOS_SUCCESS passing the repos
 */
export function filesLoaded(repos, username) {
  return {
    type: LOAD_DATAS_SUCCESS,
    repos,
    username,
  };
}

/**
 * Dispatched when loading the repositories fails
 *
 * @param  {object} error The error
 *
 * @return {object}       An action object with a type of LOAD_REPOS_ERROR passing the error
 */
export function filesLoadingError(error) {
  return {
    type: LOAD_DATAS_ERROR,
    error,
  };
}
