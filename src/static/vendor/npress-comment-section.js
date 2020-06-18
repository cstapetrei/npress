var NPress = NPress || {};

NPress.CommentSection = class CommentSection{
    constructor(options = {}){
        this.el = options.el || document.querySelector('.js-comments-section');
        if (!this.el){
            return;
        }
        this.commentListEl = this.el.querySelector('.js-comment-list');
        this.commentForm = document.querySelector('form.js-comment-form');
        this.recaptchaEnabled = 0;
        if (this.commentForm){
            this.recaptchaEnabled = parseInt(this.commentForm.getAttribute('data-recaptcha-enabled'));
            let recaptchaSiteKeyInput = this.commentForm.querySelector('input[name="recaptcha_site_key"]');
            if (recaptchaSiteKeyInput){
                this.recaptchaSiteKey = recaptchaSiteKeyInput.value;
            }
            this.recaptchaContainer = this.commentForm.querySelector('.js-recaptcha-container');
            this.recaptchaEnabled = this.recaptchaEnabled && this.recaptchaSiteKey;
            if (this.recaptchaEnabled){
                this.initRecaptcha();
            }
        }
        this.initTemplates();
        this.initEvents();
        this.getData();
    }
    initTemplates(){
        Twig.twig({ id: 'public-single-comment-template', href: "/js/templates/public-single-comment-template.twig", async: false });
    }
    initRecaptcha(){
        let self = this;
        grecaptcha.ready(function() {
            self.recaptchaClientId = grecaptcha.render(self.recaptchaContainer, {
                'sitekey': self.recaptchaSiteKey,
                'badge': 'inline',
                'size': 'invisible'
            });
            NPress.trigger(self.commentForm, 'grecaptcha-execute');
        });
    }
    getData(){
        NPress.publicApi.pages.getComments({ pageId: document.body.getAttribute('data-page-id'), form: this.commentListEl }).then((response)=>{
            this.commentListEl.innerHTML = '';
            let html = '';
            for (const c of response.data){
                html += Twig.twig({ref: 'public-single-comment-template'}).render({ data: c })
            }
            this.commentListEl.innerHTML = html;
        }).catch((e)=>{
            new Noty({text: 'Error getting comments'});
        });
    }
    initEvents(){
        if (this.el){

        }
        if (this.commentForm){
            this.commentForm.addEventListener('submit', this.onCommentFormSubmit.bind(this));
            this.commentForm.addEventListener('grecaptcha-execute', this.onCommentFormRecaptchaExecute.bind(this));
        }
    }
    onCommentFormRecaptchaExecute(event){
        let self = this;
        let commentFormAddItem = self.commentForm.querySelector('#comment-form-add-item');
        NPress.addLoaderTo(commentFormAddItem);
        grecaptcha.execute(self.recaptchaClientId, {action: 'comment'}).always(function (token) {
            NPress.removeLoaderFrom(commentFormAddItem);
        });
    }
    onCommentFormSubmit(event){
        let self = this;
        let form = event.target;
        event.preventDefault();
        NPress.publicApi.comments.create(NPress.serializeElementInputs(form), { form: form }).then((e)=>{
            new Noty({text: 'Comment submitted for approval', type: 'success'}).show();
            NPress.clearErrors(form);
            form.reset();
            if (self.recaptchaEnabled){
                NPress.trigger(self.commentForm, 'grecaptcha-execute');
            }
        }).catch((e)=>{
            new Noty({text: 'Error submitting comment', type: 'error'}).show();
            if (self.recaptchaEnabled && e.errors[0]){
                switch(e.errors[0]){
                    case "invalid-recaptcha-score":
                        // grecaptcha.render(self.recaptchaContainer);
                        break;
                    default:
                        NPress.trigger(self.commentForm, 'grecaptcha-execute');
                        break;
                }
            }
        });
    }
}

document.addEventListener('DOMContentLoaded',() => {
    new NPress.CommentSection();
});