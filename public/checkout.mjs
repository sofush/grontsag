import Notification from './notification.jsx';

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
            const notif = new Notification({
                title: 'Status på omdirigering',
                content: 'Omdirigere dig til en betalingsside.',
                state: 'waiting',
            });

            const order = await createNewOrder(session);

            if (!order) {
                notif.update({
                    content: 'Kunne ikke oprette din ordre.',
                    state: 'error',
                });
            }

            const checkoutSession = await createCheckoutSession(session, order);

            if (!order) {
                notif.update({
                    content: 'Kunne ikke oprette betalingsside.',
                    state: 'error',
                });
            }

            window.location.replace(checkoutSession.url);
        });
    }
};

