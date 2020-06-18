((N) => {

    class CommentsPage{
        constructor(){
            this.newItemBtn = document.querySelector('.js-new-item');
            this.pageSelect = document.querySelector('.js-page-select');
            this.dataTableWrapper = document.querySelector('.js-comments-data-wrapper')
            this.pageData = [];

            this.initTemplates();
            this.initEvents();
            this.getPages();
        }
        initTemplates(){
            Twig.twig({ id: 'page-select-options-template', href: "/js/templates/page-select-options-template.twig", async: false });
            Twig.twig({ id: 'add-edit-comment-modal-template', href: "/js/templates/add-edit-comment-modal-template.twig", async: false });
            Twig.twig({ id: 'single-comment-template', href: "/js/templates/single-comment-template.twig", async: false });
            Twig.twig({ id: 'single-comment-form-template', href: "/js/templates/single-comment-form-template.twig", async: false });
        }
        initEvents(){
            this.newItemBtn.addEventListener('click', this.onNewItemClick.bind(this));
            this.pageSelect.addEventListener('change', this.onPageSelectChange.bind(this));
            N.live(this.dataTableWrapper,'click','.js-delete', this.onDeleteComment.bind(this));
            N.live(this.dataTableWrapper,'click','.js-add-reply', this.onAddReply.bind(this));
            N.live(this.dataTableWrapper,'click','.js-edit', this.onEditComment.bind(this));

        }
        getPages(){
            N.api.pages.get({ perPage: 0, form: this.newItemBtn }).then((response) => {
                this.pageData = response.data;
                this.newItemBtn.disabled = false;
                this.renderPageSelect();
            });
        }
        renderPageSelect(){
            let valueBeforeRender = this.pageSelect.value;
            this.pageSelect.innerHTML = Twig.twig({ref: 'page-select-options-template'}).render({ data: this.pageData });
            if (valueBeforeRender){
                this.pageSelect.value = valueBeforeRender;
                this.pageSelect.dispatchEvent(new Event('change'));
            }
        }
        onPageSelectChange(e){
            N.api.pages.getComments({ pageId: e.target.value, form: this.dataTableWrapper }).then((response)=>{
                this.dataTableWrapper.innerHTML = '';
                let html = '';
                for (const c of response.data){
                    html += Twig.twig({ref: 'single-comment-template'}).render({ data: c })
                }
                this.dataTableWrapper.innerHTML = html;
                NPress.refreshTooltips();
            }).catch((e)=>{
                new Noty({text: 'Error getting comments'});
            });
        }
        onNewItemClick(e){
            e.preventDefault();
            this.openModal({ modalTitle: 'Add reply', data: { page_id: this.pageSelect.value }, pages: this.pageData }, (e, modal) => {
                let requestData = NPress.serializeElementInputs(modal.modalBody);
                NPress.api.comments.create(requestData, { form: modal.modalContent }).then((e)=>{
                    modal.onCloseModal();
                    this.pageSelect.dispatchEvent(new Event('change'));
                }).catch((e)=>{
                    new Noty({text: 'Error creating item'});
                });
            });
        }
        onDeleteComment(e, el){
            let rowId = el.getAttribute('data-id');
            if (!rowId){
                return;
            }
            new N.Confirm({
                message: 'Delete comment?',
                onConfirm: (e, modal) => {
                    N.api.comments.delete({ id: rowId }, { form: this.dataTableWrapper }).then(() => {
                        this.pageSelect.dispatchEvent(new Event('change'));
                    });
                 }
            });
        }
        onAddReply(e, el){
            let rowId = el.getAttribute('data-id');
            this.openModal({ modalTitle: 'Add reply', data: { parent_id: rowId, page_id: this.pageSelect.value }, pages: this.pageData }, (e, modal) => {
                let requestData = NPress.serializeElementInputs(modal.modalBody);
                NPress.api.comments.create(requestData, { form: modal.modalContent }).then((e)=>{
                    modal.onCloseModal();
                    this.pageSelect.dispatchEvent(new Event('change'));
                }).catch((e)=>{
                    new Noty({text: 'Error creating item'});
                });
            });
        }
        onEditComment(e, el){
            let rowId = el.getAttribute('data-id');
            let form = el.closest('form');
            let rowData = false;
            try {
                rowData = JSON.parse(form.getAttribute('data-comment'));
            } catch(e){}
            if (!rowId || !rowData){
                return;
            }
            let self = this;
            let initialPageId = rowData.page_id;
            let initialCreatedAt = rowData.created_at;
            this.openModal({ modalTitle: 'Edit comment', data: rowData, pages: this.pageData }, (e, modal) => {
                let requestData = NPress.serializeElementInputs(modal.modalBody);
                NPress.api.comments.update(requestData, { form: modal.modalContent }).then((response)=>{
                    modal.onCloseModal();
                    if (initialPageId == requestData.page_id && initialCreatedAt == requestData.created_at){
                        let newNode = N.node(Twig.twig({ref: 'single-comment-form-template'}).render({ data: response }));
                        form.replaceWith(newNode);
                    } else {
                        self.pageSelect.dispatchEvent(new Event('change'));
                    }
                }).catch((e)=>{
                    new Noty({text: 'Error updating comment'}).show();
                });
            });
        }
        openModal(data, submitCallback){
            new N.Modal({
                content: Twig.twig({ref: 'add-edit-comment-modal-template'}).render(data),
                title: data.modalTitle || 'Comment',
                size: 'xl',
                buttons: [
                    {
                        label: 'Cancel',
                        className: 'btn btn-info'
                    },
                    {
                        label: 'Save',
                        className: 'btn btn-primary',
                        onClick: submitCallback
                    }
                ],
                onInit: (instance) => {
                    const calendars = flatpickr(instance.modalBody.querySelectorAll("[data-calendar]"), {});
                }
            });
        }
    }

    new CommentsPage();

})(NPress)