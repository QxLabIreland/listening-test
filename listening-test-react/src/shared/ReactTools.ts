import Axios, {AxiosRequestConfig} from "axios";
import process from "process";

export function downloadFileTool(config?: AxiosRequestConfig) {
  const host = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? 'http://localhost:8889' : '';
  config.url = host + config.url;
  const uri = Axios.getUri(config);
  window.open(uri);
}
