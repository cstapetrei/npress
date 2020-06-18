var NPress = NPress || {};

NPress.HistoryHandler = class HistoryHandler{
    constructor(options = {}){
        this.options = Object.assign({
            baseUrl: `${window.location.protocol}//${window.location.host}${window.location.pathname}`,
            search: window.location.search,
            hash: window.location.hash,
        }, options);
    }
    refresh(newSearchAndHash){
        history.pushState(this.options, null, `${this.options.baseUrl}${newSearchAndHash}`);
    }
}