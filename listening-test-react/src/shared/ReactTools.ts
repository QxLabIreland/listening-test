import Axios, {AxiosRequestConfig} from "axios";
import {BasicTestModel} from "./models/BasicTestModel";

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

export function ValidateDetailError(tests: BasicTestModel) {
  for (const item of tests.items) {
    if (item.example && (!item.example.audios || item.example.audios.length < 1)) {
      return 'Please add at least one audio for every example'
    }
    if (item.example.audios.some(value => value == null)) return 'Please fill audios of examples';
  }
  return null;
}
