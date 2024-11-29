/** @jsx h */
import h from 'vhtml';
import { jwtDecode } from 'jwt-decode';
import Login from './login.mjs';
import Session from './session.mjs';
import ProductCollection from './productCollection.mjs';
import OrderCollection from './orderCollection.mjs';
import { setupCheckout, createCheckoutSession } from './checkout.mjs';

const translateDate = (dateArg) => {
    const date = new Date(dateArg);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (!(date instanceof Date)) {
        console.error('date argument is not instanceof date');
        return;
    }

    if (today.getFullYear() === date.getFullYear() &&
        today.getMonth() === date.getMonth() &&
        today.getDate() === date.getDate()
    ) {
        return 'I dag';
    }

    if (yesterday.getFullYear() === date.getFullYear() &&
        yesterday.getMonth() === date.getMonth() &&
        yesterday.getDate() === date.getDate()
    ) {
        return 'I går';
    }

    var month = '';

    switch (date.getMonth()) {
        case 0: month = 'januar'; break;
        case 1: month = 'februar'; break;
        case 2: month = 'marts'; break;
        case 3: month = 'april'; break;
        case 4: month = 'maj'; break;
        case 5: month = 'juni'; break;
        case 6: month = 'juli'; break;
        case 7: month = 'august'; break;
        case 8: month = 'september'; break;
        case 9: month = 'oktober'; break;
        case 10: month = 'november'; break;
        case 11: month = 'december'; break;
        default: date.getMonth() + 1; break;
    }

    return `${date.getDate()}. ${month} ${date.getFullYear()}`;
};

const getPricePerUnit = (product) => {
    const price = Number(product.price).toFixed(2).replace('.', ',');
    return `${price} DKK pr. ${product.unit}`;
};

