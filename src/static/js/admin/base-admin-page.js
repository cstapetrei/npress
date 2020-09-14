((N) => {
    N.BaseAdminPage = class BaseAdminPage{
        constructor(){
            this.pageCardHeader = document.querySelector('.page-card-header');

            this.urlVars = N.getUrlVars();
            this.search = new N.SearchHandler({ query: this.urlVars.q || '', searchDelay: 500 });
            this.sort = new N.SortHandler({ sortQuery: this.urlVars.order });
            this.history = new N.HistoryHandler();

            this.initPaginator();
            this.initBaseEvents();
            this.afterInit();
        }
        afterInit(){
            if (this.urlVars.q || this.urlVars.p || this.urlVars.order){
                this.search.dispatchRefresh();
            }
        }
        initBaseEvents(){
            if (this.pageCardHeader){
                N.live(this.pageCardHeader, 'change','.js-show-checkboxes-input', this.onShowCheckboxesChange.bind(this));
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
            this.paginator.options.itemsPerPage = this.urlVars.pp || 10;
        }
        updateHistory(){
            let us = new URLSearchParams();
            if (this.paginator){
                us.append('p', this.paginator.options.currentPage);
                us.append('pp', this.paginator.options.itemsPerPage);
            }
            if (this.search){
                us.append('q', this.search.options.query);
            }
            if (this.sort){
                us.append('order', `${this.sort.options.column},${this.sort.options.sort}`);
            }
            this.history.refresh(`?${us.toString()}`);
        }
        onShowCheckboxesChange(e, el){
            if (!this.dataTableWrapper){ return; }
            if (el.checked){
                this.dataTableWrapper.classList.add('show-bulk-select');
                return;
            }
            this.dataTableWrapper.classList.remove('show-bulk-select');
        }
    }
})(NPress)