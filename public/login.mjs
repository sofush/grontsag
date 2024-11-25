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
        const popupCloseEls = document.getElementsByClassName('popup-close');
        const popupContainerEl = document.getElementById('popup-container');
        const navbarLoginEl = document.getElementById('navbar-login');
        const navbarLogoutEl = document.getElementById('navbar-logout');
        const popupBackgroundEl = document.getElementById('popup-background');
        const popupLoginButtonEl = document.getElementById('popup-login-button');
        const popupRegisterButtonEl = document.getElementById('popup-register-button');
        const invalidNoticeEl = document.getElementById('invalid-credentials-notice');
        const emailTakenNoticeEl = document.getElementById('email-taken-notice');
        const popupShowRegisterButtonEl = document.getElementById('popup-show-register-button');
        const popupBackButtonEl = document.getElementById('popup-back-button');
        const registerModalEl = document.getElementById('register-modal');
        const loginModalEl = document.getElementById('login-modal');

        const openPopup = () => {
            hideRegisterModal();
            popupContainerEl.classList.remove('hidden');
        };

        const closePopup = () =>
            popupContainerEl.classList.add('hidden');

        const showRegisterModal = () => {
            loginModalEl.classList.add('hidden');
            registerModalEl.classList.remove('hidden');
        };

        const hideRegisterModal = () => {
            registerModalEl.classList.add('hidden');
            loginModalEl.classList.remove('hidden');
        };

        const login = async () => {
            if (await this.#login()) {
                invalidNoticeEl.classList.add('hidden');
                closePopup();
            } else {
                invalidNoticeEl.classList.remove('hidden');
            }
        };

        const register = async () => {
            if (await this.#register()) {
                emailTakenNoticeEl.classList.add('hidden');
                closePopup();
            } else {
                emailTakenNoticeEl.classList.remove('hidden');
            }
        };

        Array.from(popupCloseEls)
            .forEach(e => e.addEventListener('click', closePopup));

        navbarLoginEl.addEventListener('click', openPopup);
        navbarLogoutEl.addEventListener('click', () => this.#logout());
        popupBackgroundEl.addEventListener('click', closePopup);
        popupLoginButtonEl.addEventListener('click', login);
        popupRegisterButtonEl.addEventListener('click', register);
        popupShowRegisterButtonEl.addEventListener('click', showRegisterModal);
        popupBackButtonEl.addEventListener('click', hideRegisterModal);
    }

    async #login() {
        const emailInputEl = document.getElementById('login-email');
        const passwordInputEl = document.getElementById('login-password');
        const email = emailInputEl.value;
        const password = passwordInputEl.value;
        const res = await this.session.attemptLogin(email, password);

        if (res && this.callback)
            this.callback();

        if (res) {
            emailInputEl.value = '';
            passwordInputEl.value = '';
        }

        return !!res;
    }

    async #register() {
        const emailInputEl = document.getElementById('register-email');
        const passwordInputEl = document.getElementById('register-password');
        const emailTakenNoticeEl = document.getElementById('');
        const email = emailInputEl.value;
        const password = passwordInputEl.value;
        const res = await this.session.updateUser(email, password);

        if (res && this.callback)
            this.callback();

        if (res) {
            emailInputEl.value = '';
            passwordInputEl.value = '';
        } else {
            const emailTakenNoticeEl = document.getElementById('email-taken-notice');
            emailTakenNoticeEl.classList.remove('hidden');
        }

        return !!res;
    }

    async #logout() {
        this.session.logout();

        if (this.callback)
            this.callback();
    }
}

export default Login;
