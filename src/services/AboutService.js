import BaseService from "./BaseService";
import http from "./HttpService";
import { API_BASE_URL_ENV } from "../jsx/common/common";

const apiEndpoint = API_BASE_URL_ENV() + "/home";

export default class AboutService extends BaseService {
  constructor() {
    super(apiEndpoint);
  }

  getList() {
    return http.get(`${apiEndpoint}/getAbout`);
  }

  create(data) {
    return http.post(`${apiEndpoint}/addAbout`, data);
  }
}
