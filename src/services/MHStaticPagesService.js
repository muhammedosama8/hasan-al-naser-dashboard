import BaseService from "./BaseService";
import http from './HttpService'
import { API_BASE_URL_ENV } from "../jsx/common/common";

const apiEndpoint = API_BASE_URL_ENV() + "/staticPage/hn";

export default class MHStaticPagesService extends BaseService {
    constructor() {
        super(apiEndpoint);
    }

    getList(params) {
        return http.get(apiEndpoint,{params});
        
    }
}
