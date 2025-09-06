// Cart functionality
let cart = [];
let cartCount = 0;

// Show/hide categories
function showCategory(category) {
    const bouquetsSection = document.getElementById('bouquets-section');
    const souvenirsSection = document.getElementById('souvenirs-section');
    const buttons = document.querySelectorAll('.category-buttons button');
    
    // Remove active class from all buttons
    buttons.forEach(button => button.classList.remove('active'));
    
    if (category === 'bouquets') {
        bouquetsSection.style.display = 'grid';
        souvenirsSection.style.display = 'none';
        // Add active class to bouquets button
        buttons[0].classList.add('active');
    } else if (category === 'souvenirs') {
        bouquetsSection.style.display = 'none';
        souvenirsSection.style.display = 'grid';
        // Add active class to souvenirs button
        buttons[1].classList.add('active');
    }
}

// Add to cart functionality
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: parseFloat(price),
            quantity: 1
        });
    }
    
    cartCount++;
    updateCartButton();
    
    // Show success message (optional)
    showAddToCartMessage(name);
}

// Show add to cart success message
function showAddToCartMessage(itemName) {
    // Create a temporary message element
    const message = document.createElement('div');
    message.textContent = `${itemName} added to cart!`;
    message.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: linear-gradient(135deg, #27ae60, #2ecc71);
        color: white;
        padding: 12px 20px;
        border-radius: 25px;
        z-index: 1002;
        font-weight: 600;
        box-shadow: 0 4px 15px rgba(46, 204, 113, 0.3);
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(message);
    
    // Remove message after 2 seconds
    setTimeout(() => {
        message.remove();
    }, 2000);
}

// Update cart button
function updateCartButton() {
    const cartButton = document.getElementById('cart-button');
    cartButton.textContent = `Cart (${cartCount})`;
}

// Toggle cart modal
function toggleCart() {
    const cartModal = document.getElementById('cart-modal');
    const isVisible = cartModal.style.display !== 'none';
    
    if (isVisible) {
        cartModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    } else {
        cartModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        updateCartDisplay();
    }
}

// Update cart display
function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<li style="text-align: center; color: #7f8c8d; font-style: italic;">Your cart is empty</li>';
        return;
    }
    
    let total = 0;
    cart.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <div style="flex: 1;">
                <strong>${item.name}</strong><br>
                <span style="color: #7f8c8d;">Qty: ${item.quantity} × $${item.price.toFixed(2)}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-weight: bold; color: #e74c3c;">$${(item.quantity * item.price).toFixed(2)}</span>
                <button onclick="removeFromCart(${index})" style="
                    background: #e74c3c;
                    color: white;
                    border: none;
                    padding: 5px 10px;
                    border-radius: 15px;
                    cursor: pointer;
                    font-size: 0.8rem;
                ">Remove</button>
            </div>
        `;
        cartItems.appendChild(listItem);
        total += item.quantity * item.price;
    });
    
    // Add total
    const totalItem = document.createElement('li');
    totalItem.style.cssText = 'border-top: 2px solid #27ae60; margin-top: 15px; padding-top: 15px; font-weight: bold; font-size: 1.2rem;';
    totalItem.innerHTML = `
        <div style="flex: 1;">Total:</div>
        <div style="color: #27ae60;">$${total.toFixed(2)}</div>
    `;
    cartItems.appendChild(totalItem);
}

// Remove from cart
function removeFromCart(index) {
    const item = cart[index];
    cartCount -= item.quantity;
    cart.splice(index, 1);
    updateCartButton();
    updateCartDisplay();
}

// Checkout process
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Hide cart modal
    document.getElementById('cart-modal').style.display = 'none';
    
    // Show checkout form
    document.getElementById('checkout-form').style.display = 'block';
    document.body.style.overflow =
