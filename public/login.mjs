class Login {
    constructor(session, callback) {
        this.session = session;
        this.callback = callback;

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.#addEventHandlers());
        } else {
            this.#addEventHandlers();
        }
    }

    #addEventHandlers() {
        const popupCloseEl = document.getElementById('popup-close');
        const popupContainerEl = document.getElementById('popup-container');
        const navbarLoginEl = document.getElementById('navbar-login');
        const navbarLogoutEl = document.getElementById('navbar-logout');
        const popupBackgroundEl = document.getElementById('popup-background');
        const popupLoginButtonEl = document.getElementById('popup-login-button');
        const emailInputEl = document.getElementById('email');
        const passwordInputEl = document.getElementById('password');
        const noticeEl = document.getElementById('invalid-credentials-notice');

        const openPopup = () => {
            popupContainerEl.classList.remove('hidden');
        };

        const closePopup = () => {
            popupContainerEl.classList.add('hidden');
        };

        navbarLoginEl.addEventListener('click', openPopup);
        navbarLogoutEl.addEventListener('click', () => this.#logout());
        popupCloseEl.addEventListener('click', closePopup);
        popupBackgroundEl.addEventListener('click', closePopup);
        popupLoginButtonEl.addEventListener('click', async () => {
            const emailStr = emailInputEl.value;
            const passwordStr = passwordInputEl.value;

            if (await this.#login(emailStr, passwordStr)) {
                emailInputEl.value = '';
                passwordInputEl.value = '';
                noticeEl.classList.add('hidden');
                closePopup();
            } else {
                noticeEl.classList.remove('hidden');
            }
        });
    }

    async #login(email, password) {
        const res = await this.session.attemptLogin(email, password);

        if (res) {
            if (this.callback)
                this.callback();

            return true;
        }

        return false;
    }

    async #logout() {
        this.session.logout();

        if (this.callback)
            this.callback();
    }
}

export default Login;
