import BaseService from "./BaseService";
import http from './HttpService'
import { API_BASE_URL_ENV } from "../jsx/common/common";

const apiEndpoint = API_BASE_URL_ENV() + "/users/area";
export default class AreasService extends BaseService {
    constructor() {
        super(apiEndpoint);
    }
    
    getList=(id)=>{
        return http.get(`${apiEndpoint}/${id}`) 
    }

}
