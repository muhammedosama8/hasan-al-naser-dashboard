import BaseService from "./BaseService";
import http from "./HttpService";
import { API_BASE_URL_ENV } from "../jsx/common/common";

const apiEndpoint = API_BASE_URL_ENV() + "/order/admin";
const apiUpadteEndpoint = API_BASE_URL_ENV() + "/order/changeStatus";

export default class OrdersService extends BaseService {
  constructor() {
    super(apiEndpoint);
  }

  changeStatus(id, data){
    return http.put(`${apiUpadteEndpoint}/${id}`, data)
  }
}
