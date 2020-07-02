((N) => {

    class ThemesPage extends N.BaseAdminPage{
        constructor(){
            super();
            this.dataWrapper = document.querySelector('.js-data-wrapper');
            this.currentPageData = {}
            this.currentFetchedItemCount = 0;

            this.initTemplates();
            this.initEvents();

            this.paginator.element().addEventListener(N.Pagination.ON_AFTER_CHANGE_PAGE, this.onPageChange.bind(this));
            this.search.element().addEventListener(N.SearchHandler.ON_AFTER_SEARCH_KEYUP, this.onSearch.bind(this));
            this.onPageChange();
        }
        initTemplates(){
            Twig.twig({ id: 'themes-page-data-template', href: "/js/templates/themes-page-data-template.twig", async: false });
        }
        initEvents(){
            N.live(this.dataWrapper, 'click', '.js-activate', this.onActivate.bind(this));
        }
        onPageChange(e){
            this.getData(( e && e.detail.page ) || 1)
        }
        onSearch(e){
            this.getData(1, e.detail.query);
        }
        onActivate(e, el){
            let themeName = el.getAttribute('data-id');
            N.api.themes.update({id: themeName}, { form: this.dataWrapper }).then((response) => {
                this.getData();
            });
        }
        getData(page = 1, query = false){
            N.api.themes.get({ query: query, page: page, form: this.dataTableWrapper }).then((response) => {
                this.renderData(response);
            });
        }
        renderData(response){
            this.currentFetchedItemCount = response.count;
            this.dataWrapper.innerHTML = Twig.twig({ref: 'themes-page-data-template'}).render({ data: response.data });
            this.paginator.setTotalCount(response.total);
            this.updateHistory();
            N.refreshTooltips();
        }
    }

    new ThemesPage();

})(NPress)