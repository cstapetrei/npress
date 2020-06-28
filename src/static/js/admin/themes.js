((N) => {

    class ThemesPage extends N.BaseAdminPage{
        constructor(){
            super();
            this.dataTableWrapper = document.querySelector('.js-data-table-wrapper');
            this.currentPageData = {}
            this.currentFetchedItemCount = 0;

            this.initTemplates();
            this.initEvents();

            this.paginator.element().addEventListener(N.Pagination.ON_AFTER_CHANGE_PAGE, this.onPageChange.bind(this));
            this.search.element().addEventListener(N.SearchHandler.ON_AFTER_SEARCH_KEYUP, this.onSearch.bind(this));
            this.onPageChange();
        }
        initTemplates(){
        }
        initEvents(){
        }
        onPageChange(e){
            this.getData(( e && e.detail.page ) || 1)
        }
        onSearch(e){
            this.getData(1, e.detail.query);
        }
        getData(page = 1, query = false){
            N.api.themes.get({ query: query, page: page, form: this.dataTableWrapper }).then((response) => {
                this.renderData(response);
            });
        }
        renderData(response){
            // this.currentFetchedItemCount = response.count;
            // this.dataTableWrapper.innerHTML = Twig.twig({ref: 'user-table-template'}).render({ data: response.data });
            // this.paginator.setTotalCount(response.total);
            // this.updateHistory();
            N.refreshTooltips();
        }
    }

    new ThemesPage();

})(NPress)