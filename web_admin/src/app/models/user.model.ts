export class UserModel {
    account_id: string;
    user_name: string;
    permission: number;
    session: string;
    constructor(object: {} = {}) {
        this.account_id = object['account_id'] || '';
        this.user_name = object['user_name'] || '';
        this.permission = object['permission'] != null ? object['permission'] : null;
        this.session = object['token_authen'] || '';
    }
};

export class UserInfoModel {
    user_name: string;
    account_id: string;
    mail: string;
    phone_number: string;
    refer_id: string;
    facebook: string;
    permission: number;
    my_currency: string;
    site: string;
    address: string;

    constructor(object: {} = {}) {
        this.user_name = object['user_name'] || '';
        this.mail = object['mail'] || '';
        this.phone_number = object['phone_number'] || '';
        this.refer_id = object['refer_id'] || '';
        this.facebook = object['facebook'] || '';
        this.my_currency = object['my_currency'] || '';
        this.permission = object['permission'] != null ? object['permission'] : null;
        this.address = object['address'] || '';
        this.site = object['site'] || '';
        this.account_id = object['account_id'] || '';
    }
}