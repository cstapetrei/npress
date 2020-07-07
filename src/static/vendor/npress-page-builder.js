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
        NPress.live(this.options.el, 'click', '.js-add-col', this.onAddColumn.bind(this));
        NPress.live(this.options.el, 'click', '.js-remove-element', this.onRemoveElement);
    }
    onAddElement(e, el){
        e.preventDefault();
        let content = el.closest('[class^="col-"]').querySelector('.col-content');
        let type = el.getAttribute('data-type');
        if (!type){
            return;
        }
        let div = document.createElement('div');
        div.className = 'npress-page-builder-widget text-center';
        switch(type){
            case 'text':
                div.innerHTML += 'Placeholder text';
                break;
            case 'img':
                div.innerHTML += '<img src="" class="img-fluid" />';
                break;
            case 'code':
                div.innerHTML += '<code>Placeholder text</code>';
                break;
        }
        div.innerHTML = `
            <div class="npress-page-builder-widget-content">${div.innerHTML}</div>
            <div class="npress-page-builder-widget-toolbar">
                <button class="btn btn-default btn-xs js-edit-element" data-type="${type}"><i class="fas fa-edit"></i></button>
                <button class="btn btn-danger btn-xs js-remove-element" data-is-element="1"><i class="fas fa-times"></i></button>
            </div>
        `;
        NPress.live(div, 'click', '.js-edit-element', this.onEditElement.bind(this));
        content.appendChild(div);
    }

    onEditElement(e, el){
        let content = el.closest('.npress-page-builder-widget').querySelector('.npress-page-builder-widget-content');
        let type = el.getAttribute('data-type');
        if (!type){
            return;
        }
        switch(type){
            case 'text':

                break;
            case 'img':

                break;
            case 'code':

                break;
        }
    }

    onRemoveElement(e, el){
        let isColumn = el.getAttribute('data-is-column');
        let isElement = el.getAttribute('data-is-element');
        let widget = el.closest('.npress-page-builder-widget');
        if (isElement){
            widget = el.parentNode.parentNode;
        } else if (isColumn){
            widget = el.closest('[class^="col-"]');
        }
        if (widget){
            widget.remove();
        }
    }
    addToolbar(){
        this.toolbarNode = document.createElement('aside');
        this.toolbarNode.className = 'npress-page-builder-widget-toolbar';
        this.toolbarNode.innerHTML = `
            <button class="btn btn-default js-add-container btn-xs" data-class="container" title="Boxed" data-toggle="tooltip"><i class="fas fa-angle-right"></i> <i class="fas fa-angle-left"></i></button>
            <button class="btn btn-default js-add-fluid-container btn-xs" data-class="container-fluid" title="Fluid" data-toggle="tooltip"><i class="fas fa-angle-double-left"></i> <i class="fas fa-angle-double-right"></i></button>
            <button class="btn btn-default js-get-code btn-xs" title="Switch to source" data-toggle="tooltip"><i class="fas fa-code"></i></button>
        `;
        this.options.el.appendChild(this.toolbarNode);

        NPress.live(this.toolbarNode, 'click', '.js-add-container', this.onAddContainer.bind(this));
        NPress.live(this.toolbarNode, 'click', '.js-add-fluid-container', this.onAddContainer.bind(this));
        NPress.live(this.toolbarNode, 'click', '.js-get-code', (e, el) => { e.preventDefault() });
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
                <div class="dropdown">
                    <button class="btn btn-default btn-xs" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i class="fas fa-plus"></i>
                    </button>
                    <div class="dropdown-menu">
                        <a class="dropdown-item" href="#" data-type="text">Text</a>
                        <a class="dropdown-item" href="#" data-type="image">Image</a>
                        <a class="dropdown-item" href="#" data-type="code">Code</a>
                    </div>
                </div>
                <button class="btn btn-danger btn-xs js-remove-element" data-is-column="1"><i class="fas fa-times"></i></button>
            </div>
        `;
        NPress.live(c, 'click', '.dropdown-menu a', this.onAddElement.bind(this));
        r.appendChild(c);
    }
    onAddContainer(e, el){
        e.preventDefault();
        let containerClass = el.getAttribute("data-class");
        let c = document.createElement('div');
        c.className = `${containerClass} npress-page-builder-widget`;
        let btnHtml = '';
        for (let i = 1; i <= Array(12).length; i++){
            btnHtml += `<button class="btn btn-default btn-xs js-add-col mx-1" data-class="${i}">${i}/12</button>`;
        }
        btnHtml += `<button class="btn btn-danger btn-xs js-remove-element"><i class="fas fa-times"></i></button>`;
        c.innerHTML = `<div class="row"></div><div class="npress-page-builder-widget-toolbar">${btnHtml}</div>`;
        this.options.el.insertBefore(c, this.toolbarNode);
    }
}