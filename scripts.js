// Cart functionality
let cart = [];
let cartCount = 0;

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set bouquets as default active category
    showCategory('bouquets');
    
    // Add event listeners to all "Add to Cart" buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const name = this.getAttribute('data-name');
            const price = this.getAttribute('data-price');
            addToCart(name, price);
        });
    });

    // Add form submission handler
    const customerForm = document.getElementById('customer-details-form');
    customerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        processCheckout();
    });
});

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
    
    // Show success message
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
        font-size: 0.9rem;
    `;
    
    document.body.appendChild(message);
    
    // Remove message after 2 seconds
    setTimeout(() => {
        if (message && message.parentNode) {
            message.remove();
        }
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
        cartItems.innerHTML = '<li style="text-align: center; color: #7f8c8d; font-style: italic; padding: 20px;">Your cart is empty</li>';
        return;
    }
    
    let total = 0;
    cart.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 15px 0; border-bottom: 1px solid #eee;';
        listItem.innerHTML = `
            <div style="flex: 1;">
                <strong style="font-size: 1.1rem;">${item.name}</strong><br>
                <span style="color: #7f8c8d; font-size: 0.9rem;">Qty: ${item.quantity} × ₱${item.price.toFixed(2)}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 15px;">
                <span style="font-weight: bold; color: #e74c3c; font-size: 1.1rem;">₱${(item.quantity * item.price).toFixed(2)}</span>
                <button onclick="removeFromCart(${index})" style="
                    background: #e74c3c;
                    color: white;
                    border: none;
                    padding: 8px 12px;
                    border-radius: 15px;
                    cursor: pointer;
                    font-size: 0.8rem;
                    transition: background 0.3s ease;
                " onmouseover="this.style.background='#c0392b'" onmouseout="this.style.background='#e74c3c'">Remove</button>
            </div>
        `;
        cartItems.appendChild(listItem);
        total += item.quantity * item.price;
    });
    
    // Add total
    const totalItem = document.createElement('li');
    totalItem.style.cssText = 'border-top: 2px solid #27ae60; margin-top: 15px; padding-top: 15px; font-weight: bold; font-size: 1.3rem; display: flex; justify-content: space-between; align-items: center;';
    totalItem.innerHTML = `
        <div style="flex: 1;">Total:</div>
        <div style="color: #27ae60;">₱${total.toFixed(2)}</div>
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
    document.body.style.overflow = 'hidden';
}

// Process checkout form submission
function processCheckout() {
    const customerName = document.getElementById('customer-name').value.trim();
    const customerPhone = document.getElementById('customer-phone').value.trim();
    const deliveryOption = document.getElementById('delivery-option').value;
    
    if (!customerName || !customerPhone || !deliveryOption) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Calculate total with delivery fee
    let total = cart.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    let deliveryFee = 0;
    let deliveryText = '';
    
    switch(deliveryOption) {
        case 'pickup':
            deliveryText = 'Pick Up (No Fee)';
            deliveryFee = 0;
            break;
        case 'meetup':
            deliveryText = 'Meet Up (₱50 Fee)';
            deliveryFee = 50;
            break;
        case 'delivery':
            deliveryText = 'Delivery (₱100 Fee)';
            deliveryFee = 100;
            break;
    }
    
    total += deliveryFee;
    
    // Display confirmation
    document.getElementById('customer-name-display').textContent = customerName;
    document.getElementById('customer-phone-display').textContent = customerPhone;
    document.getElementById('delivery-option-display').textContent = deliveryText;
    document.getElementById('total-price-display').textContent = total.toFixed(2);
    
    // Hide checkout form and show confirmation
    document.getElementById('checkout-form').style.display = 'none';
    document.getElementById('confirmation-section').style.display = 'block';
}

// Finish checkout
function finishCheckout() {
    // Reset cart
    cart = [];
    cartCount = 0;
    updateCartButton();
    
    // Reset form
    document.getElementById('customer-details-form').reset();
    
    // Hide confirmation and show success message
    document.getElementById('confirmation-section').style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Show success message
    alert('Thank you for your order! We will contact you soon to confirm the details.');
}

// Cancel checkout
function cancelCheckout() {
    // Reset form
    document.getElementById('customer-details-form').reset();
    
    // Hide all modals
    document.getElementById('checkout-form').style.display = 'none';
    document.getElementById('confirmation-section').style.display = 'none';
    document.body.style.overflow = 'auto';
}
