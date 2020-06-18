var NPress = NPress || {};
NPress.publicApi = {
    comments: {
        create: (data, params) => {
            return ajax('/public/comment', Object.assign({
                method: "post",
                data: data
            }, params));
        }
    },
    pages: {
        getComments: (params) => {
            let page = params.page || 0;
            let perPage = params.perPage === undefined ? 10 : parseInt(params.perPage);
            let pageId = params.pageId || 0;
            return ajax(`/public/page/${pageId}/comments?page=${page}&pp=${perPage}`, params);
        },
    }
};