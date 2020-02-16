exports.LIST_PERMISSION = {
    CREATE_ROLES: {
        key: "CREATE_ROLES",
        value: "Create roles"
    },
    UPDATE_ROLES: {
        key: "UPDATE_ROLES",
        value: "Update roles"
    },
    DELETE_ROLES: {
        key: "DELETE_ROLES",
        value: "Update roles"
    } ,
    UPDATE_PERMISSION: {
        key:"UPDATE_PERMISSION",
        value: "Update permission"
    } ,
    
    CREATE_USER: {
        key: "CREATE_USER",
        value: "Create user"
    },
    UPDATE_USER: {
        key: "UPDATE_USER",
        value: "Update user"
    },
    DELETE_USER: {
        key: "DELETE_USER",
        value: "Delete user"
    }
}


 exports.API_PERMISSION = {
    'create_roles': exports.LIST_PERMISSION.CREATE_ROLES.key,
    'remove_roles': exports.LIST_PERMISSION.DELETE_ROLES.key
}
