import Axios, {AxiosRequestConfig} from "axios";

const DEV_HOST = 'http://localhost:3000';
const PRODUCTION_HOST = 'https://golisten.ucd.ie';

export function isDevMode() {
  return !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
}

export function downloadFileTool(config?: AxiosRequestConfig) {
  const host = isDevMode() ? 'http://localhost:8889' : '';
  config.url = host + config.url;
  const uri = Axios.getUri(config);
  window.open(uri);
}

export function getCurrentHost() {
  return isDevMode() ? DEV_HOST : PRODUCTION_HOST;
}

const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB'];
// The size should be in byte unit
export function fmtFileSize(size: number): string {
  for (const unit of units) {
    if (Math.abs(size) < 1024.0) return size.toFixed(2) + unit
    size /= 1024.0
  }
  return size.toFixed(2) + 'YB'
}
