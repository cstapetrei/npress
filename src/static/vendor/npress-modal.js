var NPress = NPress || {};

NPress.Modal = class NPressModal{
    constructor(options){
        this.options = options || {};

        this.modalHeader = document.createElement('div');
        this.modalHeader.classList.add('modal-header');
        this.modalHeader.appendChild(NPress.node('<span>'+(options.title || '')+'</span>'));

        let closeBtn = NPress.node('<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>');
        this.modalHeader.appendChild(closeBtn);

        this.modalBody = document.createElement('div');
        this.modalBody.classList.add('modal-body');
        this.modalBody.innerHTML = options.content || '';

        this.modalFooter = document.createElement('div');
        this.modalFooter.classList.add('modal-footer');

        this.buttonList = [];
        let btn;
        if (!options.buttons){
            btn = NPress.node('<button type="button" class="btn btn-primary" data-dismiss="modal" aria-label="Close"><span>Close</span></button>');
            this.buttonList.push(btn);
            this.modalFooter.appendChild();
        } else {
            options.buttons.forEach( (element) => {
                btn = NPress.node('<button type="button" class="'+element.className+'"><span>'+element.label+'</span></button>');
                btn.addEventListener('click', (e) => {
                    if (element.onClick){
                        element.onClick(e, this);
                    } else {
                        this.onCloseModal();
                    }
                });
                this.buttonList.push(btn);
                this.modalFooter.appendChild(btn);
            });
        }
        this.modalContent = document.createElement('div');
        this.modalContent.classList.add('modal-content');
        this.modalContent.appendChild(this.modalHeader);
        this.modalContent.appendChild(this.modalBody);
        this.modalContent.appendChild(this.modalFooter);

        let dialog = document.createElement('div');
        dialog.classList.add('modal-dialog');
        if (['xs', 'md', 'lg', 'xl'].indexOf(options.size) !== -1){
            dialog.classList.add(`modal-${options.size}`);
        }
        dialog.appendChild(this.modalContent);

        this.modalBackdrop = document.createElement('div');
        this.modalBackdrop.classList.add('modal-backdrop','fade');

        this.wrapper = document.createElement('div');
        this.wrapper.appendChild(dialog);
        this.wrapper.classList.add('modal','fade');
        this.wrapper.classList.add('fade');
        if (options.className){
            this.wrapper.classList.add(options.className);
        }
        this.wrapper.setAttribute('role','dialog');
        this.wrapper.setAttribute('tabindex','-1');
        this.wrapper.appendChild(dialog);

        document.body.appendChild(this.modalBackdrop);
        document.body.appendChild(this.wrapper);

        NPress.live(this.wrapper, 'click', '[data-dismiss="modal"]', this.onCloseModal.bind(this));
        setTimeout(() => {
            this.show();
        },0);
        if (this.options.onInit){
            this.options.onInit(this);
        }
        return this;
    }
    onCloseModal(){
        this.dismiss();
        if (this.options.afterClose){
            this.options.afterClose(this);
        }
        setTimeout(() => {
            this.wrapper.remove();
            this.modalBackdrop.remove();
        },100);
    }
    show(){
        if (this.options.beforeShow){
            this.options.beforeShow(this);
        }
        this.wrapper.style.display = 'block';
        setTimeout(() => {
            this.modalBackdrop.classList.add('show');
            this.wrapper.classList.add('show');
        },50);
    }
    dismiss(){
        this.wrapper.classList.remove('show');
        this.modalBackdrop.classList.remove('show');
    }
    removeNodes(){
        this.wrapper.remove();
        this.modalBackdrop.remove();
    }
}

NPress.Confirm = class NPressConfirm{
    constructor(options){
        this.options = options || {};
        this.options.onDeny = this.options.onDeny || function(){};
        this.options.onConfirm = this.options.onConfirm || function(){};
        this.modal = new NPress.Modal({
            content: this.options.message || "Are you sure?",
            title: this.options.title || 'Confirm',
            buttons: [
                {
                    label: 'No',
                    className: 'btn btn-danger',
                    onClick: (e, modal) => {
                        this.options.onDeny(e, modal);
                        modal.onCloseModal();
                    }
                },
                {
                    label: 'Yes',
                    className: 'btn btn-success',
                    onClick: (e, modal) => {
                        this.options.onConfirm(e, modal);
                        modal.onCloseModal();
                    }
                }
            ]
        });
    }
}