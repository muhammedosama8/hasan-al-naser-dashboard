import BaseService from "./BaseService";
import http from "./HttpService";
import { API_BASE_URL_ENV } from "../jsx/common/common";

const apiEndpoint = API_BASE_URL_ENV() + "/home";

export default class ServicesService extends BaseService {
  constructor() {
    super(apiEndpoint);
  }

  getList() {
    return http.get(`${apiEndpoint}/getServices`);
  }

  create(data) {
    return http.post(`${apiEndpoint}/addService`, data);
  }
}
