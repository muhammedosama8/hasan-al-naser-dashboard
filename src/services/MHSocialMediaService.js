import BaseService from "./BaseService";

import { API_BASE_URL_ENV } from "../jsx/common/common";

const apiEndpoint = API_BASE_URL_ENV() + "/setting/social_hn";

export default class MHSocialMediaService extends BaseService {
    constructor() {
        super(apiEndpoint);
    }

}
