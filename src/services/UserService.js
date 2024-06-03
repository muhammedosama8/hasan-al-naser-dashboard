import BaseService from "./BaseService";
import http from './HttpService'
import { API_BASE_URL_ENV } from "../jsx/common/common";

const apiEndpoint = API_BASE_URL_ENV() + "/admin/user";
const apiSearchUserEndpoint = API_BASE_URL_ENV() + "/search/user";

export default class UserService extends BaseService {
    constructor() {
        super(apiEndpoint);
    }

    searchUser(params) {
        return http.get(apiSearchUserEndpoint,{params});
    }
}
