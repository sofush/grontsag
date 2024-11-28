class OrderCollection {
    constructor(session) {
        this.session = session;
        this.#fetchOrders();
    }

    async get() {
        if (this.orders)
            return this.orders;

        this.orders = await this.#fetchOrders();
        return this.orders;
    }

    async #fetchOrders() {
        const header = await fetch('/api/orders', {
            headers: new Headers({
                'Authorization': await this.session.get(),
                'Accept': 'application/json',
            }),
        });

        if (!header.ok) {
            console.error(`Could not reach /api/orders`);
            return;
        }

        return await header.json();
    }
}

export default OrderCollection;
