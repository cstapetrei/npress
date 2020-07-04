var NPress = NPress || {};

NPress.PageBuilder = class PageBuilder{
    constructor(options = {}){
        this.options = this.options = Object.assign({
            el: document.getElementById('npress-page-builder')
        }, options);

        if (!this.options.el){
            return;
        }

        this.addToolbar();
        NPress.live(this.options.el, 'click', '.js-add-col', this.onAddColumn);
        NPress.live(this.options.el, 'click', '.js-add-element', (e, el) => {
            e.preventDefault();
            let r = el.parentNode.querySelector('.col-content');
            let item = document.createElement('h1');
            item.innerHTML = 'Test';
            r.appendChild(item);
        });
    }
    addToolbar(){
        this.toolbarNode = document.createElement('aside');
        this.toolbarNode.className = 'npress-page-builder-toolbar';
        this.toolbarNode.innerHTML = `
            <button class="btn btn-default btn-block js-add-container" data-class="container">boxed</button>
            <button class="btn btn-default btn-block js-add-fluid-container" data-class="container-fluid">fluid</button>
        `;
        this.options.el.appendChild(this.toolbarNode);

        NPress.live(this.toolbarNode, 'click', '.js-add-container', this.onAddContainer.bind(this));
        NPress.live(this.toolbarNode, 'click', '.js-add-fluid-container', this.onAddContainer.bind(this));
    }
    onAddColumn(e, el){
        e.preventDefault();
        let colClass = el.getAttribute("data-class");
        let r = el.parentNode.querySelector('.row');
        let c = document.createElement('div');
        c.className = `col-${colClass}`;
        c.innerHTML = `
            <div class="npress-page-builder-widget col-content"></div>
            <button class="btn btn-default js-add-element">add</button>
        `;
        r.appendChild(c);
    }
    onAddContainer(e, el){
        e.preventDefault();
        let containerClass = el.getAttribute("data-class");
        let c = document.createElement('div');
        c.className = `${containerClass} npress-page-builder-widget`;
        c.innerHTML = `<div class="row"></div>`;
        for (const i of Array(12).keys()){
            c.innerHTML += `<button class="btn btn-default btn-xs js-add-col" data-class="${i+1}">${i+1}</button>`
        }
        this.options.el.appendChild(c);
    }
}