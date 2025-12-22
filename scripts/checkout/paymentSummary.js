import { cart, getTotalCartQuantity } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { getDeliveryOption } from "../../data/deliveryOptions.js";
import { formatCurrency } from "../utils/money.js";
import { addOrder } from "../../data/orders.js";

export function renderPaymentSummary() {
    const productCostCents = cart.reduce((totalCost, currItem) => {
        const matchingProduct = getProduct(currItem.productId);
        return totalCost + (currItem.quantity*matchingProduct.priceCents);
    }, 0);

    const shippingCostCents = cart.reduce((totalCost, currItem) => {
        const deliveryOption = getDeliveryOption(currItem.deliveryOptionId);
        return totalCost + deliveryOption.priceCents;
    }, 0);

    const totalBeforeTaxCents = productCostCents + shippingCostCents;
    const estimatedTaxCents = totalBeforeTaxCents * 0.1;
    const totalCostCents = totalBeforeTaxCents + estimatedTaxCents;
    
    const paymentSummary = document.querySelector('.js-payment-summary');
    const paymentSummaryHTML = 
    `
    <div class="payment-summary-title">
        Order Summary
    </div>

    <div class="payment-summary-row">
        <div>Items (${getTotalCartQuantity()}):</div>
        <div class="payment-summary-money">$${formatCurrency(productCostCents)}</div>
    </div>

    <div class="payment-summary-row">
        <div>Shipping &amp; handling:</div>
        <div class="payment-summary-money">$${formatCurrency(shippingCostCents)}</div>
    </div>

    <div class="payment-summary-row subtotal-row">
        <div>Total before tax:</div>
        <div class="payment-summary-money">$${formatCurrency(totalBeforeTaxCents)}</div>
    </div>

    <div class="payment-summary-row">
        <div>Estimated tax (10%):</div>
        <div class="payment-summary-money">$${formatCurrency(estimatedTaxCents)}</div>
    </div>

    <div class="payment-summary-row total-row">
        <div>Order total:</div>
        <div class="payment-summary-money">$${formatCurrency(totalCostCents)}</div>
    </div>

    <button class="place-order-button button-primary js-place-order">
        Place your order
    </button>
    `;

    paymentSummary.innerHTML = paymentSummaryHTML;

    const placeOrderBtn = document.querySelector('.js-place-order');
    placeOrderBtn.addEventListener('click', async() => {
        try {
            const response = await fetch('https://supersimplebackend.dev/orders', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/JSON'
                        },
                        body: JSON.stringify({
                            cart: cart
                        })
                    });

                    const order = await response.json();
                    //console.log(order); //This is also a promise (asynchronous)
                    addOrder(order);

        } catch(error) {
            console.log("Unexpected Error. Try again later");
        }

        window.location.href = 'orders.html';
    });
}