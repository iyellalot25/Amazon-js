import { cart, getTotalCartQuantity, removeFromCart, updateCartQuantity, updateDeliveryOption } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import { deliveryOptions, getDeliveryOption, calculateDeliveryDate } from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./paymentSummary.js";

export function renderOrderSummary() {
    const orderSummaryElement = document.querySelector('.orderSummary-js');
    const itemCountElement = document.querySelector('.js-return-to-home-link');

    let cartSummaryHTML = ''; //Accumulator

    cart.forEach((currItem) => {
        const prodId = currItem.productId;
        const matchingProduct = getProduct(prodId);

        const deliveryOptionId = currItem.deliveryOptionId;
        const deliveryOption = getDeliveryOption(deliveryOptionId);

        const deliveryDate = calculateDeliveryDate(deliveryOption);

        cartSummaryHTML +=
        `
        <div class="cart-item-container js-cart-item-container-${currItem.productId}">
            <div class="delivery-date">
                Delivery date: ${deliveryDate}
            </div>

            <div class="cart-item-details-grid">
                <img class="product-image" src="${matchingProduct.image}">

                <div class="cart-item-details">
                    <div class="product-name">
                        ${matchingProduct.name}
                    </div>
                    <div class="product-price">
                        $${formatCurrency(matchingProduct.priceCents)}
                    </div>
                    <div class="product-quantity">
                        <span>
                            Quantity: <span class="quantity-label js-quantity-label-${currItem.productId}">${currItem.quantity}</span>
                        </span>
                        <span class="update-quantity-link link-primary js-update-link" data-product-id = "${currItem.productId}">
                            Update
                        </span>
                        <input class = "quantity-input js-quantity-input-${currItem.productId}">
                        <span class="save-quantity-link link-primary">Save</span>
                        <span class="delete-quantity-link link-primary js-deleteLink" data-product-id = "${currItem.productId}">
                            Delete
                        </span>
                    </div>
                </div>

                <div class="delivery-options js-delivery-options">
                    <div class="delivery-options-title">
                        Choose a delivery option:
                    </div>
                    ${deliveryOptionsHTML(currItem)}
                </div>
            </div>
        </div>
        `
    });

    function deliveryOptionsHTML(currItem) {
        let html = ''; 

        deliveryOptions.forEach((currOption) => {
            const dateString = calculateDeliveryDate(currOption);
            const priceString = currOption.priceCents === 0 ? 'FREE' : `$${formatCurrency(currOption.priceCents)} -`;
            const isChecked = currOption.id === currItem.deliveryOptionId;

            html+=
            `
            <div class="delivery-option js-delivery-option" data-product-id = "${currItem.productId}" data-delivery-option-id = "${currOption.id}">
                <input type="radio" ${isChecked ? 'checked' : ''} class="delivery-option-input" name="delivery-option-${currItem.productId}">
                <div>
                    <label class="delivery-option-date">
                        ${dateString}
                    </label>
                    <div class="delivery-option-price">
                        ${priceString} Shipping
                    </div>
                </div>
            </div>
            `
        });

        return html;
    }

    orderSummaryElement.innerHTML = cartSummaryHTML;
    itemCountElement.innerText = `${getTotalCartQuantity()} items`;

    const deleteLink = document.querySelectorAll('.js-deleteLink');
    const updateLink = document.querySelectorAll('.js-update-link');

    deleteLink.forEach((currLink) => {
        currLink.addEventListener('click', () => {
            const id = currLink.dataset.productId;
            const container = document.querySelector(`.js-cart-item-container-${id}`);
            
            removeFromCart(id);
            container.remove();
            itemCountElement.innerText = `${getTotalCartQuantity()} items`;
            renderPaymentSummary();
        });
    });

    updateLink.forEach((currLink) => {
        currLink.addEventListener('click', () => {
            const id = currLink.dataset.productId;
            const container = document.querySelector(`.js-cart-item-container-${id}`);
            const inputElement = document.querySelector(`.js-quantity-input-${id}`);
            const quantityLabel = document.querySelector(`.js-quantity-label-${id}`);
            
            container.classList.add('is-editing-quantity');

            const saveLink = document.querySelectorAll('.save-quantity-link');
            saveLink.forEach((currLink) => {
                currLink.addEventListener('click', () => {
                    const updatedQuantity = Number(inputElement.value);

                    if (updatedQuantity<=0 || updatedQuantity>1000) {
                        alert("Quantity should be between 1 and 1000");
                        return;
                    }
                    updateCartQuantity(id,updatedQuantity);
                    quantityLabel.innerText = updatedQuantity;
                    container.classList.remove('is-editing-quantity');
                    itemCountElement.innerText = `${getTotalCartQuantity()} items`;
                    renderPaymentSummary();
                })
            });

            inputElement.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    const updatedQuantity = Number(inputElement.value);

                    if (updatedQuantity<=0 || updatedQuantity>1000) {
                    alert("Quantity should be between 1 and 1000");
                    return;
                    }
                    updateCartQuantity(id,updatedQuantity);
                    quantityLabel.innerText = updatedQuantity;
                    container.classList.remove('is-editing-quantity');
                    itemCountElement.innerText = `${getTotalCartQuantity()} items`;
                    renderPaymentSummary();
                }
            })
        })
    });


    const deliveryOptionContainers = document.querySelectorAll('.js-delivery-option');
    deliveryOptionContainers.forEach((currContainer) => {
        currContainer.addEventListener('click', () => {
            const productId = currContainer.dataset.productId;
            const deliveryOptionId = currContainer.dataset.deliveryOptionId;
            updateDeliveryOption(productId, deliveryOptionId);

            renderOrderSummary();
            renderPaymentSummary();
        })
    });
}