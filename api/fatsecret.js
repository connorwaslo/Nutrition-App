import hmacsha1 from 'hmacsha1';
import creds from '../creds/fatsecret';

import {FatsecretResponse} from './models';

const API_PATH = 'https://platform.fatsecret.com/rest/server.api';
const ACCESS_KEY = creds.API_KEY;
const APP_SECRET = creds.SECRET;
const OAUTH_VERSION = '1.0';
const OAUTH_SIGNATURE_METHOD = 'HMAC-SHA1';

function getOauthParameters() {
  const timestamp = Math.round(new Date().getTime() / 1000);
  return [
    ['oauth_consumer_key', ACCESS_KEY].join('='),
    ['oauth_nonce', `${timestamp}${Math.floor(Math.random() * 1000000)}`].join('='),
    ['oauth_signature_method', OAUTH_SIGNATURE_METHOD].join('='),
    ['oauth_timestamp', timestamp].join('='),
    ['oauth_version', OAUTH_VERSION].join('='),
  ];
}

function signRequest(queryParams, httpMethod = 'GET') {
  const signatureBaseString = [
    httpMethod,
    encodeURIComponent(API_PATH),
    encodeURIComponent(queryParams.join('&')),
  ].join('&');
  const signatureKey = `${APP_SECRET}&`;
  return encodeURIComponent(hmacsha1(signatureKey, signatureBaseString));
}

export async function searchFood(query, maxResults = 8) {
  const method = 'foods.search';
  const queryParams = [
    ...getOauthParameters(),
    ['format', 'json'].join('='),
    ['max_results', maxResults].join('='),
    ['method', method].join('='),
    ['search_expression', encodeURIComponent(query)].join('='),
  ].sort((a, b) => a.localeCompare(b));
  const sha = signRequest(queryParams);
  queryParams.push(['oauth_signature', sha].join('='));
  const response = await fetch(`${API_PATH}?${queryParams.join('&')}`);
  return response.json();
}

export async function getFood(foodId) {
  const method = 'food.get';
  const queryParams = [
    ...getOauthParameters(),
    ['format', 'json'].join('='),
    ['method', method].join('='),
    ['food_id', foodId].join('='),
  ].sort((a, b) => a.localeCompare(b));
  const sha = signRequest(queryParams);
  queryParams.push(['oauth_signature', sha].join('='));
  const response = await fetch(`${API_PATH}?${queryParams.join('&')}`);
  return response.json();
}