((N) => {
    class DashboardPage{
        constructor(){
            this.usersBox = document.querySelector('.js-users-box');
            this.pagesBox = document.querySelector('.js-pages-box');
            this.filesBox = document.querySelector('.js-files-box');
            this.commentsBox = document.querySelector('.js-comments-box');
            this.codeblocksBox = document.querySelector('.js-codeblocks-box');
            this.menusBox = document.querySelector('.js-menus-box');
            this.getData();
        }
        getData(){
            if (this.usersBox){
                N.api.users.get({ page: 1, form: this.usersBox }).then((response) => {
                    let h = this.usersBox.querySelector('h3');
                    if (h) h.innerHTML = response.total;
                });
            }
            if (this.pagesBox){
                N.api.pages.get({ page: 1, form: this.pagesBox }).then((response) => {
                    let h = this.pagesBox.querySelector('h3');
                    if (h) h.innerHTML = response.total;
                });
            }
            if (this.filesBox){
                N.api.files.get({ page: 1, form: this.filesBox }).then((response) => {
                    let h = this.filesBox.querySelector('h3');
                    if (h) h.innerHTML = response.total;
                });
            }
            if (this.commentsBox){
                N.api.comments.get({ page: 1, form: this.commentsBox }).then((response) => {
                    let h = this.commentsBox.querySelector('h3');
                    if (h) h.innerHTML = response.total;
                });
            }
            if (this.codeblocksBox){
                N.api.codeblocks.get({ page: 1, form: this.codeblocksBox }).then((response) => {
                    let h = this.codeblocksBox.querySelector('h3');
                    if (h) h.innerHTML = response.total;
                });
            }
            if (this.menusBox){
                N.api.menus.get({ page: 1, form: this.menusBox }).then((response) => {
                    let h = this.menusBox.querySelector('h3');
                    if (h) h.innerHTML = response.total;
                });
            }
            N.refreshTooltips();
        }
    }

    new DashboardPage();

})(NPress)