/** @jsx h */
import h from 'vhtml';

const createProductElement = (title, priceTag, desc) => {
    return (
        <div class="mx-auto max-w-[710px] overflow-hidden border-2 rounded-[16px] md:min-h-[218px] md:max-h-[218px] bg-gray-bright mb-[10px]">
            <div class="md:flex gap-[20px] md:max-h-[218px] md:min-h-[218px]">
                <div class="clip-border bg-[#eeeeee] min-h-[218px] min-w-[218px] lg:inline-block content-center text-center">
                    [Billede]
                </div>
                <div class="w-[100%] my-[16px] md:my-auto flex flex-row lg:min-w-[200px] lg:h-[100%] content-center ml-[20px]">
                    <div class="flex flex-col">
                        <div class="font-semibold text-[20px]">
                            { title }
                        </div>
                        <div class="font-semibold text-[24px] text-green-price">
                            { priceTag }
                        </div>
                        <div class="text-[16px] text-grey-300 text-[#6D6D6D]">
                            { desc }
                        </div>
                    </div>
                    <div class="flex-grow"></div>
                    <div class="my-auto lg:ml-[37px] max-w-[193px]">
                        <input type="text" class="focus:border-green-dark shadow focus:outline-none focus:ring-0 mr-[37px] max-w-[calc(193px-37px)] text-center border-2 border-grey-500 rounded-[5px] min-h-[46px]" placeholder="Antal"/>
                        <div class="mr-[37px] mt-[11px]">
                            <div class="group hover:drop-shadow-md hover:shadow-none active:bg-[#ced9ca] cursor-pointer select-none min-h-[46px] shadow-button flex text-center justify-center border-2 rounded-[5px] border-green-dark bg-green-bright">
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

const createCartedProductItem = (amount, productName, pricePerItem, priceTotal) => {
    return (
        <div class="flex justify-center mx-[5px] @[380px]:mx-[15px] @[500px]:mx-[40px] mb-[8px]">
            <div class="min-w-[50px] w-[50px] shrink-0 grow-0 basis-initial font-inter-medium text-[16px] text-[#5A5A5A] text-right mt-[7px] mr-[8px] @[380px]:mr-[24px]">
                { amount }
            </div>
            <div class="flex-1 font-semibold text-[22px]">
                { productName }
                <div class="text-sm text-green-price font-inter-medium text-[11.5px]">
                    { pricePerItem }
                </div>
            </div>
            <div class="shrink-0 grow-0 basis-22 font-inter-medium text-[14px] text-green-price mt-[8px]">
                { priceTotal }
            </div>
        </div>
    );
};

const updateCart = (cartIsEmpty, items) => {
    const noticeEl = document.getElementById('cart-empty-notice');
    const totalEl = document.getElementById('cart-total');
    const vatEl = document.getElementById('cart-vat');

    noticeEl.style.display = cartIsEmpty ? '' : 'none';
    totalEl.innerText = '200,00 DKK';
    vatEl.innerText = '50,00 DKK';
};

const tomatoProduct = createProductElement('Almindelig tomat', '2,75 DKK pr. stk', 'En almindelig tomat');
const carrotProduct = createProductElement('Gulerødder (1 kg)', '14,95 DKK pr. pose', 'Et kilo gulerødder');

document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    productList.insertAdjacentHTML('beforeend', tomatoProduct);
    productList.insertAdjacentHTML('beforeend', carrotProduct);

    updateCart(true);
});