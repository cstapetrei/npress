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
        NPress.live(this.options.el, 'click', '.js-remove-element', this.onRemoveElement);
        NPress.live(this.options.el, 'click', '.js-add-element', this.onAddElement);
    }
    onAddElement(e, el){
        e.preventDefault();
        let content = el.closest('[class^="col-"]').querySelector('.col-content');
        let modal = new NPress.Modal({
            content: `
                <label>Text<input type="radio" name="el" value="text"></label>
                <label>Image<input type="radio" name="el" value="img"></label>
                <label>Code<input type="radio" name="el" value="code"></label>
            `,
            title: 'Select element',
            buttons: [
                {
                    label: 'Cancel',
                    className: 'btn btn-info'
                },
                {
                    label: 'Select',
                    className: 'btn btn-primary',
                    onClick: (e, modal) => {
                        let inp = modal.modalBody.querySelector('input:checked');
                        if (inp){
                            let type = inp.value;
                            let div = document.createElement('div');
                            div.className = 'npress-page-builder-widget';
                            switch(type){
                                case 'text':
                                    div.innerHTML = 'Placeholder text';
                                    break;
                                case 'img':
                                    div.innerHTML = '<img src="" class="img-fluid" />';
                                    break;
                                case 'code':
                                    div.innerHTML = '<code>Placeholder text</code>';
                                    break;
                            }
                            content.appendChild(div);
                        }
                    }
                }
            ]
        });
    }
    onRemoveElement(e, el){
        let isColumn = el.getAttribute('data-is-column');
        let widget = el.closest('.npress-page-builder-widget');
        if (isColumn){
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
                <button class="btn btn-default btn-xs js-add-element"><i class="fas fa-plus"></i></button>
                <button class="btn btn-danger btn-xs js-remove-element" data-is-column="1"><i class="fas fa-times"></i></button>
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
            btnHtml += `<button class="btn btn-default btn-xs js-add-col mx-1" data-class="${i}">${i}/12</button>`;
        }
        btnHtml += `<button class="btn btn-danger btn-xs js-remove-element"><i class="fas fa-times"></i></button>`;
        c.innerHTML = `<div class="row"></div><div class="npress-page-builder-widget-toolbar">${btnHtml}</div>`;
        this.options.el.insertBefore(c, this.toolbarNode);
    }
}