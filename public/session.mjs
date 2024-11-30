import Cookies from './cookies.mjs';
import Notification from './notification.jsx';

class Session {
    constructor() {
        this.jwt = this.#fetchJwt();
    }

    async get() {
        return await this.jwt;
    }

    async attemptLogin(email, password) {
        const bodyContent = JSON.stringify({
            email: email,
            password: password,
        });

        const notif = new Notification({
            title: 'Status på log ind',
            content: 'Arbejder på at logge dig ind.',
            state: 'waiting',
        });

        const header = await fetch('/api/login', {
            method: 'POST',
            headers: new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }),
            body: bodyContent
        });

        if (!header.ok) {
            notif.update({
                content: 'Kunne ikke logge dig ind.',
                state: 'error',
                closeMs: 3000,
            });
            console.error('POST /api/login returned error');
            return false;
        }

        notif.update({
            content: 'Du er nu logget ind.',
            state: 'success',
            closeMs: 3000,
        });

        const res = await header.json();
        Cookies.set('jwt', res.jwt);
        this.jwt = this.#fetchJwt();
        return true;
    }

    async updateUser(email, password) {
        const bodyContent = JSON.stringify({
            email: email,
            password: password,
        });

        const notif = new Notification({
            title: 'Status på oprettelse',
            content: 'Arbejder på at oprette dig.',
            state: 'waiting',
        });

        const header = await fetch('/api/user', {
            method: 'PATCH',
            headers: new Headers({
                'Accept': 'application/json',
                'Authorization': await this.jwt,
                'Content-Type': 'application/json'
            }),
            body: bodyContent
        });

        if (!header.ok) {
            notif.update({
                content: 'Kunne ikke oprette dig.',
                state: 'error',
                closeMs: 3000,
            });
            console.error('PATCH /api/user returned error');
            return false;
        }

        notif.update({
            content: 'Du er nu oprettet.',
            state: 'success',
            closeMs: 3000,
        });

        const res = await header.json();
        Cookies.set('jwt', res.jwt);
        this.jwt = this.#fetchJwt();
        return true;
    }

    async logout() {
        Cookies.set('jwt', '');
        this.jwt = this.#fetchJwt(true);
    }

    async #fetchJwt(isLogout) {
        const cookie = Cookies.get('jwt');

        if (cookie)
            return cookie;

        const notif = new Notification({
            title: 'Status på log ud',
            content: 'Arbejder på at logge dig ud.',
            state: 'waiting',
            closeMs: 3000,
        });

        const header = await fetch('/api/user/new');

        if (!header.ok) {
            notif.update({
                content: 'Kunne ikke logge dig ud.',
                state: 'error',
                closeMs: 3000,
            });
            console.error(`Could not reach /api/user/new`);
            return;
        }

        const response = await header.json();

        if (!response.jwt) {
            notif.update({
                content: 'Kunne ikke logge dig ud.',
                state: 'error',
                closeMs: 3000,
            });
            console.error(`Response from /api/user/new does not have a JWT`);
            return;
        }

        notif.update({
            content: 'Du er nu logget ud.',
            state: 'success',
            closeMs: 3000,
        });

        console.log('Got JWT from the server, saving as cookie...');
        Cookies.set('jwt', response.jwt);
        return response.jwt;
    }
}

export default Session;
