import BaseService from "./BaseService";
import http from './HttpService'
import { API_BASE_URL_ENV } from "../jsx/common/common";

const apiEndpoint = API_BASE_URL_ENV() + "/product";
const apiProductCode = API_BASE_URL_ENV() +"/product/codeAuth"

export default class CustomProductsService extends BaseService {
    constructor() {
        super(apiEndpoint);
    }
    getList(id, params) {
        if(params){
          return http.get(`${apiProductCode}/${id}`, {params});
        } else {
          return http.get(`${apiProductCode}/${id}`);
        }
    }
}