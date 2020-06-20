((N) => {

    class MenusPage{
        constructor(){
            this.dataWrapper = document.querySelector('.js-data-wrapper');
            this.menuSelect = document.querySelector('.js-menu-select');
            this.addPageItemAccordion = document.querySelector('.js-add-page-item-accordion');
            this.selectedMenuItemsEl = document.querySelector('.js-selected-menu-items');
            this.selectedMenuListGroup = false;
            this.newItemBtn = document.querySelector('.js-new-item');
            this.generatedIds = {},
            this.fetchedData = [];
            this.sorting = false;

            this.initTemplates();
            this.initEvents();
            this.getData();
            this.getPages();
        }
        initTemplates(){
            Twig.twig({ id: 'menu-list-template', href: "/js/templates/menu-list-template.twig", async: false });
            Twig.twig({ id: 'add-edit-menu-modal-template', href: "/js/templates/add-edit-menu-modal-template.twig" });
            Twig.twig({ id: 'selected-menu-items-template', href: "/js/templates/selected-menu-items-template.twig" });
            Twig.twig({ id: 'menu-list-item-template', href: "/js/templates/menu-list-item-template.twig" });
            Twig.twig({ id: 'menu-list-page-select-options-template', href: "/js/templates/menu-list-page-select-options-template.twig" });
        }
        initEvents(){
            this.newItemBtn.addEventListener('click', this.onNewItemClick.bind(this));
            N.live(this.selectedMenuItemsEl, 'click', '.js-delete-menu-item', this.onDeleteMenuItemClick.bind(this));
            N.live(this.selectedMenuItemsEl, 'click', '.js-set-default-menu', this.onSetDefaultMenuClick.bind(this));
            this.selectedMenuItemsEl.addEventListener('submit', this.onSelectedMenuItemsSubmit.bind(this));
            N.live(this.addPageItemAccordion,'submit', '.js-add-menu-item-form', this.onAddMenuItemSubmit.bind(this));
            this.menuSelect.addEventListener('change', this.onMenuSelectChange.bind(this));
        }
        onNewItemClick(e){
            e.preventDefault();

            const onNewItemSubmitClick = (e, modal) => {
                if (!N.validateElInputs(modal.modalBody)){
                    return;
                }
                let requestData = N.serializeElementInputs(modal.modalBody);
                N.api.menus.create(requestData, { form: modal.modalContent }).then((e)=>{
                    modal.onCloseModal();
                    this.getData();
                }).catch((e)=>{
                    new Noty({text: 'Error creating menu'}).show();
                });
            };

            new N.Modal({
                content: Twig.twig({ref: 'add-edit-menu-modal-template'}).render(),
                title: 'Add menu',
                buttons: [
                    {
                        label: 'Cancel',
                        className: 'btn btn-info'
                    },
                    {
                        label: 'Save',
                        className: 'btn btn-primary',
                        onClick: onNewItemSubmitClick.bind(this)
                    }
                ]
            });
        }
        onDeleteMenuItemClick(event, el){
            let parentEl = el.closest('[data-menu-item-id]');
            if (parentEl){
                parentEl.remove();
                delete this.generatedIds[parentEl.getAttribute('data-menu-item-id')];
            }
        }
        onSetDefaultMenuClick(event, el){
            let menuId = el.getAttribute('data-menu-id');
            if (!menuId){
                return;
            }
            N.api.menus.setAsDefault({ id: menuId }, {form: this.selectedMenuItemsEl }).then(() => {
                this.getData();
                new Noty({text: 'Menu set as default', type: 'success' }).show();
            });
        }
        onSelectedMenuItemsSubmit(e){
            e.preventDefault();
            let menuItemEls = e.target.querySelectorAll('.list-group-item[data-menu-item-id]');
            let requestData = {
                items : {}
            };
            menuItemEls.forEach( (item) => {
                let currentId = item.getAttribute('data-menu-item-id');
                let inputEls = item.querySelectorAll('[data-field-for="'+currentId+'"]');
                requestData.items[currentId] = {};
                inputEls.forEach( (inp) => {
                    requestData.items[currentId][inp.getAttribute('data-field')] = inp.value;
                });
            });
            requestData.menuId = this.selectedMenuListGroup.getAttribute('data-menu-id');
            N.api.menus.updateItems(requestData, { form: this.selectedMenuItemsEl }).then((e)=>{
                new Noty({text: 'Menu updated', type: 'success' }).show();
                this.getData();
            }).catch((e)=>{
                new Noty({text: 'Error updating menu', type: 'error' }).show();
            });
        }
        onAddMenuItemSubmit(event, el){
            event.preventDefault();
            let wrapper = this.selectedMenuItemsEl.querySelector('.list-group.nested-sortable');
            if (!wrapper){
                return;
            }
            let newItemData = {};
            switch(el.getAttribute('data-type')){
                case 'existing-page':
                    let select = el.elements.page;
                    let opt = select.options[select.selectedIndex];
                    if (!opt){
                        break;
                    }
                    newItemData = { label: opt.textContent, url: opt.getAttribute('data-uri') };
                    break;
                case 'custom-page':
                    if (!N.validateElInputs(el)){
                        return;
                    }
                    newItemData = { label: el.elements.label.value, url: el.elements.url.value };
                    break;
            }
            if (!newItemData.label || !newItemData.url){
                return;
            }

            let newId = N.randomString(64);
            while(this.generatedIds[newId]){
                newId = N.randomString(64);
            }
            this.generatedIds[newId] = 1;

            wrapper.innerHTML += Twig.twig({ref: 'menu-list-item-template'}).render({ data: newItemData, generatedId: newId });
            wrapper.setAttribute('data-children', parseInt(wrapper.getAttribute('data-children'))+1);
            this.initNestedSortables();
            this.updateOrderInputs(wrapper);
            el.reset();
        }
        onMenuSelectChange(e){
            let selectedId = parseInt(e.target.value);
            if (!selectedId){
                this.selectedMenuItemsEl.innerHTML = '';
                return;
            }
            this.selectedMenuItemsEl.innerHTML = Twig.twig({ref: 'selected-menu-items-template'}).render({ data: this.fetchedData[selectedId] });
            this.selectedMenuListGroup = this.selectedMenuItemsEl.querySelector('.js-selected-menu-list-group');
            this.initNestedSortables();
        }
        getData(){
            N.api.menus.get({ form: this.dataWrapper }).then((response) => {
                response.data.forEach( (item) => {
                    this.fetchedData[item.id] = item;
                });
                this.renderData(response);
            });
        }
        getPages(){
            N.api.pages.get({ perPage: 0, form: this.addPageItemAccordion }).then((response) => {
                let pageSelect = this.addPageItemAccordion.querySelector('.js-page-select');
                if (pageSelect){
                    pageSelect.innerHTML = Twig.twig({ref: 'menu-list-page-select-options-template'}).render({ data: response.data });
                    let fieldset = pageSelect.closest('fieldset');
                    if (fieldset){
                        fieldset.disabled = false;
                    }
                }
            });
        }
        renderData(response){
            let valueBeforeRender = this.menuSelect.value;
            this.menuSelect.innerHTML = Twig.twig({ref: 'menu-list-template'}).render({ data: response.data });
            if (valueBeforeRender){
                this.menuSelect.value = valueBeforeRender;
                this.menuSelect.dispatchEvent(new Event('change'));
            }
            N.refreshTooltips();
        }
        onDeleteItemClick(e, el){
            let fileId = el.getAttribute('data-file-id');
            if (!fileId){
                return;
            }
            new N.Confirm({
                message: 'Delete file?',
                onConfirm: (e, modal) => {
                    N.api.files.delete({ id: fileId }, { form: this.dataTableWrapper }).then(() => {
                        this.getData( this.currentFetchedItemCount == 1 ? this.paginator.options.currentPage - 1 : this.paginator.options.currentPage);
                    });
                 }
            });
        }
        initNestedSortables(){
            let self = this;
            let nestedSortables = this.selectedMenuItemsEl.querySelectorAll('.nested-sortable');
            for (var i = 0; i < nestedSortables.length; i++) {
                new Sortable(nestedSortables[i], {
                    group: 'nested',
                    animation: 150,
                    fallbackOnBody: true,
                    swapThreshold: 0.65,
                    filter: '.drag-info-message',
                    onStart: function() {
                        self.sorting = true;
                    },
                    onAdd: function (/**Event*/evt) {
                        // same properties as onEnd
                        evt.to.setAttribute('data-children', parseInt(evt.to.getAttribute('data-children'))+1);
                        self.updateOrderInputs(evt.to);
                    },
                    onUpdate: function (/**Event*/evt) {
                        self.updateOrderInputs(evt.from);
                    },
                    onRemove: function (/**Event*/evt) {
                        // same properties as onEnd
                        evt.from.setAttribute('data-children', parseInt(evt.from.getAttribute('data-children'))-1);
                        self.updateOrderInputs(evt.from);
                    },
                    onEnd: function (/**Event*/evt) {
                        self.sorting = false;
                        let parentInput = evt.item.querySelector('.js-parent-input');
                        if (evt.to === self.selectedMenuListGroup){
                            parentInput.value = '';
                        } else {
                            parentInput.value = evt.to.closest('[data-menu-item-id]').getAttribute('data-menu-item-id');
                        }
                    }
                });
            }
        }
        updateOrderInputs(el){
            let items = el.querySelectorAll(':scope > .list-group-item');
            items.forEach( (value, index) => {
                let inp = value.querySelector('[data-field="order"]');
                if (inp){
                    inp.value = index;
                }
            })
        }
    }

    new MenusPage();

})(NPress)