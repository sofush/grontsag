/** @jsx h */
import h from 'vhtml';
import { jwtDecode } from 'jwt-decode';
import Login from './login.mjs';
import Session from './session.mjs';
import ProductCollection from './productCollection.mjs';
import OrderCollection from './orderCollection.mjs';
import setupCheckout from './checkout.mjs';
import order from '../src/models/order.mjs';

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

const createOrderElement = (products, status) => {
    const themes = {
        'ordered': { tag: 'Afventer betaling', borderColor: 'border-[#1e88e5]', bgColor: 'bg-[#e3f2fd]', tagBgColor: 'bg-[#1e88e5]', icon: '' },
        'paid': { tag: 'Forbereder ordre', borderColor: 'border-[#ca9228]', bgColor: 'bg-[#fff6cc]', tagBgColor: 'bg-[#ca9228]', icon: '' },
        'ready': { tag: 'Klar til afhentning', borderColor: 'border-[#718355]', bgColor: 'bg-[#e9edc9]', tagBgColor: 'bg-[#718355]', icon: '' },
        'complete': { tag: 'Ordre er hentet', borderColor: 'border-[#164a1c]', bgColor: 'bg-[#dbe7d7]', tagBgColor: 'bg-[#164a1c]', icon: '' },
    };

    const theme = themes[status] ?? { tag: 'Ukendt status', borderColor: 'border-gray-700', bgColor: 'bg-stone-100', tagBgColor: 'bg-gray-600', icon: '' };
    const outerClassList = `border-2 ${ theme.borderColor } ${ theme.bgColor } min-w-[500px] rounded-[6px] py-[16px] px-[24px]`;
    const innerClassList = `flex *:flex-initial *:text-sm *:text-white font-inter-medium rounded-[4px] ${ theme.tagBgColor } py-[3px] px-[8px] mb-[6px]`;

    return (
        <div>
            <div class={ outerClassList }>
                <div class={ innerClassList }>
                    <i class="text-[12px] content-center mr-[8px]">{ theme.icon }</i>
                    <div class="uppercase">{ theme.tag }</div>
                </div>
                <div class="font-inter-medium text-lg underline">Varer</div>
                {
                    products.map(prod => (
                        <div>{ prod.amount }x { prod.name }</div>
                    ))
                }
                <div class="font-inter-medium text-lg mt-[16px] underline">Status</div>
                <div>Bestilt d. 28/11/2024 14:30</div>
                <div>Betalt d. 28/11/2024 14:35</div>
                <div>Klar til afhentning d. 28/11/2024 15:25</div>
                <div>Hentet d. 28/11/2024 15:40</div>
            </div>
        </div>
    );
};

const createOrderGroupElement = (orders, products, date) => {
    const orderElements = orders.map(order => {
        const simpleProducts = order.products.map(prod => {
            const name = products.find(p => p.id === prod.id).name ?? 'Ukendt';
            return { amount: prod.amount, name: name };
        });

        return createOrderElement(simpleProducts, order.status);
    });

    return (
        <div>
            <div class="max-w-0 max-h-0">
                <div class="relative w-[32px] h-[32px] rounded-full -left-[26px] bg-[#9AB973] border-[#dbe7d7] outline outline-background outline-[5px] border-[5px] aspect-square"></div>
            </div>
            <div class="ml-[26px] mb-[10px]">
                <div class="text-sm font-inter-medium uppercase inline-block mb-[6px]">{ date }</div>
                <div class="flex flex-wrap gap-[12px]">
                    { orderElements }
                </div>
            </div>
        </div>
    );
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
        <div class="carted-product flex justify-center mx-[5px] @[380px]:mx-[15px] @[500px]:mx-[40px] mb-[8px]">
            <div class="min-w-[50px] w-[50px] shrink-0 grow-0 basis-initial font-inter-medium text-[16px] text-[#5A5A5A] text-right mt-[7px] mr-[8px] @[380px]:mr-[24px]">
                { amount }
            </div>
            <div class="flex-1 font-semibold text-[22px]">
                { product.name }
                <div class="text-sm text-green-price font-inter-medium text-[11.5px]">
                    { pricePerUnit }
                </div>
            </div>
            <div class="shrink-0 grow-0 basis-22 font-inter-medium text-[14px] text-green-price mt-[8px]">
                { totalText }
            </div>
        </div>
    );
};

const updateCart = async (cart) => {
    const cartedItemsListEl = document.getElementById('cart-items-container');
    const noticeEl = document.getElementById('cart-empty-notice');
    const totalEl = document.getElementById('cart-total');
    const vatEl = document.getElementById('cart-vat');

    Array.from(document.getElementsByClassName('carted-product'))
        .forEach(e => e.remove());
    noticeEl.style.display = '';

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

        const el = createCartedProductElement(product, carted.amount);
        cartedItemsListEl.insertAdjacentHTML('beforeend', el);
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

const session = new Session();
const productsCollection = new ProductCollection();
const orderCollection = new OrderCollection(session);
new Login(session, () => {
    updateCart();
    updateNavbar();
});

document.addEventListener('DOMContentLoaded', async () => {
    const products = await productsCollection.get();
    const orders = await orderCollection.get();

    for (const idx in products) {
        addProduct(products[idx]);
    }

    updateCart();
    updateNavbar();
    setupCheckout(session);

    const url = new URL(window.location.href);

    switch (url.pathname) {
        default:
        case '/':
            const productsEl = document.getElementById('catalog');
            productsEl.classList.remove('!hidden');
        case '/orders':
            const ordersEl = document.getElementById('orders');
            const orderContainerEl = document.getElementById('order-group-container');

            const orderGroupContainerEl = createOrderGroupElement(orders, products, 'I dag');
            orderContainerEl.insertAdjacentHTML('beforeend', orderGroupContainerEl);

            ordersEl.classList.remove('!hidden');
    }
});
