import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { loadProducts, loadProductsFetch } from "../data/products.js";
import { loadCart } from "../data/cart.js";

async function loadPage() {
  try {
    await loadProductsFetch();
    const value =  await new Promise((resolve, reject) => {
      loadCart(() => {
        //reject('error1')
        resolve('value2');
      });
    });

  } catch(error) {
    console.log('Unexpected Error. Please try again later');
  }

  renderOrderSummary();
  renderPaymentSummary();
  //return 'value2';
}

loadPage().then(() => {
  console.log('next page');
  //console.log(value);
});

/*
Promise.all([
  loadProductsFetch(),
  
  new Promise((resolve) => {
    loadCart(() => {
      resolve('value2');
    });
  })
]).then((values) => {
  renderOrderSummary();
  renderPaymentSummary();
  console.log(values);
})

// new Promise((resolve) => {
//   loadProducts(() => {
//     console.log("load products");
//     resolve('value1');
//   });
// }).then((value) => {
//   console.log(value);
//   return new Promise((resolve) => {
//     loadCart(() => {
//       resolve();
//     });
//   }).then(() => {
//     renderOrderSummary();
//     renderPaymentSummary();
//   });
// });


// loadProducts(() => {
//   renderOrderSummary();
//   renderPaymentSummary();
// });
*/