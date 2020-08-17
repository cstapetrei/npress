var NPress = NPress || {};

NPress.SortHandler = class SortHandler{
    static ON_AFTER_SORT_CLICKED = 'npress-after-sort-clicked';
    constructor(options = {}){
        this.options = Object.assign({
            el: document.querySelector('.content'),
            sortQuery: 'id,asc',
        }, options);
        NPress.live(this.options.el, 'click', '[data-sort-column]', this.onSortClick.bind(this));
        this.initFromSortQuery();
    }
    initFromSortQuery(){
        if (!this.options.sortQuery){
            this.options.column = 'id';
            this.options.sort = 'asc';
            return;
        }
        let queryArray = this.options.sortQuery.split(',');
        if (queryArray[0] && queryArray[1]){
            this.options.column = queryArray[0].trim();
            this.options.sort = queryArray[1].trim();
        }
    }
    element(){
        return this.options.el;
    }
    getOrderString(){
        return `${this.options.column},${this.options.sort}`;
    }
    onSortClick(e, el){
        this.options.column = el.getAttribute('data-sort-column');
        this.options.sort = el.getAttribute('data-sort-order') === 'asc' ? 'desc' : 'asc';
        let newEvent = new CustomEvent(NPress.SortHandler.ON_AFTER_SORT_CLICKED, {"bubbles":true, "cancelable":false, detail: { order: this.getOrderString() }});
        this.options.el.dispatchEvent(newEvent);
        el.setAttribute('data-sort-order', this.options.sort);
    }
}