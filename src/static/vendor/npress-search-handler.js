var NPress = NPress || {};

NPress.SearchHandler = class SearchHandler{
    static ON_AFTER_SEARCH_KEYUP = 'npress-after-search-keyup';
    constructor(options = {}){
        this.options = Object.assign({
            query: '',
            el: document.querySelector('input.js-search-input'),
            searchDelay: 1000
        }, options);
        if (!this.options.el){
            return;
        }
        this.form = this.options.el.closest('form');

        this.options.el.addEventListener('keyup', this.onKeyup.bind(this));
        this.form.addEventListener('submit', e => e.preventDefault());
        NPress.live(this.form, 'click', '.js-clear-search-btn', this.onClearSearchClick.bind(this));

        if (this.options.query){
            this.options.el.value = this.options.query;
        }
        this.dispatchTimeoutIndex = 0;
    }
    element(){
        return this.options.el;
    }
    value(){
        return this.options.el.value;
    }
    dispatchRefresh(){
        this.options.el.dispatchEvent(new Event('keyup'));
    }
    onClearSearchClick(){
        if (this.options.el.value === ''){ return; }
        this.options.el.value = '';
        this.dispatchRefresh();
    }
    onKeyup(e){
        clearTimeout(this.dispatchTimeoutIndex);
        this.dispatchTimeoutIndex = setTimeout( () => {
            this.options.query = e.target.value;
            let newEvent = new CustomEvent(NPress.SearchHandler.ON_AFTER_SEARCH_KEYUP, {"bubbles":true, "cancelable":false, detail: { query: this.options.query }});
            this.options.el.dispatchEvent(newEvent);
        }, this.options.searchDelay);
    }
}