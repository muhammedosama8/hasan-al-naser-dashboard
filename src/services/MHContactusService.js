import BaseService from "./BaseService";
import { API_BASE_URL_ENV } from "../jsx/common/common";

const apiEndpoint = API_BASE_URL_ENV() + "/setting/contactUs";

export default class MHContactusService extends BaseService {
    constructor() {
        super(apiEndpoint);
    }
}
