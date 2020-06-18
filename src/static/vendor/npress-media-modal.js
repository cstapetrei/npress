var NPress = NPress || {};

NPress.MediaModal = class MediaModal{
    static MODE_SINGLE_SELECTION = 1;
    static MODE_MULTIPLE_SELECTION = 2;
    constructor(options){
        this.options = Object.assign({
            mode: MediaModal.MODE_SINGLE_SELECTION,
            filter: false,
            onSelect: function(){}
        }, options);
        this.mediaModalTpl = Twig.twig({
            href: "/js/templates/media-modal-template.twig",
            async: false
        });
        this.mediaModalContentTpl = Twig.twig({
            href: "/js/templates/media-modal-content-template.twig",
            async: false
        });
        this.modal = null;
        this.getData();
        return this;
    }
    getData(){
        NPress.api.files.get({ form: document.body }).then( (response) => {
            this.render(response.data);
        });
    }
    render(data){
        let self = this;
        this.modal = new NPress.Modal({
            content: this.mediaModalTpl.render({ data: data, mode: this.options.mode, filter: this.options.filter }),
            title: 'Select file',
            className: 'npress-media-modal',
            size: 'xl',
            buttons: [
                {
                    label: 'Cancel',
                    className: 'btn btn-info'
                },
                {
                    label: 'Select',
                    className: 'btn btn-primary',
                    onClick: (e, modal) => {
                        this.options.onSelect.call(this, Array.from(modal.modalContent.querySelectorAll('.js-media-modal-img-input:checked')).map( item => {
                            return {
                                isImage: item.getAttribute('data-is-image'),
                                isAudio: item.getAttribute('data-is-audio'),
                                isVideo: item.getAttribute('data-is-video'),
                                name: item.getAttribute('data-name'),
                                type: item.getAttribute('data-type'),
                                uri: item.value
                            }
                        } ));
                        modal.onCloseModal();
                    }
                }
            ],
            onInit(modal){
                NPress.refreshTooltips();
                let search = new NPress.SearchHandler({
                    el: modal.modalBody.querySelector('input[type="search"]')
                });
                if (search){
                    let content = modal.modalBody.querySelector('.js-media-modal-results');
                    search.element().addEventListener(NPress.SearchHandler.ON_AFTER_SEARCH_KEYUP, (e) => {
                        NPress.api.files.get({ query: e.detail.query, form: content }).then( (response) => {
                            content.innerHTML = self.mediaModalContentTpl.render({ data: response.data, mode: self.options.mode, filter: self.options.filter });
                            NPress.refreshTooltips();
                        });
                    });
                }
            }
        });
    }
}