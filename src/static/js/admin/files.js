((N) => {
    class FilesPage extends N.BaseAdminPage{
        constructor(){
            super();
            this.dataTableWrapper = document.querySelector('.js-data-table-wrapper')
            this.fetchedData = [];
            this.currentFetchedItemCount = 0;
            this.urlVars = N.getUrlVars();

            this.initTemplates();
            this.initEvents();

            this.paginator.element().addEventListener(N.Pagination.ON_AFTER_CHANGE_PAGE, this.onPageChange.bind(this));
            this.search.element().addEventListener(N.SearchHandler.ON_AFTER_SEARCH_KEYUP, this.onSearch.bind(this));
            this.onPageChange();
        }
        initTemplates(){
            Twig.twig({ id: 'file-table-template', href: "/js/templates/file-table-template.twig", async: false });
        }
        initEvents(){
            N.live(this.dataTableWrapper,'click','.js-delete', this.onDeleteItemClick.bind(this));
            N.live(this.dataTableWrapper,'focusout','form input[type="text"]', this.onFilePropertyChange.bind(this));
            Dropzone.options.fileUploadDropzone = {
                paramName: "file",
                maxFilesize: 64,
                success: function(file) {
                    let self = this;
                    new Noty({ text: `"${file.name}" uploaded`, timeout: 2000 }).show();
                    setTimeout(function(){
                        self.removeFile(file);
                    }, 2000);
                },
                error: function(err, errorMessage, xhr){
                    console.log(err, errorMessage, xhr);
                },
                queuecomplete: () => {
                    this.getData();
                }
            };
        }
        onPageChange(e){
            this.getData(( e && e.detail.page ) || 1, this.search.options.query);
        }
        onSearch(e){
            this.getData(1, e.detail.query);
        }
        getData(page = 1, query = false){
            N.api.files.get({ query: query, page: page, form: this.dataTableWrapper }).then(this.renderData.bind(this));
        }
        renderData(response){
            this.currentFetchedItemCount = response.count;
            this.dataTableWrapper.innerHTML = Twig.twig({ref: 'file-table-template'}).render({ data: response.data });
            this.paginator.setTotalCount(response.total);
            new LuminousGallery(document.querySelectorAll('[data-toggle="luminous"]'));
            this.updateHistory();
            NPress.refreshTooltips();
        }
        onDeleteItemClick(e, el){
            let fileId = el.getAttribute('data-id');
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
        onFilePropertyChange(e, el){
            let form = el.closest('form');
            let fileId = form.getAttribute('data-id');
            let initialValue = el.getAttribute('data-initial-value');
            if (el.value === initialValue || !fileId){
                return;
            }
            let requestData = N.serializeElementInputs(form);
            requestData.id = fileId;
            N.api.files.update(requestData, { form: form }).then(() => {
                new Noty({text: 'File updated', type: 'success' }).show();
            }).catch((e)=>{
                new Noty({text: 'Error updating file', type: 'error' }).show();
            });;
        }
    }

    new FilesPage();
})(NPress)