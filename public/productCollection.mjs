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

        const fuse = new Fuse(this.elements, { keys: ['name'] });
        const matched = fuse.search(query).map(result => result.item);
        const nonMatched = this.elements.filter(product => !matched.includes(product));
        const result = [...matched, ...nonMatched];

        let count = 0;
        result.forEach(product => {
            product.el.style.order = count++;
        });
    }
}

export default ProductCollection;
