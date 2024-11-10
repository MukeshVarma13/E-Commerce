const cartBtn = document.querySelector(".shopping");
const cartContainer = document.querySelector(".show-cart");
const closeBtn = document.querySelector(".cancel");

const individualProduct = document.querySelector(".show-cart");
const addedItem = document.querySelector(".outer");

const homeAdd = document.querySelector(".product-container");
homeAdd.innerHTML = "";

let cart = [];
let addedCart = [];

jsonData();

cartBtn.addEventListener("click", () => {
  cartContainer.classList.add("shopping-container");
  cartContainer.classList.remove("show-cart");
});

closeBtn.addEventListener("click", () => {
  cartContainer.classList.remove("shopping-container");
  cartContainer.classList.add("show-cart");
});

async function jsonData() {
  const response = await fetch("/ProductList.json");
  const data = await response.json();
  cart = data;
  addingProducts();
}

const addingProducts = () => {
  cart.forEach((products) => {
    let newitem = document.createElement("div");
    newitem.classList.add("individual-images");
    newitem.dataset.id = products.id;
    newitem.innerHTML = `
      <img src=${products.productImage} />
      <h2>${products.productName}</h2>
      <div>$${products.price}</div>
      <button class="button-class">Add To Cart</button>`;
    homeAdd.append(newitem);
  });
};

homeAdd.addEventListener("click", (event) => {
  let clickedPosition = event.target;
  if (event.target.matches(".button-class")) {
    let product_id = clickedPosition.parentElement.dataset.id;
    addToCart(product_id);
  }
});

function addToCart(product_id) {
  const product = cart.find(item => item.id === parseInt(product_id));

  if (product) {
    // Add to cart (or increase quantity if item already exists in addedCart)
    const existingProduct = addedCart.find(item => item.id === product.id);
    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      product.quantity = 1;
      addedCart.push(product);
    }
    updateCartUI();
  }
}

function updateCartUI() {
  addedItem.innerHTML = "";  // Clear the cart display

  if (addedCart.length === 0) {
    addedItem.innerHTML = "<p>Your cart is empty!</p>";
  } else {
    addedCart.forEach(product => {
      const productDiv = document.createElement("div");
      productDiv.classList.add("individual-products");
      productDiv.innerHTML = `
        <img src=${product.productImage} />
        <p>${product.productName}</p>
        <div>$${product.price}</div>
        <div class="quantity">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
          >
            <path d="M200-440v-80h560v80H200Z" />
          </svg>
          <span>${product.quantity}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
          >
            <path
              d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"
            />
          </svg>
        </div>
        <button class="remove-btn" data-id="${product.id}">Remove</button>`;
      addedItem.append(productDiv);
    });

    const removeBtns = addedItem.querySelectorAll(".remove-btn");
    removeBtns.forEach(btn => {
      btn.addEventListener("click", (event) => {
        let product_id = event.target.dataset.id;
        removeFromCart(product_id);
      });
    });
  }
}

function removeFromCart(product_id) {
  addedCart = addedCart.filter(item => item.id !== parseInt(product_id));
  updateCartUI();
}

