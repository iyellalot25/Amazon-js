import { cart, getTotalCartQuantity, addToCart } from "../data/cart.js"; //Named export
//import products from "../data/products.js"; //Default export
import {products, loadProducts } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";

loadProducts(renderProductsGrid);

const productGrid = document.querySelector('.js-productsGrid');
const cartNumber = document.querySelector('.js-cartQuantity');

function renderProductsGrid() {
    let productsHTML = ''; //Accumulator

    products.forEach((currProduct) => {
        const isClothing = currProduct.type === 'clothing';

        productsHTML += `
        <div class="product-container">
                <div class="product-image-container">
                <img class="product-image"
                    src="${currProduct.image}">
                </div>

                <div class="product-name limit-text-to-2-lines">
                ${currProduct.name}
                </div>

                <div class="product-rating-container">
                <img class="product-rating-stars"
                    src="images/ratings/rating-${currProduct.rating.stars*10}.png">
                <div class="product-rating-count link-primary">
                    ${currProduct.rating.count}
                </div>
                </div>

                <div class="product-price">
                $${formatCurrency(currProduct.priceCents)}
                </div>

                <div class="product-quantity-container">
                <select class = "js-quantitySelector-${currProduct.id}">
                    <option selected value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                </select>
                </div>

                ${isClothing ? `
                    <a href = "./images/clothing-size-chart.png" target = "_blank">Size Chart</a>
                `:''}

                <div class="product-spacer"></div>

                <div class="added-to-cart js-addedMsg-${currProduct.id}">
                <img src="images/icons/checkmark.png">
                Added
                </div>

                <button class="add-to-cart-button button-primary js-addToCart"
                data-product-id="${currProduct.id}">
                Add to Cart
                </button>
            </div>
        `;
    });
    //console.log(productsHTML);
    productGrid.innerHTML = productsHTML;
    cartNumber.innerText = getTotalCartQuantity();

    const addToCartBtns = document.querySelectorAll('.js-addToCart');
    let MsgTimeoutId; //Outside the listener scope so that due to closure everytime the listener runs the function keeps access of the previous unique intervalIds

    function updateCartQuantity(id) {
        const addedMsg = document.querySelector(`.js-addedMsg-${id}`);
        addedMsg.classList.add('added-to-cart-visible');
        if (MsgTimeoutId) {
        clearTimeout(MsgTimeoutId);
        }
        MsgTimeoutId = setTimeout(() => {
            addedMsg.classList.remove('added-to-cart-visible');
        }, 2000);
    }

    addToCartBtns.forEach((currBtn) => {
        currBtn.addEventListener('click', () => {
            const id = currBtn.dataset.productId;

            addToCart(id);
            cartNumber.innerText = getTotalCartQuantity();
            updateCartQuantity(id);
        });
    });
}