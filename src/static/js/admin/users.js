((N) => {

    class UsersPage extends N.BaseAdminPage{
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
            Twig.twig({ id: 'user-table-template', href: "/js/templates/user-table-template.twig", async: false });
            Twig.twig({ id: 'add-edit-user-modal-template', href: "/js/templates/add-edit-user-modal-template.twig", async: false });
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
            N.api.users.get({ query: query, page: page, form: this.dataTableWrapper }).then((response) => {
                this.currentPageData = {};
                for(let i in response.data){
                    let user = response.data[i];
                    this.currentPageData[user.id] = user;
                }
                this.renderData(response);
            });
        }
        renderData(response){
            this.currentFetchedItemCount = response.count;
            this.dataTableWrapper.innerHTML = Twig.twig({ref: 'user-table-template'}).render({ data: response.data });
            this.paginator.setTotalCount(response.total);
            this.updateHistory();
            NPress.refreshTooltips();
        }
        onDeleteItemClick(e, el){
            let rowId = el.getAttribute('data-id');
            if (!rowId){
                return;
            }
            new N.Confirm({
                message: 'Delete user?',
                onConfirm: (e, modal) => {
                    N.api.users.delete({ id: rowId }, { form: this.dataTableWrapper }).then(() => {
                        this.getData( this.currentFetchedItemCount == 1 ? this.paginator.options.currentPage - 1 : this.paginator.options.currentPage );
                    });
                }
            });
        }
        onEditItemClick(e, el){
            let rowId = el.getAttribute('data-id');
            if (!rowId){
                return;
            }
            const onEditItemSubmitClick = (e, modal) => {
                let requestData = NPress.serializeElementInputs(modal.modalBody);
                NPress.api.users.update(requestData, { form: modal.modalContent }).then((e)=>{
                    modal.onCloseModal();
                    this.getData(this.paginator.options.currentPage);
                }).catch((e)=>{
                    new Noty({text: 'Error updating user'}).show();
                });
            };

            new N.Modal({
                content: Twig.twig({ref: 'add-edit-user-modal-template'}).render({ data: this.currentPageData[rowId] }),
                title: 'Edit user',
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
                onInit: this.initModalCalendars
            });
        }
        onNewItemClick(e){
            e.preventDefault();

            const onNewItemSubmitClick = (e, modal) => {
                let requestData = NPress.serializeElementInputs(modal.modalBody);
                NPress.api.users.create(requestData, { form: modal.modalContent }).then((e)=>{
                    modal.onCloseModal();
                    this.getData( this.currentFetchedItemCount == this.paginator.options.itemsPerPage ? this.paginator.options.currentPage + 1 : this.paginator.options.currentPage );
                }).catch((e)=>{
                    new Noty({text: 'Error creating user'}).show();
                });
            };

            new N.Modal({
                content: Twig.twig({ref: 'add-edit-user-modal-template'}).render(),
                title: 'Add user',
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
                onInit: this.initModalCalendars
            });
        }
        initModalCalendars(instance){
            flatpickr(instance.modalBody.querySelectorAll("[data-calendar]"), {});
        }
    }

    new UsersPage();

})(NPress)