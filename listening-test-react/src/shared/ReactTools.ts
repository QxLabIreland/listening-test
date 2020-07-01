import Axios, {AxiosRequestConfig} from "axios";
import process from "process";

export function downloadFileTool(config?: AxiosRequestConfig) {
  const host = isDevMode() ? 'http://localhost:8889' : '';
  config.url = host + config.url;
  const uri = Axios.getUri(config);
  window.open(uri);
}

function isDevMode() {
  return !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
}

export function getCurrentHost() {
  return isDevMode() ? 'http://localhost:8889' : 'https://event.holacodes.com';
}
