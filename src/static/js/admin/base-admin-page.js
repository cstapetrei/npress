((N) => {
    N.BaseAdminPage = class BaseAdminPage{
        constructor(){
            this.urlVars = N.getUrlVars();
            this.search = new N.SearchHandler({ query: this.urlVars.q || '', searchDelay: 500 });
            this.history = new N.HistoryHandler();

            this.initPaginator();

            if (this.urlVars.q || this.urlVars.p){
                this.search.dispatchRefresh();
            }
        }
        initPaginator(paginatorWrapperSelector = ''){
            this.paginator = false;
            let paginatorWrapper = document.querySelector(paginatorWrapperSelector || '.js-pagination-wrapper');
            if (!paginatorWrapper){
                return;
            }
            this.paginator = new N.Pagination(paginatorWrapper);
            this.paginator.options.currentPage = this.urlVars.p || 1;
        }
        updateHistory(){
            let us = new URLSearchParams();
            if (this.paginator){
                us.append('p', this.paginator.options.currentPage);
            }
            if (this.search){
                us.append('q', this.search.options.query);
            }
            this.history.refresh(`?${us.toString()}`);
        }
    }
})(NPress)