import Cookies from './cookies.mjs';

class Session {
    constructor() {
        this.jwt = this.#fetchJwt();
    }

    async get() {
        return await this.jwt;
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
