export let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(id) {
    let matchingItem;
    const selectQuantity = document.querySelector(`.js-quantitySelector-${id}`)|| {value: 1}; //For testing purposes 1 when DOM not available

        cart.forEach((currItem) => { //Can use find and directly store in matchingItem
            if(id === currItem.productId) {
                matchingItem = currItem;
            }
        });

        if(matchingItem) {
                matchingItem.quantity += Number(selectQuantity.value);
            } else {
                cart.push({
                    productId: id,
                    quantity: Number(selectQuantity.value),
                    deliveryOptionId: '1'
                });
            }
    saveToStorage();
}

export function loadFromStorage() { //For testing mocks to reload the cart
    cart = JSON.parse(localStorage.getItem('cart')) || [];
}

export function removeFromCart(id) {
    const newCart = [];

    cart.forEach((currItem) => {
        if (currItem.productId != id) {
            newCart.push(currItem);
        }
    });
    cart = newCart;
    saveToStorage();
}

export function updateCartQuantity(id, newQuantity) {
    const cartItem = cart.find((currItem) => {
        return currItem.productId === id;
    });
    cartItem.quantity = newQuantity;
    saveToStorage();
}

export function getTotalCartQuantity() {
    let total = 0;
    cart.forEach((item) => {
        total += item.quantity;
    });
    return total;
}

export function updateDeliveryOption(productId, deliveryOptionId) {
    const matchingProduct = cart.find((currItem) => {
        return  currItem.productId === productId;
    });

    matchingProduct.deliveryOptionId = deliveryOptionId;
    saveToStorage();
}

export function loadCart(fun) {
    const xhr = new XMLHttpRequest();

    xhr.addEventListener('load',() => {
        console.log(xhr.response);
        fun();
    });

    xhr.open('GET','https://supersimplebackend.dev/cart');
    xhr.send();
}