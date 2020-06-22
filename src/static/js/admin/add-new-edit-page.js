((N) => {
    class AddNewEditPage{
        constructor(){
            this.editMode = false;
            let formSelector = '.js-add-new-page-form';
            if (document.body.classList.contains('edit-page')){
                this.editMode = true;
                formSelector = '.js-edit-page-form';
            }
            this.form = document.querySelector(formSelector);
            if (!this.form){
                return;
            }

            this.editor = new Jodit('textarea[name="content"]', {
                height: 500
            });

            this.cssCodeMirror = CodeMirror.fromTextArea(document.querySelector('.js-css-editor'), {
                lineNumbers: true,
                extraKeys: {"Ctrl-Space": "autocomplete"},
                mode: {name: "css", globalVars: true},
                foldGutter: true,
                gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
            });
            this.jsCodeMirror = CodeMirror.fromTextArea(document.querySelector('.js-javascript-editor'), {
                lineNumbers: true,
                extraKeys: {"Ctrl-Space": "autocomplete"},
                mode: {name: "javascript", globalVars: true},
                foldGutter: true,
                gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
            });
            this.sidebarCodeMirror = CodeMirror.fromTextArea(document.querySelector('.js-sidebar-textarea'), {
                lineNumbers: true,
                extraKeys: {"Ctrl-Space": "autocomplete"},
                mode: {name: "xml", globalVars: true},
                htmlMode: true,
                foldGutter: true,
                gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
            });

            this.headerContentCodeMirror = CodeMirror.fromTextArea(document.querySelector('textarea[name="header_content"]'), {
                lineNumbers: true,
                extraKeys: {"Ctrl-Space": "autocomplete"},
                mode: {name: "xml", globalVars: true},
                htmlMode: true,
                foldGutter: true,
                gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
            });

            flatpickr(document.querySelectorAll("[data-calendar]"), {});

            this.initEvents();
        }
        initEvents(){
            this.form.addEventListener('submit', this.onFormSubmit.bind(this));
            N.live(this.form, 'click', '.js-add-file', this.onAddMediaClick.bind(this));
            N.live(this.form, 'click', '#nav-custom-css-js-tab', (e) => {
                setTimeout((e) => {
                    this.cssCodeMirror.refresh();
                    this.jsCodeMirror.refresh();
                },200);
            });
            N.live(this.form, 'click', '#nav-sidebar-tab', (e) => {
                setTimeout((e) => {
                    this.sidebarCodeMirror.refresh();
                },200);
            });
            N.live(this.form, 'click', '#nav-header-tab', (e) => {
                setTimeout((e) => {
                    this.headerContentCodeMirror.refresh();
                },200);
            });
        }
        onFormSubmit(e){
            e.preventDefault();
            let requestData = N.serializeElementInputs(e.target);
            if (this.editMode){
                requestData.id = e.target.getAttribute('data-page-id');
                N.api.pages.editPage(requestData, { form: document.body }).then(this.onSubmitSuccess).catch(this.onSubmitError);
                return;
            }
            N.api.pages.createPage(requestData, { form: document.body }).then(this.onSubmitSuccess).catch(this.onSubmitError);
        }
        onSubmitSuccess(response){
            if (response){
                window.location = '/admin/pages';
            }
        }
        onSubmitError(error){
            new N.Modal({
                content: error
            })
        }
        onAddMediaClick(e){
            new N.MediaModal({
                onSelect: event => {
                    let selectedFile = event[0];
                    if (parseInt(selectedFile.isImage)){
                        this.editor.selection.insertHTML(`<img class="img-fluid" src="${selectedFile.uri}" />`);
                    } else if (parseInt(selectedFile.isAudio)) {
                        this.editor.selection.insertHTML(`<audio class="img-fluid" controls src="${selectedFile.uri}" />`);
                    } else if (parseInt(selectedFile.isVideo)) {
                        this.editor.selection.insertHTML(`<video class="img-fluid" controls src="${selectedFile.uri}" />`);
                    } else {
                        this.editor.selection.insertHTML(`<a href="${selectedFile.uri}" />`);
                    }
                }
            });
        }
    }

    new AddNewEditPage();

})(NPress)