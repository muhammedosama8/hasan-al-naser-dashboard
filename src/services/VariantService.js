import BaseService from "./BaseService";
import http from './HttpService'
import { API_BASE_URL_ENV } from "../jsx/common/common";

const apiEndpoint = API_BASE_URL_ENV() + "/variant/addVariant";
const apiGetAllVariant = API_BASE_URL_ENV() +"/variant/categoriesWithVariant"
const apiGetVariant = API_BASE_URL_ENV() +"/variant/getVariant"
const apiUpdateVariant = API_BASE_URL_ENV() +"/variant/allVariant"
const apiDeleteVariant = API_BASE_URL_ENV() +"/variant/deleteVariant"

export default class VariantService extends BaseService {
    // constructor() {
    //     super(apiEndpoint);
    // }
    
    addVariant=(data)=>{
        return http.post(apiEndpoint, data) 
    }
   
    getList=(params)=>{
        if(params){
            return http.get(apiGetAllVariant, {params})
        }
        return http.get(apiGetAllVariant)
    }

    getVariant=(id)=>{
        return http.get(`${apiGetVariant}/${id}`)
    }

    updateVariant=(id,data) => {
        return http.put(`${apiUpdateVariant}/${id}`,data)
    }

    remove=(id) => {
        return http.delete(`${apiDeleteVariant}/${id}`)
    }
}
