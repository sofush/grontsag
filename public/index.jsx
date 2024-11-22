/** @jsx h */
import h from 'vhtml';

const productsPromise = (async () => {
    const header = await fetch('/products');

    if (!header.ok)
        return null;

    return await header.json();
})();

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
                    [Billede]
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
                
                if (!Number(product.amount))
                    product.amount = amount;
                else
                    product.amount += amount;

                updateCart();
            } else {
                noticeEl.classList.remove('animate-shake');
                noticeEl.offsetHeight;
                noticeEl.classList.add('animate-shake');
            }
        });
    }
};

const createCartedProductElement = (product) => {
    const pricePerUnit = getPricePerUnit(product);
    const total = Number(product.price * product.amount);
    const totalText = `${total.toFixed(2).replace('.', ',')} DKK`;

    return (
        <div class="carted-product flex justify-center mx-[5px] @[380px]:mx-[15px] @[500px]:mx-[40px] mb-[8px]">
            <div class="min-w-[50px] w-[50px] shrink-0 grow-0 basis-initial font-inter-medium text-[16px] text-[#5A5A5A] text-right mt-[7px] mr-[8px] @[380px]:mr-[24px]">
                { product.amount }
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

const addCartedItem = async (amount, product) => {
    const el = createCartedProductElement(amount, product);
    const cartEmptyNotice = document.getElementById('cart-empty-notice');

    cartEmptyNotice.style.display = 'none';
};

const updateCart = async () => {
    const cartedItemsListEl = document.getElementById('cart-items-container');
    const noticeEl = document.getElementById('cart-empty-notice');
    const totalEl = document.getElementById('cart-total');
    const vatEl = document.getElementById('cart-vat');

    Array.from(document.getElementsByClassName('carted-product'))
        .forEach(e => e.remove());

    productsPromise.then(products => {
        const cartedProducts = products
            .filter(product => !!product.amount);
        const elements = cartedProducts
            .map(createCartedProductElement);
            
        elements.forEach(el => 
            cartedItemsListEl.insertAdjacentHTML('beforeend', el));
        noticeEl.style.display = elements.length === 0 ? '' : 'none';

        const total = cartedProducts
            .map(product => product.amount * product.price)
            .reduce((a, b) => a + b, 0);
        const vat = total * 0.25;
        
        totalEl.innerText = `${total.toFixed(2).replace('.', ',')} DKK`;
        vatEl.innerText = `${vat.toFixed(2).replace('.', ',')} DKK`;
    });
};

document.addEventListener('DOMContentLoaded', async () => {
    productsPromise.then((products) => {
        for (const idx in products) {
            addProduct(products[idx]);
        }
    });
});