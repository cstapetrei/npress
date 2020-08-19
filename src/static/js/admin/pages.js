((N) => {

    class PagesPage extends N.BaseAdminPage{
        constructor(){
            super();
            this.dataTableWrapper = document.querySelector('.js-data-table-wrapper');
            this.currentFetchedItemCount = 0;

            this.initTemplates();
            this.initEvents();

            this.paginator.element().addEventListener(N.Pagination.ON_AFTER_CHANGE_PAGE, this.onRefreshData.bind(this));
            this.paginator.element().addEventListener(N.Pagination.ON_AFTER_CHANGE_ITEMS_PER_PAGE, this.onRefreshData.bind(this));
            this.search.element().addEventListener(N.SearchHandler.ON_AFTER_SEARCH_KEYUP, this.onRefreshData.bind(this));
            this.sort.element().addEventListener(N.SortHandler.ON_AFTER_SORT_CLICKED, this.onRefreshData.bind(this));
            this.onRefreshData();
        }
        initTemplates(){
            Twig.twig({ id: 'page-table-template', href: "/js/templates/page-table-template.twig", async: false });
        }
        initEvents(){
            N.live(this.dataTableWrapper,'click','.js-delete', this.onDeleteItemClick.bind(this));
            N.live(this.dataTableWrapper,'click','.js-change-status', this.onChangePageStatusClick.bind(this));
            N.live(this.dataTableWrapper,'click','.js-set-as-homepage', this.onSetHomepageClick.bind(this));
        }
        onRefreshData(e){
            this.getData(this.paginator.options.currentPage, this.paginator.options.itemsPerPage, this.search.options.query, this.sort.getOrderString() );
        }
        getData(page = 1, itemsPerPage = 10, query = false, order = false){
            N.api.pages.get({ query: query, page: page, perPage: itemsPerPage, order: order, form: this.dataTableWrapper }).then(this.renderData.bind(this));
        }
        renderData(response){
            this.currentFetchedItemCount = response.count;
            this.dataTableWrapper.innerHTML = Twig.twig({ref: 'page-table-template'}).render({ data: response.data, sort: { column: this.sort.options.column, order: this.sort.options.sort } });
            this.paginator.setTotalCount(response.total);
            this.updateHistory();
            N.refreshTooltips();
        }
        onDeleteItemClick(e, el){
            let rowId = el.getAttribute('data-page-id');
            if (!rowId){
                return;
            }
            new N.Confirm({
                message: 'Delete page?',
                onConfirm: (e, modal) => {
                    N.api.pages.deletePage({ id: rowId }, {form: this.dataTableWrapper }).then(() => {
                        this.getData( this.currentFetchedItemCount == 1 ? this.paginator.options.currentPage - 1 : this.paginator.options.currentPage );
                    });
                }
            });
        }
        onChangePageStatusClick(event, el){
            let pageId = el.getAttribute('data-page-id'),
                toStatus = el.getAttribute('data-to-status');
            if (!pageId){
                return;
            }
            N.api.pages.changePageStatus({ id: pageId, status: toStatus }, {form: this.dataTableWrapper }).then(() => {
                this.getData(this.paginator.options.currentPage);
                new Noty({text: 'Page status set to: '+toStatus, type: 'success' }).show();
            });
        }
        onSetHomepageClick(event, el){
            let pageId = el.getAttribute('data-page-id');
            if (!pageId){
                return;
            }
            N.api.pages.setAsHomepage({ id: pageId }, {form: this.dataTableWrapper }).then(() => {
                this.getData(this.paginator.options.currentPage);
                new Noty({text: 'Homepage set to: ' + el.getAttribute('data-page-title'), type: 'success' }).show();
            });
        }
    }

    new PagesPage();

})(NPress)