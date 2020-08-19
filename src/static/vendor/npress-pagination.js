var NPress = NPress || {};

class Pagination{
    constructor(container, options = {}){
        this.paginationTpl = Twig.twig({ href: "/js/templates/pagination.twig", async: false });
        this.container = container;

        this.options = Object.assign({
            currentPage: 1,
            itemsPerPage: 10,
            totalItems: 0,
            totalPageCount: 1,
            baseUrl: `${window.location.protocol}//${window.location.host}${window.location.pathname}`,
            search: window.location.search,
            hash: window.location.hash,
        }, options);

        NPress.live(this.element(), 'click', '.js-page, .js-next, .js-prev', this.onPageClick.bind(this));
        NPress.live(this.element(), 'click', '.js-per-page', this.onPerPageClick.bind(this));
        this.render();
        window.addEventListener('popstate', this.onWindowPopstate.bind(this));
        return this;
    }
    onWindowPopstate(e){
        if (e.state) {
            this.changePage(e.state.currentPage);
        }
    }
    computePageCount(itemsPerPage, totalItems){
        totalItems = parseInt(totalItems);
        itemsPerPage = parseInt(itemsPerPage);
        if (totalItems === this.options.totalItems){
            return;
        }

        let totalPageCount = 1;
        if (parseInt(totalItems)){
            totalPageCount = parseInt(totalItems) ? totalItems / itemsPerPage : 0;
            totalPageCount = (totalPageCount === 1 || totalPageCount % 2 === 0) ? totalPageCount : totalPageCount+1;
        }
        return parseInt(totalPageCount);
    }
    setTotalCount(totalItems){
        if (totalItems === this.options.totalItems){
            return;
        }
        this.options.totalItems = totalItems;
        this.renderWithNewPageCount();
    }
    setPerPage(itemsPerPage){
        itemsPerPage = parseInt(itemsPerPage);
        if (!itemsPerPage){
            return;
        }
        this.options.itemsPerPage = itemsPerPage;
        this.renderWithNewPageCount();
    }
    renderWithNewPageCount(){
        this.options.totalPageCount = this.computePageCount(this.options.itemsPerPage, this.options.totalItems);
        if (this.options.currentPage > this.options.totalPageCount){
            this.options.currentPage--;
        }
        this.render();
    }
    onPageClick(e){
        e.preventDefault();
        let newPage = e.target.getAttribute('data-page');
        if (newPage == this.options.currentPage){
            return;
        }
        this.changePage(newPage);
    }
    onPerPageClick(e){
        e.preventDefault();
        let newItemsPerPage = e.target.getAttribute('data-items-per-page');
        this.element().dispatchEvent(new CustomEvent(Pagination.ON_BEFORE_CHANGE_ITEMS_PER_PAGE, {"bubbles":true, "cancelable":false, detail: { page: this.options.currentPage, itemsPerPage: newItemsPerPage }}));
        this.setPerPage(newItemsPerPage);
        this.element().dispatchEvent(new CustomEvent(Pagination.ON_AFTER_CHANGE_ITEMS_PER_PAGE, {"bubbles":true, "cancelable":false, detail: { page: this.options.currentPage, itemsPerPage: this.options.itemsPerPage }}));
    }
    render(){
        this.container.innerHTML = this.paginationTpl.render({
            totalItems: this.options.totalItems || 0,
            itemsPerPage: this.options.itemsPerPage || 10,
            currentPage: this.options.currentPage || 1,
            totalPageCount: this.options.totalPageCount,
            baseUrl: this.options.baseUrl
        });
    }
    element(){
        return this.container;
    }
    setPage(page){
        page = parseInt(page);
        if (!page || page > this.totalPageCount || page < 1){
            return;
        }
        this.options.currentPage = page;
        this.changePage(this.options.currentPage);
    }
    changePage(page){
        var pageChanged = false;
        switch (page){
            case 'next':
                if (this.options.currentPage != this.options.totalPageCount) {
                    this.options.currentPage++;
                    pageChanged = true;
                }
                break;
            case 'prev':
                if (this.options.currentPage != 1) {
                    this.options.currentPage--;
                    pageChanged = true;
                }
                break;
            default:
                if (this.options.currentPage != page) {
                    this.options.currentPage = parseInt(page);
                    pageChanged = true;
                }
                break;
        }
        if (pageChanged){
            this.element().dispatchEvent(new CustomEvent(Pagination.ON_BEFORE_CHANGE_PAGE, {"bubbles":true, "cancelable":false, detail: { page: this.options.currentPage, itemsPerPage: this.options.itemsPerPage }}));
            this.render();
            this.element().dispatchEvent(new CustomEvent(Pagination.ON_AFTER_CHANGE_PAGE, {"bubbles":true, "cancelable":false, detail: { page: this.options.currentPage, itemsPerPage: this.options.itemsPerPage }}));
        }
        return pageChanged;
    }
}

Pagination.ON_BEFORE_CHANGE_PAGE = 'npress-paginator-before-change-page';
Pagination.ON_AFTER_CHANGE_PAGE = 'npress-paginator-after-change-page';
Pagination.ON_BEFORE_CHANGE_ITEMS_PER_PAGE = 'npress-paginator-before-change-items-per-page';
Pagination.ON_AFTER_CHANGE_ITEMS_PER_PAGE = 'npress-paginator-after-change-items-per-page';
Pagination.ON_BEFORE_NEXT_PAGE = 'npress-paginator-before-next';
Pagination.ON_AFTER_NEXT_PAGE = 'npress-paginator-after-next';
Pagination.ON_BEFORE_PREV_PAGE = 'npress-paginator-before-prev';
Pagination.ON_AFTER_PREV_PAGE = 'npress-paginator-after-prev';

NPress.Pagination = Pagination;