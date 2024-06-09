import BaseService from "./BaseService";
import { API_BASE_URL_ENV } from "../jsx/common/common";

const apiEndpoint = API_BASE_URL_ENV() + "/users/categories";

export default class CategoriesService extends BaseService {
    constructor() {
        super(apiEndpoint);
    }

}
