((N) => {
    class SettingPage extends N.BaseAdminPage{
        constructor(){
            super();

            this.newItemBtn = document.querySelector('.js-new-item');
            this.dataWrapper = document.querySelector('.js-setting-page-wrapper');

            this.initTemplates();
            this.initEvents();

            this.search.element().addEventListener(N.SearchHandler.ON_AFTER_SEARCH_KEYUP, this.onSearch.bind(this));

            this.getData();
        }
        initTemplates(){
            Twig.twig({ id: 'setting-page-data-template', href: "/js/templates/setting-page-data-template.twig", async: false });
            Twig.twig({ id: 'add-edit-setting-modal-template', href: "/js/templates/add-edit-setting-modal-template.twig", async: false });
        }
        initEvents(){
            this.newItemBtn.addEventListener('click', this.onNewItemClick);
            N.live(this.dataWrapper, 'submit', 'form', this.onSaveSettingsClick.bind(this));
            N.live(this.dataWrapper, 'click', '.js-browse-media-btn', this.onBrowseForLogoClick.bind(this));
        }
        onSearch(e){
            this.getData(1, e.detail.query);
        }
        onBrowseForLogoClick(e, el){
            new N.MediaModal({
                filter: 'image',
                onSelect: event => {
                    el.parentElement.querySelector('.js-setting-image').setAttribute('src', event[0].uri);
                    el.parentElement.querySelector('input[name="site_logo"]').value = event[0].uri;
                }
            });
        }
        onSaveSettingsClick(e, el){
            e.preventDefault();
            N.api.settings.updateAll( N.serializeElementInputs(el), { form: el }).then((e)=>{
                new Noty({text: 'Settings updated', type: 'success' }).show();
                this.getData();
            }).catch((e)=>{
                new Noty({text: 'Error saving settings', type: 'error' }).show();
            });
        }

        onNewItemClick(e){
            e.preventDefault();
            new N.Modal({
                content: Twig.twig({ref: 'add-edit-setting-modal-template'}).render({ pages: [] }),
                title: 'Add setting',
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
                            if (!N.validateElInputs(modal.modalBody)){
                                return;
                            }
                            let requestData = N.serializeElementInputs(modal.modalBody);
                            N.api.settings.create(requestData, { form: modal.modalContent }).then((e)=>{
                                modal.onCloseModal();
                                getData();
                            }).catch((e)=>{
                                new Noty({text: 'Error creating item'}).show();
                            });
                        }
                    }
                ]
            });
        }
        getData(page = 1, query = false){
            N.api.settings.get({ query: query, page: page }).then((response) => this.renderData(response));
        }
        renderData(response){
            this.dataWrapper.innerHTML = Twig.twig({ref: 'setting-page-data-template'}).render({ data: response.data });
            this.updateHistory();
            N.refreshTooltips();
            CodeMirror.fromTextArea(document.querySelector('textarea[name="google_analytics_script"]'), {
                lineNumbers: true,
                extraKeys: {"Ctrl-Space": "autocomplete"},
                mode: {name: "javascript", globalVars: true},
                foldGutter: true,
                gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
            });
        }
    }

    new SettingPage();

})(NPress)