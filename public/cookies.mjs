class Cookies {
    static set(name, value, options = {}) {
        let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
        cookie += `; samesite=${options.samesite ?? 'Strict'}`;
        document.cookie = cookie;
        console.log(`Wrote cookie: ${cookie}`);
    }

    static get(key) {
        const cookies = document.cookie.split(';');

        for (let cookie of cookies) {
            cookie = cookie.trim();

            if (cookie.startsWith(encodeURIComponent(key) + '=')) {
                const value = decodeURIComponent(cookie.substring(key.length + 1));
                console.log(`Read cookie: ${key}=${value}`);
                return value;
            }
        }

        return null;
    }
}

export default Cookies;
