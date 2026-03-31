import { environment } from '../../../environments/environment';

export const API_BASE_URL = environment.apiUrl.replace(/\/+$/, '');
export const CSRF_HEADER_NAME = 'X-SeatLine-CSRF';
export const CSRF_HEADER_VALUE = '1';

const SAFE_HTTP_METHODS = new Set(['GET', 'HEAD', 'OPTIONS', 'TRACE']);

export function isApiRequestUrl(url: string): boolean {
  return url.startsWith(API_BASE_URL);
}

export function isUnsafeApiMethod(method: string): boolean {
  return !SAFE_HTTP_METHODS.has(method.toUpperCase());
}
