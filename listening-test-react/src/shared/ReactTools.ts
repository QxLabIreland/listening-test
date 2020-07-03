import Axios, {AxiosRequestConfig} from "axios";
import process from "process";

const DEV_HOST = 'http://localhost:8889';
const PRODUCTION_HOST = 'https://event.holacodes.com';

export function isDevMode() {
  return !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
}

export function downloadFileTool(config?: AxiosRequestConfig) {
  const host = isDevMode() ? DEV_HOST : '';
  config.url = host + config.url;
  const uri = Axios.getUri(config);
  window.open(uri);
}

export function getCurrentHost() {
  return isDevMode() ? DEV_HOST : PRODUCTION_HOST;
}
