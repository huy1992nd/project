exports.CODE_ID = {
ORDER: 'OD',
INVOICE: 'IVAPI',
CUSTOMER: "KH",
};

exports.gSequence = {
    hash: 'sharectv',
    max_customer_code: 1000,
    max_product_code: 100
}

exports.ResultCode = {
   
    HACKER: 33,
    SUCCESS: 0,
    NOT_SUCCESS:1,
    BLOCKED:10,
    OTHER_ERROR: 17,
    NOT_AUTHEN:97,
    NOT_PERMISSION: 98,
    SQL_ERROR: 99,
    INCORRECT_DATA: 100,
    WRONG_PASSWORD:22,
    USER_EXISTED:11,
    MAIL_EXISTED:31,
    EXIT_ROLE:61,
    EXIT_PERMISSION:62,
    EXIT_SYMBOL:71,
    EXIT_GROUP_SYMBOL:72,
    EXIT_SITE:81,
    EXIT_LIMIT_SITE:82,
    EXIT_WEB:85,
    EXIT_TEMPLATE:86
}
exports.UserPermission = {
    ADMIN : 9,
    MANAGER: 6,
    EMPLOYER : 0
}

exports.SocketApiKey = {
    DEPOSIT: "deposit_money",

}

exports.EmitType = {
    SOCKET_EMIT: 'socket_emit'
};
exports.TemplateMail = {
    VERIFY_CODE: "verify_code",
    TRANSFER_MONEY: "transfer_money",
    ADD_MONEY: "add_money",
    RESET_PASWORD:"reset_password"
}

exports.VerifyType = {
    REGISTER: "register",
    ADD_MONEY: "add_money",
    SEND_MONEY: "send_money"
}
exports.KeySocket = '01f49747159434f5b229236df42f072c'
exports.KeyJwt = 'LOVEYOU031019';

exports.InvoiceTemplate = {
    DEPOSIT: "DEPOSIT",
    WITHDRAW: "WITHDRAW",
    NAP_TIEN_BANK:"DEPOSIT_BANK"
    }
    exports.LOGType = {
        NOTIFY: 0,
        SUCCESS: 1,
        ERROR: -1
    }
    exports.LogAction = {
        NEW_ORDER_CUS: 0,
        SYSTEM_ERROR: 99
    
    }

    exports.SOCKET_GROUP = {
        PRODUCT: "PRODUCT"
    }
    exports.getGroupSocket =  function(account_id,type){
        return `GROUP_${account_id}_${type}`
    }

    exports.RedisChanel = {
        PERMISSION: "permission"
    }

    exports.RoleType = {
        ROOT: "9",
        MANAGER: "6",
        CUSTOMER: "3"
    }

