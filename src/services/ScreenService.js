import BaseService from "./BaseService";
import http from "./HttpService";

import { API_BASE_URL_ENV } from "../jsx/common/common";

const apiEndpoint = API_BASE_URL_ENV() + "/screen";

export default class ScreenService extends BaseService {
  constructor() {
    super(apiEndpoint);
  }

  update(data) {
    return http.put(apiEndpoint, data);
  }
}
