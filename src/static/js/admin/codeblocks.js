((N) => {

    class CodeblocksPage extends N.BaseAdminPage{
        constructor(){
            super();
            this.dataTableWrapper = document.querySelector('.js-data-table-wrapper');
            this.newUserBtn = document.querySelector('.js-new-item');
            this.currentPageData = {}
            this.currentFetchedItemCount = 0;

            this.initTemplates();
            this.initEvents();

            this.paginator.element().addEventListener(N.Pagination.ON_AFTER_CHANGE_PAGE, this.onPageChange.bind(this));
            this.search.element().addEventListener(N.SearchHandler.ON_AFTER_SEARCH_KEYUP, this.onSearch.bind(this));
            this.onPageChange();
        }
        initTemplates(){
            Twig.twig({ id: 'codeblock-table-template', href: "/js/templates/codeblock-table-template.twig", async: false });
            Twig.twig({ id: 'add-edit-codeblock-modal-template', href: "/js/templates/add-edit-codeblock-modal-template.twig", async: false });
        }
        initEvents(){
            N.live(this.dataTableWrapper,'click','.js-delete', this.onDeleteItemClick.bind(this));
            N.live(this.dataTableWrapper,'click','.js-edit', this.onEditItemClick.bind(this));
            this.newUserBtn.addEventListener('click', this.onNewItemClick.bind(this));
        }
        onPageChange(e){
            this.getData(( e && e.detail.page ) || 1)
        }
        onSearch(e){
            this.getData(1, e.detail.query);
        }
        getData(page = 1, query = false){
            N.api.codeblocks.get({ query: query, page: page, form: this.dataTableWrapper }).then((response) => {
                this.currentPageData = {};
                for(let i in response.data){
                    this.currentPageData[response.data[i].id] = response.data[i];
                }
                this.renderData(response);
            });
        }
        renderData(response){
            this.currentFetchedItemCount = response.count;
            this.dataTableWrapper.innerHTML = Twig.twig({ref: 'codeblock-table-template'}).render({ data: response.data });
            this.paginator.setTotalCount(response.total);
            this.updateHistory();
            N.refreshTooltips();
            $('.card').CardWidget();
        }
        onDeleteItemClick(e, el){
            let rowId = el.getAttribute('data-id');
            if (!rowId){
                return;
            }
            new N.Confirm({
                message: 'Delete item?',
                onConfirm: (e, modal) => {
                    N.api.codeblocks.delete({ id: rowId }, { form: this.dataTableWrapper }).then(() => {
                        this.getData( this.currentFetchedItemCount == 1 ? this.paginator.options.currentPage - 1 : this.paginator.options.currentPage );
                    });
                }
            });
        }
        initCreateEditModalHandler(modal){
            setTimeout( () => {
                let contentTextarea = modal.modalBody.querySelector('textarea[name="content"]');
                modal.cm = CodeMirror.fromTextArea(contentTextarea, {
                    lineNumbers: true,
                    extraKeys: {"Ctrl-Space": "autocomplete"},
                    mode: {name: "html", globalVars: true},
                    foldGutter: true,
                    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
                });
            }, 100);
        }
        onEditItemClick(e, el){
            let rowId = el.getAttribute('data-id');
            if (!rowId){
                return;
            }
            let self = this;

            const onEditItemSubmitClick = (e, modal) => {
                modal.cm.save();
                let requestData = N.serializeElementInputs(modal.modalBody);
                N.api.codeblocks.update(requestData, { form: modal.modalContent }).then((e)=>{
                    modal.onCloseModal();
                    this.getData(this.paginator.options.currentPage);
                }).catch((e)=>{
                    new Noty({text: 'Error updating item'}).show();
                });
            };

            new N.Modal({
                content: Twig.twig({ref: 'add-edit-codeblock-modal-template'}).render({ data: this.currentPageData[rowId] }),
                title: 'Edit item',
                size: 'xl',
                buttons: [
                    {
                        label: 'Cancel',
                        className: 'btn btn-info'
                    },
                    {
                        label: 'Save',
                        className: 'btn btn-primary',
                        onClick: onEditItemSubmitClick.bind(this)
                    }
                ],
                onInit(modal){
                    self.initCreateEditModalHandler(modal);
                }
            });
        }
        onNewItemClick(e){
            let self = this;

            e.preventDefault();

            const onNewItemSubmitClick = (e, modal) => {
                modal.cm.save();
                let requestData = N.serializeElementInputs(modal.modalBody);
                N.api.codeblocks.create(requestData, { form: modal.modalContent }).then((e)=>{
                    modal.onCloseModal();
                    this.getData( this.currentFetchedItemCount == this.paginator.options.itemsPerPage ? this.paginator.options.currentPage + 1 : this.paginator.options.currentPage );
                }).catch((e)=>{
                    new Noty({text: 'Error creating item'}).show();
                });
            };

            new N.Modal({
                content: Twig.twig({ref: 'add-edit-codeblock-modal-template'}).render(),
                title: 'Add item',
                size: 'xl',
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
                ],
                onInit(modal){
                    self.initCreateEditModalHandler(modal);
                }
            });
        }
    }

    new CodeblocksPage();

})(NPress)