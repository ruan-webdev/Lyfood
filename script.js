const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

let cart = []

// open modal cart bt adding the style.display = "flex"
cartBtn.addEventListener("click", () => {
  updateCartTotal()
  cartModal.style.display = "flex"
})

// close modal cart by clicking on the background
cartModal.addEventListener("click", (event) => {
  if (event.target === cartModal) {
    cartModal.style.display = "none"
  }
})

// close modal cart by clicking on the close button
closeModalBtn.addEventListener("click", () => {
  cartModal.style.display = "none"
})

// Event to add cart items
menu.addEventListener("click", function (event) {
  // console.log(event.target)
  let parentButton = event.target.closest(".add-to-cart-btn")

  if (parentButton) {
    const name = parentButton.getAttribute("data-name")
    const price = parseFloat(parentButton.getAttribute("data-price"))

    // add item to cart
    addItemToCart(name, price)
  }
})

// function to add item to cart
function addItemToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name)

  if (existingItem) {
    existingItem.quantity++
  } else {
    cart.push({ name: name, price: price, quantity: 1 })
  }
  updateCartTotal()
}

// update cart total
function updateCartTotal() {
  cartItemsContainer.innerHTML = ""
  let total = 0

  cart.forEach((item) => {
    const cartItem = document.createElement("div")
    cartItem.classList.add("flex", "justify-between", "mb-4", "flex-col")

    cartItem.innerHTML = `
    <div class="flex items-center justify-between">
      <div>
        <p class="font-medium">${item.name}</p>
        <p>Qtd: ${item.quantity}</p>
        <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
      </div>

      <div>
        <button class="remove-from-cart-btn" data-name="${
          item.name
        }">Remover</button>
      </div>
    </div>
    `
    cartItem.classList.add("cart-item")

    total += item.price * item.quantity
    cartItemsContainer.appendChild(cartItem)
  })

  // convert to BRL the total of the cart
  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })

  cartCounter.innerHTML = cart.length
}

// remove item from cart
cartItemsContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove-from-cart-btn")) {
    const name = event.target.getAttribute("data-name")

    removeItemFromCart(name)

    if (cart.length === 0) {
      cartModal.style.display = "none"
    }
  }
})

// function to remove item from cart by checking the name
function removeItemFromCart(name) {
  const index = cart.findIndex((item) => item.name === name)

  if (index !== -1) {
    const item = cart[index]
    if (item.quantity > 1) {
      item.quantity--
      updateCartTotal()
      return
    }

    cart.splice(index, 1)
    updateCartTotal()
  }
}

// this event will check if the address is empty or not by typing
addressInput.addEventListener("input", function (event) {
  let inputValue = event.target.value

  if (inputValue !== "") {
    addressWarn.classList.add("hidden")
    addressInput.classList.remove("border-red-500")
  }
})

// this event will check if the address is empty or not by clicking on the checkout button
checkoutBtn.addEventListener("click", function () {
  // check if restaurant is open
  const isOpen = checkRestaurantOpen()
  if (!isOpen) {
    Toastify({
      text: "Ops, o restaurante ainda está fechado!",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "#ef4444",
      },
    }).showToast()

    clearCart()
    return
  }
  // check if cart is empty
  if (cart.length === 0) return
  // check if address is empty
  if (addressInput.value.length === 0) {
    addressWarn.classList.remove("hidden")
    addressInput.classList.add("border-red-500")
    return
  }
  // alert("Seu pedido foi concluído com sucesso!")

  const cartItems = cart
    .map((item) => {
      return `${item.name} - Quantidade: ${
        item.quantity
      } - Preço: R$ ${item.price.toFixed(2)} | `
    })
    .join("")

  const message = encodeURIComponent(cartItems)
  // random number for whatsapp
  const phone = "951515252"

  window.open(
    `https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`,
    "_blank"
  )

  console.log(cartItems)

  // clear cart
  clearCart()
})

// function to clear cart and close modal
function clearCart() {
  cart = []
  cartModal.style.display = "none"
  updateCartTotal()
  addressInput.value = ""
  addressWarn.classList.add("hidden")
  addressInput.classList.remove("border-red-500")
}

// check if restaurant is open and manipulate the card hour
function checkRestaurantOpen() {
  const date = new Date()
  const hour = date.getHours()
  return hour >= 11 && hour <= 22
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen()

if (isOpen) {
  spanItem.classList.remove("bg-red-500")
  spanItem.classList.add("bg-green-500")
} else {
  spanItem.classList.remove("bg-green-500")
  spanItem.classList.add("bg-red-500")
}
