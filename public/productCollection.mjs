import Fuse from 'fuse.js';

class ProductCollection {
    constructor() {
        this.#fetchProducts();
    }

    async get() {
        if (this.products)
            return this.products;

        this.products = await this.#fetchProducts();
        return this.products;
    }

    async #fetchProducts() {
        const header = await fetch('/api/products');

        if (!header.ok) {
            console.error(`Could not reach /api/products`);
            return;
        }

        return await header.json();
    }

    register(product, el) {
        if (!this.elements)
            this.elements = [];

        product.el = el;
        this.elements.push(product);
    }

    sortByQuery(query) {
        if (!this.elements)
            return;

        if (query.trim().length === 0) {
            let count = 0;
            this.elements.forEach(product => {
                product.el.style.visibility = 'visible';
                product.el.style.order = count++;
            });
            return;
        }

        const fuse = new Fuse(this.elements, { keys: ['name'] });
        const matched = fuse.search(query).map(result => result.item);
        const nonMatched = this.elements.filter(product => !matched.includes(product));

        nonMatched.forEach(product => {
            product.el.style.visibility = 'collapse';
        });

        let count = 0;
        matched.forEach(product => {
            product.el.style.visibility = 'visible';
            product.el.style.order = count++;
        });
    }
}

export default ProductCollection;