const createProductElement = (product) => {
    const pricePerUnit = getPricePerUnit(product);

    return (
        <div class="mx-auto max-w-[710px] overflow-hidden border-2 rounded-[16px] md:min-h-[218px] md:max-h-[218px] bg-gray-bright mb-[10px]">
            <div class="md:flex gap-[20px] md:max-h-[218px] md:min-h-[218px]">
                <div class="clip-border bg-[#eeeeee] min-h-[218px] min-w-[218px] lg:inline-block content-center text-center">
                    <img src={ product.image } alt="Et billede af produktet" class="m-auto content-center" height="200" width="200"/>
                </div>
                <div class="w-[100%] my-[16px] md:my-auto flex flex-row lg:min-w-[200px] lg:h-[100%] content-center ml-[20px]">
                    <div class="flex flex-col justify-center">
                        <div class="font-semibold text-[20px]">
                            { product.name }
                        </div>
                        <div class="font-semibold text-[24px] text-green-price">
                            { pricePerUnit }
                        </div>
                        <div class="text-[16px] text-grey-300 text-[#6D6D6D]">
                            { product.description }
                        </div>
                    </div>
                    <div class="flex-grow"></div>
                    <div class="my-auto lg:ml-[37px] max-w-[193px]">
                        <input type="text" class="focus:border-green-dark shadow focus:outline-none focus:ring-0 mr-[37px] max-w-[calc(193px-37px)] text-center border-2 border-grey-500 rounded-[5px] min-h-[46px]" placeholder="Antal"/>
                        <div class="input-integer-notice flex *:text-red-800 hidden">
                            <i class="text-[12px] content-center mr-[4px] mt-[2px]"></i>
                            <div class="text-sm text-inter-medium">Skal være et positivt heltal</div>
                        </div>
                        <div class="mr-[37px] mt-[11px]">
                            <div class="add-to-cart-button group hover:drop-shadow-md hover:shadow-none active:bg-[#ced9ca] cursor-pointer select-none min-h-[46px] shadow-button flex text-center justify-center border-2 rounded-[5px] border-green-dark bg-green-bright">
                                <div class="content-center text-button-bg ml-[5px] mb-[3px] mr-[4px]">
                                    <i class="text-green-dark text-[12px]">+</i>
                                </div>
                                <div class="group-hover:underline decoration-green-price decoration-2 content-center text-button-text text-[14px] text-green-dark font-inter-medium">
                                    Tilføj
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const createOrderElement = (orderGroupEl, products, order) => {
    const themes = {
        'ordered': { tag: 'Afventer betaling', borderColor: 'border-[#1e88e5]', bgColor: 'bg-[#e3f2fd]', tagBgColor: 'bg-[#1e88e5]', icon: '' },
        'paid': { tag: 'Forbereder ordre', borderColor: 'border-[#ca9228]', bgColor: 'bg-[#fff6cc]', tagBgColor: 'bg-[#ca9228]', icon: '' },
        'ready': { tag: 'Klar til afhentning', borderColor: 'border-[#718355]', bgColor: 'bg-[#e9edc9]', tagBgColor: 'bg-[#718355]', icon: '' },
        'complete': { tag: 'Ordre er hentet', borderColor: 'border-[#164a1c]', bgColor: 'bg-[#dbe7d7]', tagBgColor: 'bg-[#164a1c]', icon: '' },
    };

    const theme = themes[order.status] ?? { tag: 'Ukendt status', borderColor: 'border-gray-700', bgColor: 'bg-stone-100', tagBgColor: 'bg-gray-600', icon: '' };
    const outerClassList = `border-2 ${ theme.borderColor } ${ theme.bgColor } min-w-[500px] rounded-[6px] py-[16px] px-[24px]`;
    const innerClassList = `flex *:flex-initial *:text-sm *:text-white font-inter-medium rounded-[4px] ${ theme.tagBgColor } py-[3px] px-[8px] mb-[6px]`;

    const createEvent = (date, msg) => {
        if (!date || !msg) return;
        const dateObj = new Date(date);
        const hours = dateObj.getHours().toString().padStart(2, '0');
        const minutes = dateObj.getMinutes().toString().padStart(2, '0');
        const formattedDate = `${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()} ${hours}:${minutes}`;

        return (
            <div>
                <strong>{ formattedDate }: </strong>
                { msg }
            </div>
        )
    };

    const createdAtEl = createEvent(order.createdAt, 'Ordren blev oprettet');
    const paidAtEl = createEvent(order.paidAt, 'Ordren blev betalt');
    const readyAtEl = createEvent(order.readyAt, 'Klar til levering');
    const deliveredAtEl = createEvent(order.deliveredAt, 'Ordren blev hentet');

    const payNowButtonEl = order.status === 'ordered' ? (
        <div class={`cursor-pointer checkout-order-button group inline-flex mt-[10px] *:text-sm font-inter-medium rounded ${ theme.tagBgColor } active:bg-blue-600 px-[10px] py-[5px] *:text-white select-none`}>
            <div class="group-hover:underline decoration-2">Betal nu</div>
            <i class="content-center ml-[8px]"></i>
        </div>
    ) : undefined;

    const orderHtml = (
        <div class="order">
            <div class={ outerClassList }>
                <div class={ innerClassList }>
                    <i class="text-[12px] content-center mr-[8px]">{ theme.icon }</i>
                    <div class="uppercase">{ theme.tag }</div>
                </div>
                <div class="text-gray-800 text-[10px] mb-[4px]">ID: { order.id }</div>
                <div class="font-inter-medium text-lg">Varer</div>
                {
                    products.map(prod => (
                        <div><strong>{ prod.amount }x</strong> { prod.name }</div>
                    ))
                }
                <div class="font-inter-medium text-lg mt-[16px]">Status</div>
                { createdAtEl }
                { paidAtEl }
                { readyAtEl }
                { deliveredAtEl }
                { payNowButtonEl }
            </div>
        </div>
    );

    const orderContainer = orderGroupEl.getElementsByClassName('order-container')[0];
    orderContainer.insertAdjacentHTML('beforeend', orderHtml);
    const orderEls = orderGroupEl.getElementsByClassName('order');
    const payButton = orderEls[orderEls.length - 1].getElementsByClassName('checkout-order-button')[0];
    if (payButton) {
        payButton.addEventListener('click', async () => {
            const checkoutSession = await createCheckoutSession(session, order);
            window.location.replace(checkoutSession.url);
        });
    }
};

const createOrderGroupElement = (container, orders, products, date) => {
    const groupEl = (
        <div class="container-group">
            <div class="max-w-0 max-h-0">
                <div class="relative w-[32px] h-[32px] rounded-full -left-[26px] bg-[#9AB973] border-[#dbe7d7] outline outline-background outline-[5px] border-[5px] aspect-square"></div>
            </div>
            <div class="ml-[26px] mb-[10px]">
                <div class="text-sm font-inter-medium uppercase inline-block mb-[6px]">{ date }</div>
                <div class="order-container flex flex-wrap gap-[12px]"></div>
            </div>
        </div>
    );

    container.insertAdjacentHTML('beforeend', groupEl);
    const orderGroupEls = container.getElementsByClassName('container-group');
    orders.forEach(order => {
        const simpleProducts = order.products.map(prod => {
            const name = products.find(p => p.id === prod.id).name ?? 'Ukendt';
            return { amount: prod.amount, name: name };
        });

        createOrderElement(orderGroupEls[orderGroupEls.length - 1], simpleProducts, order);
    });
};

const addToCart = async (product, amount) => {
    const bodyContent = JSON.stringify({
        productId: product.id,
        amount: amount,
    });

    const header = await fetch('/api/cart/add', {
        method: 'POST',
        headers: new Headers({
            'Authorization': await session.get(),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }),
        body: bodyContent
    });

    if (!header.ok) {
        console.error('Could not add product to cart');
        return;
    }

    const cart = await header.json();
    await updateCart(cart);
};

const removeFromCart = async (product, el) => {
    const bodyContent = JSON.stringify({
        productId: product.id,
        amount: 0,
        additive: false,
    });

    const header = await fetch('/api/cart/add', {
        method: 'POST',
        headers: new Headers({
            'Authorization': await session.get(),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }),
        body: bodyContent
    });

    if (!header.ok) {
        console.error('Could not remove product from cart');
        return;
    }

    await updateCart(undefined, false);
    el.remove();
};

const addProduct = (product) => {
    const productList = document.getElementById('product-list');
    const productHtml = createProductElement(product);
    productList.insertAdjacentHTML('beforeend', productHtml);

    const productEl = productList.children[productList.children.length - 1];
    const input = productEl.getElementsByTagName('input')[0];
    const button = productEl.getElementsByClassName('add-to-cart-button')[0];
    const noticeEl = productEl.getElementsByClassName('input-integer-notice')[0];

    const validate = (inputStr, allowEmpty) => {
        const value = Number(inputStr);
        const isEmpty = inputStr.trim().length == 0;

        if ((allowEmpty ?? true) && isEmpty)
            return true;

        return Number.isInteger(value) && value > 0;
    };

    if (input) {
        input.addEventListener('keyup', (e) => {
            const isValid = validate(e.target.value);

            if (noticeEl === undefined)
                return;

            if (isValid)
                noticeEl.classList.add('hidden');
            else
                noticeEl.classList.remove('hidden');
        });
    }

    if (button) {
        button.addEventListener('click', () => {
            const isValid = validate(input.value, false);

            if (noticeEl === undefined)
                return;

            if (isValid) {
                const amount = Number(input.value);
                addToCart(product, amount);
            } else {
                noticeEl.classList.remove('animate-shake');
                noticeEl.offsetHeight;
                noticeEl.classList.add('animate-shake');
            }
        });
    }
};

const createCartedProductElement = (product, amount) => {
    const pricePerUnit = getPricePerUnit(product);
    const total = Number(product.price * amount);
    const totalText = `${total.toFixed(2).replace('.', ',')} DKK`;

    return (
        <div class="group hover:bg-red-50 rounded cursor-pointer select-none carted-product flex justify-center mx-[5px] @[380px]:mx-[15px] @[500px]:mx-[40px] mb-[8px]">
            <div class="group-hover:hidden min-w-[50px] w-[50px] shrink-0 grow-0 basis-initial font-inter-medium text-[16px] text-[#5A5A5A] text-right mt-[7px] mr-[8px] @[380px]:mr-[24px]">
                { amount }
            </div>
            <div class="group-hover:inline-flex hidden flex flex-col min-w-[50px] w-[50px] shrink-0 grow-0 basis-initial @[380px]:mx-[12px]">
                <i class="flex-1 text-[22px] content-center text-center text-red-700"></i>
            </div>
            <div class="flex-1">
                <div class="group-hover:line-through decoration-red-800 decoration-[3px] font-semibold text-[22px]">
                    { product.name }
                </div>
                <div class="group-hover:hidden text-sm text-green-price font-inter-medium text-[11.5px]">
                    { pricePerUnit }
                </div>
                <div class="group-hover:block hidden text-sm text-red-800 font-inter-medium text-[11.5px]">
                    Fjern vare
                </div>
            </div>
            <div class="shrink-0 grow-0 basis-22 font-inter-medium text-[14px] text-green-price mt-[8px]">
                { totalText }
            </div>
        </div>
    );
};

const updateCart = async (cart, alterElements) => {
    const cartedItemsListEl = document.getElementById('cart-items-container');
    const noticeEl = document.getElementById('cart-empty-notice');
    const totalEl = document.getElementById('cart-total');
    const vatEl = document.getElementById('cart-vat');

    if (alterElements ?? true)
        Array.from(document.getElementsByClassName('carted-product'))
            .forEach(e => e.remove());

    if (!cart) {
        const header = await fetch('/api/cart', {
            method: 'GET',
            headers: new Headers({
                'Authorization': await session.get(),
            }),
        });
        
        if (!header.ok) {
            noticeEl.style.display = '';
            console.error('Could not reach GET /api/cart');
            return;
        }

        cart = await header.json();
    }

    const { userId: _, products: cartedProducts } = cart;
    const products = await productsCollection.get();

    noticeEl.style.display = cartedProducts.length === 0 ? '' : 'none';

    let total = cartedProducts.reduce((acc, carted) => {
        const product = products.find(p => p.id == carted.productId);

        if (!product)
            return;

        if (alterElements ?? true) {
            const el = createCartedProductElement(product, carted.amount);
            cartedItemsListEl.insertAdjacentHTML('beforeend', el);
            const cartedProductEl = cartedItemsListEl.children[cartedItemsListEl.children.length - 1];
            cartedProductEl.addEventListener('click', () => {
                removeFromCart(product, cartedProductEl);
            });
        }

        return acc + (carted.amount * product.price);
    }, 0);

    totalEl.innerText = `${total.toFixed(2).replace('.', ',')} DKK`;
    vatEl.innerText = `${(total * 0.25).toFixed(2).replace('.', ',')} DKK`;
};

const updateNavbar = async () => {
    const jwtPayload = jwtDecode(await session.get());
    console.log(`jwt payload: ${JSON.stringify(jwtPayload)}`);
    const isRegistered = !!jwtPayload.email;
    console.log(`is registered: ${isRegistered}`);

    const navbarLoginEl = document.getElementById('navbar-login');
    const navbarLogoutEl = document.getElementById('navbar-logout');

    if (isRegistered) {
        navbarLoginEl.classList.add('hidden');
        navbarLogoutEl.classList.remove('hidden');
    } else {
        navbarLoginEl.classList.remove('hidden');
        navbarLogoutEl.classList.add('hidden');
    }
};

const updateOrders = async () => {
    const products = await productsCollection.get();
    const orders = await orderCollection.get();
    const orderGroupContainerEl = document.getElementById('order-group-container');
    const noOrdersNoticeEl = document.getElementById('no-orders-notice');
    const timelineEl = document.getElementById('timeline');

    Array.from(orderGroupContainerEl.getElementsByClassName('container-group'))
        .forEach(e => e.remove());

    if (orders.length === 0) {
        noOrdersNoticeEl.classList.remove('!hidden');
        timelineEl.classList.add('!hidden');
    } else {
        noOrdersNoticeEl.classList.add('!hidden');
        timelineEl.classList.remove('!hidden');
    }

    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const ordersGroupedByDate = orders.reduce((groups, order) => {
        const date = new Date(order.createdAt).toISOString().split('T')[0];

        if (!groups[date])
            groups[date] = [];

        groups[date].push(order);
        return groups;
    }, {});

    for (const date in ordersGroupedByDate) {
        const groupOfOrders = ordersGroupedByDate[date];
        const translatedDate = `Oprettet ${translateDate(date)}`;
        createOrderGroupElement(orderGroupContainerEl, groupOfOrders, products, translatedDate);
    }
};

const switchPage = (path, updatePath) => {
    const productsEl = document.getElementById('catalog');
    const ordersEl = document.getElementById('orders');

    const updateHistory = (title) => {
        if (!!updatePath)
            window.history.replaceState(null, '', path);

        document.title = title;
    };

    switch (path) {
        default:
        case '/':
            ordersEl.classList.add('!hidden');
            productsEl.classList.remove('!hidden');
            updateHistory('Katalog - Grøntsagsbutik');
            break;
        case '/orders':
            productsEl.classList.add('!hidden');
            ordersEl.classList.remove('!hidden');
            updateHistory('Ordre - Grøntsagsbutik');
            break;
    }
};

const session = new Session();
const productsCollection = new ProductCollection();
const orderCollection = new OrderCollection(session);
new Login(session, () => {
    orderCollection.refresh();
    updateCart();
    updateOrders();
    updateNavbar();
});

document.addEventListener('DOMContentLoaded', async () => {
    const products = await productsCollection.get();

    for (const idx in products) {
        addProduct(products[idx]);
    }

    updateCart();
    updateOrders();
    updateNavbar();
    setupCheckout(session);

    const url = new URL(window.location.href);
    switchPage(url.pathname);

    const shopButtonEl = document.getElementById('navbar-shop');
    const ordersButtonEl = document.getElementById('navbar-orders');

    shopButtonEl.addEventListener('click', () => switchPage('/', true));
    ordersButtonEl.addEventListener('click', () => switchPage('/orders', true));
});
