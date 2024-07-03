import BaseService from "./BaseService";
import http from './HttpService'
import { API_BASE_URL_ENV } from "../jsx/common/common";

const apiEndpoint = API_BASE_URL_ENV() + "/categories";
const apiGetEndpoint = API_BASE_URL_ENV() + "/categories/Auth";

export default class CategoriesService extends BaseService {
    constructor() {
        super(apiEndpoint);
    }

    getList=(params)=>{
        return http.get(apiGetEndpoint, {params})
    }
}
