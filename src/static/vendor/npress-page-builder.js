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

        this.initEvents();
        this.load();
    }
    initEvents(){
        NPress.live(this.options.el, 'click', '.js-add-col', this.onAddColumn.bind(this));
        NPress.live(this.options.el, 'click', '.js-remove-element', this.onRemoveElement);
        NPress.live(this.options.el, 'click', '.js-add-container', this.onAddContainer.bind(this));
        NPress.live(this.options.el, 'click', '.js-add-fluid-container', this.onAddContainer.bind(this));
        NPress.live(this.options.el, 'click', '.js-get-code', (e, el) => { e.preventDefault() });
        NPress.live(this.options.el, 'click', '.js-edit-element', this.onEditElement.bind(this));
        NPress.live(this.options.el, 'click', '.dropdown-menu a', this.onAddElement.bind(this));
    }
    onAddElement(e, el){
        e.preventDefault();
        let content = el.closest('[class^="col-"]').querySelector('.col-content');
        let type = el.getAttribute('data-widget-type');
        if (!type){
            return;
        }
        let div = document.createElement('div');
        div.className = 'npress-page-builder-widget';
        div.setAttribute('data-widget-type', type);
        switch(type){
            case 'text':
                div.innerHTML += 'Placeholder text';
                break;
            case 'file':
                div.innerHTML += '<img src="" class="img-fluid" alt="placeholder image" />';
                break;
            case 'code':
                div.innerHTML += '<code>Placeholder text</code>';
                break;
        }
        let toolbarHtml = this.getToolbarHtml(type);
        div.innerHTML = `<div class="npress-page-builder-widget-content">${div.innerHTML}</div>${toolbarHtml}`;
        content.appendChild(div);
    }

    onEditElement(e, el){
        e.preventDefault();
        let content = el.closest('.npress-page-builder-widget').querySelector('.npress-page-builder-widget-content');
        let type = el.getAttribute('data-widget-type');
        if (!type){
            return;
        }
        switch(type){
            case 'text':
                new NPress.Modal({
                    content: `<textarea name="widget_content">${content.innerHTML}</textarea>`,
                    title: 'Edit',
                    size: 'xl',
                    buttons: [
                        {
                            label: 'Cancel',
                            className: 'btn btn-info'
                        },
                        {
                            label: 'Save',
                            className: 'btn btn-primary',
                            onClick: (e, modal) => {
                                content.innerHTML = modal.modalBody.querySelector('textarea[name="widget_content"]').value;
                                modal.onCloseModal();
                            }
                        }
                    ],
                    onInit: (instance) => {
                        this.editor = new Jodit('textarea[name="widget_content"]', {
                            height: 200
                        });
                    }
                });
                break;
            case 'file':
                new NPress.MediaModal({
                    onSelect: event => {
                        let selectedFile = event[0];
                        if (parseInt(selectedFile.isImage)){
                            content.innerHTML = `<img class="img-fluid" src="${selectedFile.uri}" title="${selectedFile.htmlTitle}" alt="${selectedFile.htmlAlt}"/>`;
                        } else if (parseInt(selectedFile.isAudio)) {
                            content.innerHTML = `<audio class="img-fluid" controls src="${selectedFile.uri}" title="${selectedFile.htmlTitle}"/>`;
                        } else if (parseInt(selectedFile.isVideo)) {
                            content.innerHTML = `<video class="img-fluid" controls src="${selectedFile.uri}" title="${selectedFile.htmlTitle}"/>`;
                        } else {
                            content.innerHTML = `<a href="${selectedFile.uri}" title="${selectedFile.htmlTitle}"/>`;
                        }
                    }
                });
                break;
            case 'code':
                let widgetCodeMirror;
                new NPress.Modal({
                    content: `<textarea name="widget_content">${content.innerHTML}</textarea>`,
                    title: 'Edit',
                    size: 'xl',
                    buttons: [
                        {
                            label: 'Cancel',
                            className: 'btn btn-info'
                        },
                        {
                            label: 'Save',
                            className: 'btn btn-primary',
                            onClick: (e, modal) => {
                                content.innerHTML = widgetCodeMirror.getValue();
                                modal.onCloseModal();
                            }
                        }
                    ],
                    onInit: (instance) => {
                        setTimeout(() => {
                            widgetCodeMirror = CodeMirror.fromTextArea(instance.modalBody.querySelector('textarea[name="widget_content"]'), {
                                lineNumbers: true,
                                extraKeys: {"Ctrl-Space": "autocomplete"},
                                mode: {name: "xml", globalVars: true},
                                htmlMode: true,
                                foldGutter: true,
                                gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
                            });
                        }, 200);
                    }
                });
                break;
        }
    }

    onRemoveElement(e, el){
        let widget = el.closest('[data-widget-type]');
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
    }
    onAddColumn(e, el){
        e.preventDefault();
        let colClass = el.getAttribute("data-class");
        let r = el.closest('.npress-page-builder-widget-toolbar').parentNode.querySelector('.row');
        let div = document.createElement('div');
        div.className = `col-${colClass}`;
        let toolbarHtml = this.getToolbarHtml('column');
        div.innerHTML = `<div class="npress-page-builder-widget col-content"></div>${toolbarHtml}`;
        div.setAttribute('data-widget-type', 'column');
        r.appendChild(div);
    }
    onAddContainer(e, el){
        e.preventDefault();
        let containerClass = el.getAttribute("data-class");
        let div = document.createElement('div');
        div.className = `${containerClass} npress-page-builder-widget`;
        let btnHtml = this.getToolbarHtml('container');
        div.innerHTML = `<div class="row"></div>${btnHtml}`;
        div.setAttribute('data-widget-type', 'container');
        this.options.el.insertBefore(div, this.toolbarNode);
    }
    getToolbarHtml(widgetType = ''){
        let result = '';
        if (!widgetType){
            return result;
        }
        switch(widgetType){
            case 'container':
                for (let i = 1; i <= Array(12).length; i++){
                    result += `<button class="btn btn-default btn-xs js-add-col mx-1" data-class="${i}">${i}/12</button>`;
                }
                result += `
                <button class="btn btn-default btn-xs js-move-element" data-widget-type="${widgetType}"><i class="fas fa-arrows-alt"></i></button>
                <button class="btn btn-danger btn-xs js-remove-element"><i class="fas fa-times"></i></button>`;
                break;
            case 'column':
                result = `
                <div class="dropdown">
                    <button class="btn btn-default btn-xs" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i class="fas fa-plus"></i>
                    </button>
                    <div class="dropdown-menu">
                        <a class="dropdown-item" href="#" data-widget-type="text">Text</a>
                        <a class="dropdown-item" href="#" data-widget-type="file">File</a>
                        <a class="dropdown-item" href="#" data-widget-type="code">Code</a>
                    </div>
                </div>
                <button class="btn btn-default btn-xs js-move-element" data-widget-type="${widgetType}"><i class="fas fa-arrows-alt"></i></button>
                <button class="btn btn-danger btn-xs js-remove-element" data-is-column="1"><i class="fas fa-times"></i></button>`;
                break;
            case 'text':
            case 'file':
            case 'code':
                result = `
                <button class="btn btn-default btn-xs js-edit-element" data-widget-type="${widgetType}"><i class="fas fa-edit"></i></button>
                <button class="btn btn-default btn-xs js-move-element" data-widget-type="${widgetType}"><i class="fas fa-arrows-alt"></i></button>
                <button class="btn btn-danger btn-xs js-remove-element" data-is-element="1"><i class="fas fa-times"></i></button>`;
                break;
        }
        return `<div class="npress-page-builder-widget-toolbar">${result}</div>`;
    }
    getHtml(){
        let copy = this.options.el.cloneNode(true);
        copy.querySelectorAll('.npress-page-builder-widget-toolbar').forEach( item => item.remove() );
        return copy.innerHTML;
    }
    load(){
        this.options.el.querySelectorAll('[data-widget-type]').forEach(element => {
            let type = element.getAttribute('data-widget-type');
            let toolbarNode = NPress.node(this.getToolbarHtml(type));
            element.appendChild(toolbarNode);
        });

        Sortable.create(this.options.el, { handle: '.js-move-element', animation: 150 });
    }
}