var NPress = NPress || {};
NPress.api = {
    users: {
        get: (params) => {
            let page = params.page || 0;
            let query = params.query || '';
            return ajax(`/admin/api/users?page=${page}&q=${query}`, params);
        },
        create: (data, params) => {
            return ajax('/admin/api/user', Object.assign({
                method: "post",
                data: data
            }, params));
        },
        update: (data, params) => {
            return ajax(`/admin/api/user/${data.id}`, Object.assign({
                method: "put",
                data: data
            }, params));
        },
        delete: (data, params) => {
            return ajax(`/admin/api/user/${data.id}`, Object.assign({
                method: "delete"
            }, params));
        }
    },
    menus: {
        get: (params) => {
            let page = params.page || 0;
            return ajax(`/admin/api/menus`, params);
        },
        create: (data, params) => {
            return ajax('/admin/api/menu', Object.assign({
                method: "post",
                data: data
            }, params));
        },
        update: (data, params) => {
            return ajax(`/admin/api/menu/${data.id}`, Object.assign({
                method: "put",
                data: data
            }, params));
        },
        updateItems: (data, params) => {
            return ajax(`/admin/api/menu/${data.menuId}/items`, Object.assign({
                method: "put",
                data: data
            }, params));
        },
        delete: (data, params) => {
            return ajax(`/admin/api/menu/${data.id}`, Object.assign({
                method: "delete"
            }, params));
        },
        setAsDefault: (data, params) => {
            return ajax(`/admin/api/menu/${data.id}/set-as-default`, Object.assign({
                method: "put",
                data: data
            }, params));
        }
    },
    files: {
        get: (params) => {
            let page = params.page || 0;
            let query = params.query || '';
            return ajax(`/admin/api/file?page=${page}&q=${query}`, params);
        },
        delete: (data, params) => {
            return ajax(`/admin/api/file/${data.id}`, Object.assign({
                method: "delete"
            }, params));
        },
        update: (data, params) => {
            return ajax(`/admin/api/file/${data.id}`, Object.assign({
                method: "put",
                data: data
            }, params));
        },
    },
    pages: {
        get: (params) => {
            let page = params.page || 0;
            let query = params.query || '';
            let perPage = params.perPage === undefined ? 10 : parseInt(params.perPage);
            return ajax(`/admin/api/pages?page=${page}&pp=${perPage}&q=${query}`, params);
        },
        getComments: (params) => {
            let page = params.page || 0;
            let perPage = params.perPage === undefined ? 10 : parseInt(params.perPage);
            let pageId = params.pageId || 0;
            return ajax(`/admin/api/page/${pageId}/comments?page=${page}&pp=${perPage}`, params);
        },
        createPage: (data, params) => {
            return ajax('/admin/api/page', Object.assign({
                method: "post",
                data: data
            }, params));
        },
        editPage: (data, params) => {
            return ajax(`/admin/api/page/${data.id}`, Object.assign({
                method: "put",
                data: data
            }, params));
        },
        deletePage: (data, params) => {
            return ajax(`/admin/api/page/${data.id}`, Object.assign({
                method: "delete"
            }, params));
        },
        changePageStatus: (data, params) => {
            return ajax(`/admin/api/page/${data.id}/change-status`, Object.assign({
                method: "put",
                data: data
            }, params));
        },
        setAsHomepage: (data, params) => {
            return ajax(`/admin/api/page/${data.id}/set-as-homepage`, Object.assign({
                method: "put",
                data: data
            }, params));
        }
    },
    comments: {
        get: (params) => {
            let page = params.page || 0;
            return ajax(`/admin/api/comments?page=${page}`, params);
        },
        create: (data, params) => {
            return ajax('/admin/api/comment', Object.assign({
                method: "post",
                data: data
            }, params));
        },
        update: (data, params) => {
            return ajax(`/admin/api/comment/${data.id}`, Object.assign({
                method: "put",
                data: data
            }, params));
        },
        delete: (data, params) => {
            return ajax(`/admin/api/comment/${data.id}`, Object.assign({
                method: "delete"
            }, params));
        }
    },
    settings: {
        get: (params) => {
            let query = params.query || '';
            return ajax(`/admin/api/settings?q=${query}`);
        },
        create: (data, params) => {
            return ajax('/admin/api/setting', Object.assign({
                method: "post",
                data: data
            }, params));
        },
        updateAll: (data, params) => {
            return ajax(`/admin/api/settings`, Object.assign({
                method: "put",
                data: data
            }, params));
        },
        update: (data, params) => {
            return ajax(`/admin/api/setting/${data.id}`, Object.assign({
                method: "put",
                data: data
            }, params));
        },
        delete: (data, params) => {
            return ajax(`/admin/api/setting/${data.id}`, Object.assign({
                method: "delete"
            }, params));
        }
    },
    codeblocks: {
        get: (params) => {
            let page = params.page || 0;
            let query = params.query || '';
            return ajax(`/admin/api/codeblocks?page=${page}&q=${query}`, params);
        },
        create: (data, params) => {
            return ajax('/admin/api/codeblock', Object.assign({
                method: "post",
                data: data
            }, params));
        },
        update: (data, params) => {
            return ajax(`/admin/api/codeblock/${data.id}`, Object.assign({
                method: "put",
                data: data
            }, params));
        },
        delete: (data, params) => {
            return ajax(`/admin/api/codeblock/${data.id}`, Object.assign({
                method: "delete"
            }, params));
        }
    },
    themes: {
        get: (params) => {
            let page = params.page || 0;
            let query = params.query || '';
            return ajax(`/admin/api/themes?page=${page}&q=${query}`, params);
        },
        update: (data, params) => {
            return ajax(`/admin/api/theme/${data.id}`, Object.assign({
                method: "put",
                data: data
            }, params));
        }
    },
};

// find all elements with title attribute and attach a tooltip for each
NPress.refreshTooltips();