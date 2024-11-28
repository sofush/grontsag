const createNewOrder = async (session) => {
    const header = await fetch('/api/order/new', {
        method: 'GET',
        headers: new Headers({
            'Authorization': await session.get(),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        })
    });

    if (!header.ok) {
        console.error('Could not GET /api/order/new');
        return;
    }

    return await header.json();
};

export const createCheckoutSession = async (session, order) => {
    const header = await fetch('/api/order/pay', {
        method: 'POST',
        headers: new Headers({
            'Authorization': await session.get(),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
            orderId: order.id
        }),
    });

    if (!header.ok) {
        console.error('Could not GET /api/order/pay');
        return;
    }

    return await header.json();
};

export const setupCheckout = (session) => {
    const checkoutButtonEls = document.getElementsByClassName('checkout-button');

    for (let index = 0; index < checkoutButtonEls.length; index++) {
        const checkoutButtonEl = checkoutButtonEls[index];
        checkoutButtonEl.addEventListener('click', async () => {
            const order = await createNewOrder(session);
            const checkoutSession = await createCheckoutSession(session, order);
            window.location.replace(checkoutSession.url);
        });
    }
};

