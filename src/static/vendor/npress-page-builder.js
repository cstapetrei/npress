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
            let r = el.closest('.npress-page-builder-widget-toolbar').parentNode.querySelector('.col-content');
            let item = document.createElement('h1');
            item.innerHTML = 'Test';
            r.appendChild(item);
        });
    }
    addToolbar(){
        this.toolbarNode = document.createElement('aside');
        this.toolbarNode.className = 'npress-page-builder-widget-toolbar';
        this.toolbarNode.innerHTML = `
            <button class="btn btn-default js-add-container" data-class="container">boxed</button>
            <button class="btn btn-default js-add-fluid-container" data-class="container-fluid">fluid</button>
            <button class="btn btn-default js-get-code">code</button>
        `;
        this.options.el.appendChild(this.toolbarNode);

        NPress.live(this.toolbarNode, 'click', '.js-add-container', this.onAddContainer.bind(this));
        NPress.live(this.toolbarNode, 'click', '.js-add-fluid-container', this.onAddContainer.bind(this));
    }
    onAddColumn(e, el){
        e.preventDefault();
        let colClass = el.getAttribute("data-class");
        let r = el.closest('.npress-page-builder-widget-toolbar').parentNode.querySelector('.row');
        let c = document.createElement('div');
        c.className = `col-${colClass}`;
        c.innerHTML = `
            <div class="npress-page-builder-widget col-content"></div>
            <div class="npress-page-builder-widget-toolbar">
                <button class="btn btn-default js-add-element">add</button>
            </div>
        `;
        r.appendChild(c);
    }
    onAddContainer(e, el){
        e.preventDefault();
        let containerClass = el.getAttribute("data-class");
        let c = document.createElement('div');
        c.className = `${containerClass} npress-page-builder-widget`;
        let btnHtml = '';
        for (let i = 1; i <= Array(12).length; i++){
            btnHtml += `<button class="btn btn-default btn-xs js-add-col" data-class="${i}">${i}</button>`;
        }
        c.innerHTML = `<div class="row"></div><div class="npress-page-builder-widget-toolbar">${btnHtml}</div>`;
        this.options.el.insertBefore(c, this.toolbarNode);
    }
}