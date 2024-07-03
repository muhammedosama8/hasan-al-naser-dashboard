import BaseService from "./BaseService";
import http from "./HttpService";
import { API_BASE_URL_ENV } from "../jsx/common/common";

const apiEndpoint = API_BASE_URL_ENV() + "/product";
const apiGetEndpoint = API_BASE_URL_ENV() + "/product/Auth";
const apiDynamicVariantForProductEndpoint = API_BASE_URL_ENV() + "/product/dynamicVariantsOfProduct";

export default class MHProductsService extends BaseService {
  constructor() {
    super(apiEndpoint);
  }

  getList(params) {
    if(params){
      return http.get(apiGetEndpoint, {params});
    } else {
      return http.get(apiGetEndpoint);
    }
    
  }

  getProduct(id){
    return http.get(`${apiGetEndpoint}/${id}`)
  }

  getDynamicVariantOfProducts(id){
    return http.get(`${apiDynamicVariantForProductEndpoint}/${id}`)
  }
}
