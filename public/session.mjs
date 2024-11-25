import Cookies from './cookies.mjs';

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

        const header = await fetch('/api/login', {
            method: 'POST',
            headers: new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }),
            body: bodyContent
        });

        if (!header.ok) {
            console.error('POST /api/login returned error');
            return false;
        }

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
            console.error('PATCH /api/user returned error');
            return false;
        }

        const res = await header.json();
        Cookies.set('jwt', res.jwt);
        this.jwt = this.#fetchJwt();
        return true;
    }

    async logout() {
        Cookies.set('jwt', '');
        this.jwt = this.#fetchJwt();
    }

    async #fetchJwt() {
        const cookie = Cookies.get('jwt');

        if (cookie)
            return cookie;

        const header = await fetch('/api/user/new');

        if (!header.ok) {
            console.error(`Could not reach /api/user/new`);
            return;
        }

        const response = await header.json();

        if (!response.jwt) {
            console.error(`Response from /api/user/new does not have a JWT`);
            return;
        }

        console.log('Got JWT from the server, saving as cookie...');
        Cookies.set('jwt', response.jwt);
        return response.jwt;
    }
}

export default Session;
