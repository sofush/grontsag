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
}

export default ProductCollection;
