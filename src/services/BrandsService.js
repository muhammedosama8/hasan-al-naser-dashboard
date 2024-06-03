import BaseService from "./BaseService";
import { API_BASE_URL_ENV } from "../jsx/common/common";

const apiEndpoint = API_BASE_URL_ENV() + "/carBrand";

export default class BrandsService extends BaseService {
    constructor() {
        super(apiEndpoint);
    }

}
