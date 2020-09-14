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

            this.paginator.element().addEventListener(N.Pagination.ON_AFTER_CHANGE_PAGE, this.onRefreshData.bind(this));
            this.paginator.element().addEventListener(N.Pagination.ON_AFTER_CHANGE_ITEMS_PER_PAGE, this.onRefreshData.bind(this));
            this.search.element().addEventListener(N.SearchHandler.ON_AFTER_SEARCH_KEYUP, this.onRefreshData.bind(this));
            this.sort.element().addEventListener(N.SortHandler.ON_AFTER_SORT_CLICKED, this.onRefreshData.bind(this));
            this.onRefreshData();
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
        onRefreshData(e){
            this.getData(this.paginator.options.currentPage, this.paginator.options.itemsPerPage, this.search.options.query, this.sort.getOrderString() );
        }
        getData(page = 1, itemsPerPage = 10, query = false, order = false){
            N.api.users.get({ query: query, page: page, perPage: itemsPerPage, order: order, form: this.dataTableWrapper }).then((response) => {
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
            this.dataTableWrapper.innerHTML = Twig.twig({ref: 'user-table-template'}).render({ data: response.data, sort: { column: this.sort.options.column, order: this.sort.options.sort } });
            this.paginator.setTotalCount(response.total);
            this.updateHistory();
            N.refreshTooltips();
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
                        this.onRefreshData();
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
                if (!N.validateElInputs(modal.modalBody)){
                    return;
                }
                let requestData = N.serializeElementInputs(modal.modalBody);
                N.api.users.update(requestData, { form: modal.modalContent }).then((e)=>{
                    modal.onCloseModal();
                    this.onRefreshData();
                }).catch((e)=>{
                    new Noty({text: 'Error updating user'}).show();
                });
            };

            new N.Modal({
                content: Twig.twig({ref: 'add-edit-user-modal-template'}).render({ data: this.currentPageData[rowId], available_acl_roles: NPress.availableAclRoles || [] }),
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
                if (!N.validateElInputs(modal.modalBody)){
                    return;
                }
                let requestData = N.serializeElementInputs(modal.modalBody);
                N.api.users.create(requestData, { form: modal.modalContent }).then((e)=>{
                    modal.onCloseModal();
                    this.onRefreshData();
                }).catch((e)=>{
                    new Noty({text: 'Error creating user'}).show();
                });
            };

            new N.Modal({
                content: Twig.twig({ref: 'add-edit-user-modal-template'}).render({ available_acl_roles: NPress.availableAclRoles || [] }),
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