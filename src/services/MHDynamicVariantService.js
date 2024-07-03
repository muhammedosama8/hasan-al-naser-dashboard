import BaseService from "./BaseService";
import http from './HttpService'
import { API_BASE_URL_ENV } from "../jsx/common/common";

const apiEndpoint = API_BASE_URL_ENV() + "/dynamicVariant";
const apiDeleteEndpoint = API_BASE_URL_ENV() + "/dynamicVariant/deleteDynamicVariant";
const apiDynamicVariantEndpoint = API_BASE_URL_ENV() + "/dynamicVariant/dynamicVariantsByCategory";

export default class DynamicVariantService extends BaseService {
    constructor() {
        super(apiEndpoint);
    }

    remove=(id) => {
        return http.delete(`${apiDeleteEndpoint}/${id}`)
    }

    getDynamicVariant(id){
        return http.get(`${apiDynamicVariantEndpoint}/${id}`)
    }
}
