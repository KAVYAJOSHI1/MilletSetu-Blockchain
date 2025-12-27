// Wait for the page to load before running any script
document.addEventListener('DOMContentLoaded', () => {
    console.log("index.js: DOM Loaded.");

    // Global state
    window.currentConsumer = null;
    const CART_KEY = 'milletCart';

    // Store references
    const appTitle = document.getElementById('app-title');
    const navButtons = document.querySelectorAll('.app-nav button');
    const appPages = document.querySelectorAll('.app-page');
    const productGrid = document.getElementById('product-grid');
    const cartCountBadge = document.getElementById('cart-count-badge');
    
    // --- [!! HELPER FUNCTION: Wait for DB !!] ---
    let dbCheckPromise = null;
    async function getDb() {
        if (typeof window.db !== 'undefined' && window.db) {
            return window.db;
        }
        if (!dbCheckPromise) {
            dbCheckPromise = new Promise((resolve) => {
                let dbCheckAttempts = 0;
                const maxDbCheckAttempts = 10;
                const tryCheck = () => {
                    if (typeof window.db !== 'undefined' && window.db) {
                        console.log("index.js: Database connection (window.db) is ready.");
                        resolve(window.db);
                    } else if (dbCheckAttempts < maxDbCheckAttempts) {
                        dbCheckAttempts++;
                        console.warn(`index.js: DB not ready. Retrying... (${dbCheckAttempts})`);
                        setTimeout(tryCheck, 500);
                    } else {
                        console.error("index.js: Failed to connect to DB after 10 attempts.");
                        resolve(null);
                    }
                };
                tryCheck();
            });
        }
        return dbCheckPromise;
    }

    // --- Page Switching Logic (Unchanged) ---
    window.showPage = (pageId) => {
        console.log(`index.js: showPage called with ID: ${pageId}`);
        
        let titleKey = 'consumer.navStore';
        if (pageId === 'cart') {
             titleKey = 'consumer.cartTitle';
             loadCartPage(); 
        } else if (pageId === 'orders') {
             titleKey = 'consumer.ordersTitle';
             loadMyOrders(); 
        } else if (pageId === 'profile') {
             titleKey = 'consumer.profileTitle';
             loadProfilePage(); 
        }
        
        if (appTitle && window.t) {
            appTitle.textContent = t(titleKey);
            appTitle.dataset.i18n = titleKey;
        }
        
        appPages.forEach(page => page.classList.remove('active'));
        const targetPage = document.getElementById('page-' + pageId);
        if (targetPage) targetPage.classList.add('active');
        navButtons.forEach(button => button.classList.remove('active'));
        const targetNavButton = document.getElementById('nav-' + pageId);
        if (targetNavButton) targetNavButton.classList.add('active');
    };

    // --- Cart Helper Functions (Unchanged) ---
    function getCart() {
        try {
            const cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
            return Array.isArray(cart) ? cart : [];
        } catch (e) {
            return [];
        }
    }

    function saveCart(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        updateCartCount();
    }

    function updateCartCount() {
        const cart = getCart();
        if (cart.length > 0) {
            cartCountBadge.textContent = cart.length;
            cartCountBadge.style.display = 'flex';
        } else {
            cartCountBadge.style.display = 'none';
        }
    }

    function addToCart(product) {
        const cart = getCart();
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            alert(t('consumer.itemInCart'));
        } else {
            cart.push({
                id: product.id,
                name: product.product_name,
                price: product.price,
                unit: product.unit,
                quantity: product.quantity,
                image_url: product.image_url,
                seller_id: product.seller_id,
                seller_name: product.sellers.seller_name
            });
            saveCart(cart);
            alert(`${product.product_name} ${t('consumer.itemAddedToCart')}`);
        }
    }
    
    function removeFromCart(productId) {
        console.log(`Removing ${productId} from cart`);
        let cart = getCart();
        cart = cart.filter(item => item.id !== productId);
        saveCart(cart);
        loadCartPage(); // Re-render the cart page
    }
    

    // --- Page Loader: Cart (Unchanged) ---
    function loadCartPage() {
        const cart = getCart();
        const container = document.getElementById('cart-items-container');
        const summaryContainer = document.getElementById('cart-summary-container');

        if (cart.length === 0) {
            container.innerHTML = `<p style="text-align: center; padding: 2rem;" data-i18n="consumer.cartEmpty">${t('consumer.cartEmpty')}</p>`;
            summaryContainer.innerHTML = '';
            return;
        }

        container.innerHTML = cart.map(item => {
            const imageUrl = item.image_url || `https://placehold.co/120x120/E6F0F6/005A9C?text=${encodeURIComponent(item.name)}&font=Inter`;
            return `
            <div class="cart-item">
                <img src="${imageUrl}" alt="${item.name}">
                <div class="info">
                    <h5>${item.name}</h5>
                    <p><span data-i18n="consumer.soldBy">${t('consumer.soldBy')}</span> ${item.seller_name || 'N/A'}</p>
                    
                    <button class="remove-from-cart-btn" data-product-id="${item.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        <span data-i18n="consumer.remove">${t('consumer.remove')}</span>
                    </button>
                </div>
                <div class="price">
                    ₹${(item.price * item.quantity).toFixed(0)}
                    <small style="display: block; color: var(--text-light); font-weight: 400;">(${item.quantity} ${item.unit})</small>
                </div>
            </div>
            `;
        }).join('');

        const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const fee = 50;
        const total = subtotal + fee;

        summaryContainer.innerHTML = `
        <div class="cart-summary card">
            <div class="summary-row">
                <span data-i18n="consumer.subtotal">${t('consumer.subtotal')}</span>
                <span>₹${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span data-i18n="consumer.processingFee">${t('consumer.processingFee')}</span>
                <span>₹${fee.toFixed(2)}</span>
            </div>
            <div class="summary-row total">
                <span data-i18n="consumer.total">${t('consumer.total')}</span>
                <span>₹${total.toFixed(2)}</span>
            </div>
            <button id="checkout-btn" class="primary">
                <span data-i18n="consumer.checkout">${t('consumer.checkout')}</span>
            </button>
            <div id="checkout-status" style="text-align: center; margin-top: 1rem;"></div>
        </div>
        `;

        document.getElementById('checkout-btn').addEventListener('click', () => {
            checkout(cart, total);
        });
        
        attachCartItemListeners();
    }
    
    function attachCartItemListeners() {
        const container = document.getElementById('cart-items-container');
        container.querySelectorAll('.remove-from-cart-btn').forEach(button => {
            button.onclick = (e) => {
                const productId = e.currentTarget.dataset.productId;
                removeFromCart(productId);
            };
        });
    }
    
    // --- Page Loader: Profile (Unchanged) ---
    async function loadProfilePage() {
        const db = await getDb();
        if (!db || !window.currentConsumer) {
            console.error("Not ready to load profile");
            return;
        }

        const balanceDisplay = document.getElementById('wallet-balance-display');
        const profileName = document.getElementById('profile-name');
        const profileEmail = document.getElementById('profile-email');

        balanceDisplay.textContent = 'Refreshing...';
        
        const { data, error } = await db
            .from('sellers')
            .select('seller_name, wallet_balance')
            .eq('id', window.currentConsumer.id)
            .single();

        if (error) {
            console.error("Error refreshing wallet balance:", error);
            balanceDisplay.textContent = 'Error';
        } else {
            balanceDisplay.textContent = `₹${data.wallet_balance.toFixed(2)}`;
            profileName.textContent = data.seller_name;
            profileEmail.textContent = `${data.seller_name.toLowerCase().replace(' ','.')}@millet.chain`;
            window.currentConsumer.wallet_balance = data.wallet_balance;
        }
    }

    // --- Add Money Function (Unchanged) ---
    async function addMoneyToWallet(amountToAdd) {
        const db = await getDb();
        if (!db || !window.currentConsumer) {
            alert("Error: Not connected. Please try again.");
            return false;
        }

        const currentBalance = parseFloat(window.currentConsumer.wallet_balance);
        const newBalance = currentBalance + amountToAdd;

        const { error } = await db
            .from('sellers')
            .update({ wallet_balance: newBalance })
            .eq('id', window.currentConsumer.id);

        if (error) {
            console.error("Error adding money:", error);
            alert(`Error updating balance: ${error.message}`);
            return false;
        } else {
            window.currentConsumer.wallet_balance = newBalance;
            return true;
        }
    }

    window.addMoney = async () => {
        const amountStr = prompt(t('consumer.addMoneyPrompt'), "1000");
        if (amountStr === null) {
            return;
        }

        const amount = parseFloat(amountStr);
        if (isNaN(amount) || amount <= 0) {
            alert(t('consumer.invalidAmount'));
            return;
        }

        const balanceDisplay = document.getElementById('wallet-balance-display');
        balanceDisplay.textContent = t('consumer.addingMoney');

        const success = await addMoneyToWallet(amount);

        if (success) {
            alert(`₹${amount} ${t('consumer.moneyAddedSuccess')}`);
            loadProfilePage();
        }
    };


    // --- CORE FUNCTION: Load Products (Unchanged) ---
    async function loadProducts() {
        if (!productGrid) return;
        productGrid.innerHTML = `<p style="text-align: center; color: var(--text-light);" data-i18n="consumer.loadingProducts">${t('consumer.loadingProducts')}</p>`;
        const db = await getDb();
        if (!db) {
            productGrid.innerHTML = `<p style="text-align: center; color: var(--danger);">Error connecting to database.</p>`;
            return;
        }

        try {
            const { data, error } = await db
                .from('products')
                .select(`*, sellers (seller_name, seller_type)`)
                .eq('status', 'AVAILABLE') 
                .order('created_at', { ascending: false }); 

            if (error) throw error;
            if (data.length === 0) {
                 productGrid.innerHTML = `<div class="card" style="grid-column: 1 / -1;"><p style="text-align: center; color: var(--text-light);" data-i18n="consumer.allSoldOut">${t('consumer.allSoldOut')}</p></div>`;
                 return;
            }

            productGrid.innerHTML = data.map(product => {
                const isSecured = product.etherscan_link && product.tx_hash;
                const imageUrl = product.image_url || `https://placehold.co/600x400/E6F0F6/005A9C?text=${encodeURIComponent(product.product_name)}&font=Inter`;
                const seller = product.sellers || {};
                
                const traceButtonHtml = isSecured ? 
                    `<a href="trace.html?id=${product.id}" target="_blank" rel="noopener noreferrer" role="button" class="secondary"><span data-i18n="consumer.trace">${t('consumer.trace')}</span> ⛓️</a>` :
                    `<button class"secondary" disabled><span data-i18n="consumer.trace">${t('consumer.trace')}</span> (N/A)</button>`;
                
                const buyButtonHtml = `
                    <button class="primary add-to-cart-btn" data-product-id="${product.id}">
                        <span data-i18n="consumer.addToCart">${t('consumer.addToCart')}</span>
                    </button>
                `;
                
                const sellerTypeBadge = seller.seller_type === 'PROCESSOR' ? 
                    `<span class="badge warning" data-i18n="consumer.processed">${t('consumer.processed')}</span>` : 
                    `<span class="badge primary" data-i18n="consumer.rawGood">${t('consumer.rawGood')}</span>`;

                return `
                <article class="product-card" id="product-card-${product.id}">
                    <img src="${imageUrl}" alt="${product.product_name}" onerror="this.src='https://placehold.co/600x400/eee/aaa?text=Image+Error'">
                    <div class="content">
                        <hgroup>
                            <h4>${product.product_name}</h4>
                            ${sellerTypeBadge}
                        </hgroup>
                        <p class="seller-info">
                            <span data-i18n="consumer.soldBy">${t('consumer.soldBy')}</span> 
                            <strong>${seller.seller_name || "Unknown"}</strong> (${product.district || 'N/A'})
                        </p>
                        <p class="price-info">₹${product.price} <small>/ ${product.unit}</small></p>
                    </div>
                    <footer>
                        ${traceButtonHtml}
                        ${buyButtonHtml}
                    </footer>
                </article>
                `;
            }).join('');

            document.querySelectorAll('.add-to-cart-btn').forEach(button => {
                button.onclick = () => {
                    const productId = button.dataset.productId;
                    const productData = data.find(p => p.id === productId);
                    if (productData) {
                        addToCart(productData);
                    }
                };
            });
            
            if (window.applyTranslations) applyTranslations(productGrid);

        } catch (error) {
            console.error("index.js: Error fetching products:", error);
            productGrid.innerHTML = `<div class="card" style="grid-column: 1 / -1;"><p style="text-align: center; color: var(--danger);"><strong>Error loading products</strong><br><small>${error.message}</small></p></div>`;
        }
    }

    // --- Checkout Logic (Unchanged) ---
    async function checkout(cart, totalAmount) {
        console.log("Checkout initiated...");
        const checkoutBtn = document.getElementById('checkout-btn');
        const statusDiv = document.getElementById('checkout-status');
        checkoutBtn.setAttribute('aria-busy', 'true');
        checkoutBtn.disabled = true;
        statusDiv.innerHTML = `<p style="font-size: 0.9rem;" data-i18n="consumer.placingOrder">${t('consumer.placingOrder')}</p>`;

        if (!window.currentConsumer) {
            alert("Error: Consumer profile not loaded. Please reload.");
            checkoutBtn.setAttribute('aria-busy', 'false');
            checkoutBtn.disabled = false;
            return;
        }

        const db = await getDb();
        if (!db) {
            alert("Database connection lost. Please try again.");
            checkoutBtn.setAttribute('aria-busy', 'false');
            checkoutBtn.disabled = false;
            return;
        }

        try {
            for (const [index, item] of cart.entries()) {
                const itemTotal = item.price * item.quantity;
                statusDiv.innerHTML = `<p style="font-size: 0.9rem;">${t('consumer.processingItem')} ${index + 1} ${t('consumer.of')} ${cart.length}: ${item.name}...</p>`;
                
                console.log(`Processing item ${item.id}`);
                
                const { error: updateError } = await db.from('products')
                    .update({ status: 'SOLD' })
                    .eq('id', item.id)
                    .eq('status', 'AVAILABLE');
                if (updateError) throw new Error(`Failed to reserve item ${item.name}: ${updateError.message}`);
                
                const journeyEvent = {
                    product_id: item.id,
                    actor_id: window.currentConsumer.id,
                    event_icon: "🛍️",
                    event_name: "Purchased by Consumer",
                    event_details: `Purchased ${item.name} as part of a cart checkout.`
                    // tx_hash is null for this event
                };
                await db.from('product_journey').insert(journeyEvent);
                
                const orderData = {
                    product_id: item.id,
                    seller_id: item.seller_id,
                    buyer_id: window.currentConsumer.id,
                    quantity_ordered: item.quantity,
                    total_price: itemTotal,
                    order_status: 'PENDING',
                };
                const { error: orderError } = await db.from('product_orders').insert(orderData);
                if (orderError) throw new Error(`Failed to save order for ${item.name}: ${orderError.message}`);
            }

            statusDiv.innerHTML = `<p style="font-size: 0.9rem; color: var(--secondary);"><strong data-i18n="consumer.orderPlacedSuccess">${t('consumer.orderPlacedSuccess')}</strong></p>`;
            alert(t('consumer.checkoutSuccessMsg'));
            
            saveCart([]);
            loadProducts();
            showPage('orders');

        } catch (error) {
            console.error("Checkout failed:", error);
            statusDiv.innerHTML = `<p style="font-size: 0.9rem; color: var(--danger);"><strong data-i18n="consumer.checkoutFailed">${t('consumer.checkoutFailed')}</strong><br>${error.message}</p>`;
            checkoutBtn.setAttribute('aria-busy', 'false');
            checkoutBtn.disabled = false;
        }
    }

    // --- "My Orders" Function (Unchanged) ---
    async function loadMyOrders() {
        const db = await getDb();
        if (!db || !window.currentConsumer) return;

        const container = document.getElementById('orders-list-container');
        if (!container) return;
        
        container.innerHTML = `<article style="text-align: center;"><p data-i18n="consumer.loadingOrders">${t('consumer.loadingOrders')}</p><progress></progress></article>`;

        try {
            const { data: orders, error: ordersError } = await db
                .from('product_orders')
                .select(`id, created_at, order_status, total_price, quantity_ordered, product_id, seller_id, products (product_name, unit, image_url)`)
                .eq('buyer_id', window.currentConsumer.id)
                .order('created_at', { ascending: false });

            if (ordersError) throw ordersError;

            if (orders.length === 0) {
                container.innerHTML = `<article><p style="text-align: center; margin: 0;" data-i18n="consumer.noOrders">${t('consumer.noOrders')}</p></article>`;
                return;
            }

            container.innerHTML = orders.map(order => {
                const product = order.products || {};
                const purchaseDate = new Date(order.created_at).toLocaleString('en-IN', { day: 'numeric', month: 'short' });
                
                let statusBadge;
                let statusKey;
                let actionButton = `<a href="trace.html?id=${order.product_id}" target="_blank" rel="noopener noreferrer" role="button" class="primary" style="width: 100%;">
                            <span data-i18n="consumer.traceJourney">${t('consumer.traceJourney')}</span> ⛓️
                        </a>`;

                if (order.order_status === 'PENDING') {
                    statusKey = 'consumer.statusPending';
                    statusBadge = `<span class="badge warning" data-i18n="${statusKey}">${t(statusKey)}</span>`;
                } else if (order.order_status === 'SHIPPED') {
                    statusKey = 'consumer.statusShipped';
                    statusBadge = `<span class"badge" style="background-color: var(--primary-light); color: var(--primary);" data-i18n="${statusKey}">${t(statusKey)}</span>`;
                    
                    actionButton = `
                        <a href="trace.html?id=${order.product_id}" target="_blank" rel="noopener noreferrer" role="button" class="secondary" style="width: 100%;">
                            <span data-i18n="consumer.traceJourney">${t('consumer.traceJourney')}</span> ⛓️
                        </a>
                        <button class="primary confirm-delivery-btn" 
                                data-order-id="${order.id}" 
                                data-product-id="${order.product_id}"
                                data-seller-id="${order.seller_id}"
                                data-amount="${order.total_price}" 
                                style="width: 100%;">
                            <span data-i18n="consumer.confirmDelivery">${t('consumer.confirmDelivery')}</span> ✅
                        </button>
                    `;

                } else if (order.order_status === 'DELIVERED') {
                    statusKey = 'consumer.statusDelivered';
                    statusBadge = `<span class="badge success" data-i18n="${statusKey}">${t(statusKey)}</span>`;
                } else {
                    statusBadge = `<span class="badge">${order.order_status}</span>`;
                }

                return `
                <article class="order-history-item" id="order-card-${order.id}">
                    <hgroup>
                        <h5>${product.product_name || 'Product Not Found'}</h5>
                        ${statusBadge}
                    </hgroup>
                    <p style="font-size: 0.9rem; color: var(--text-light); margin-bottom: 0.5rem;">
                        <strong data-i18n="consumer.orderId">${t('consumer.orderId')}</strong> ${order.id.substring(0, 8)}...<br>
                        <strong data-i18n="consumer.purchasedOn">${t('consumer.purchasedOn')}</strong> ${purchaseDate}
                    </p>
                    <p style="font-size: 1.1rem; font-weight: 600; color: var(--text-primary); margin-bottom: 1rem;">
                        ${order.quantity_ordered} ${product.unit || ''} • <span data-i18n="consumer.total">${t('consumer.total')}</span>: ₹${order.total_price}
                    </p>
                    <footer>
                        ${actionButton}
                    </footer>
                </article>
                `;
            }).join('');
            
            attachConfirmDeliveryListeners();
            
            if (window.applyTranslations) applyTranslations(container);

        } catch (error) {
            console.error("Error loading my orders:", error);
            container.innerHTML = `<article><p style="text-align: center; color: var(--danger);">Error loading orders: ${error.message}</p></article>`;
        }
    }


    // "Confirm Delivery" Listeners (Unchanged)
    function attachConfirmDeliveryListeners() {
        const container = document.getElementById('orders-list-container');
        container.querySelectorAll('.confirm-delivery-btn').forEach(button => {
            button.onclick = (e) => {
                const btn = e.currentTarget;
                const orderId = btn.dataset.orderId;
                const productId = btn.dataset.productId;
                const sellerId = btn.dataset.sellerId;
                const amount = parseFloat(btn.dataset.amount);
                
                if (orderId && productId && sellerId && !isNaN(amount)) {
                    confirmDelivery_QuickFix(btn, orderId, productId, sellerId, amount);
                } else {
                    console.error("Missing data on confirm button:", btn.dataset);
                    alert("Error: Could not confirm delivery. Data is missing.");
                }
            };
        });
    }

    // --- [!! REVISED "Confirm Delivery" Logic !!] ---
    // Now saves tx_hash to product_journey
    async function confirmDelivery_QuickFix(buttonElement, orderId, productId, sellerId, amount) {
        console.log(`Confirming delivery for order ${orderId} with amount ${amount}`);
        buttonElement.setAttribute('aria-busy', 'true');
        buttonElement.disabled = true;

        const db = await getDb();
        if (!db || !window.currentConsumer || !window.provider) {
            alert(t('farmer.dbError'));
            buttonElement.setAttribute('aria-busy', 'false');
            buttonElement.disabled = false;
            return;
        }
        
        let txHash = null; // [!! NEW !!]

        try {
            // Step 1: Check Consumer's Wallet Balance
            if (window.currentConsumer.wallet_balance < amount) {
                alert(t('consumer.insufficientFunds'));
                throw new Error("Insufficient funds");
            }

            // Step 2: Send Blockchain Transaction
            buttonElement.innerHTML = `<span data-i18n="farmer.approveTx">${t('farmer.approveTx')}</span>`;
            
            await window.provider.send('eth_requestAccounts', []);
            const signer = window.provider.getSigner();
            const txData = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(`DELIVER:${orderId}`));
            const txObject = { 
                to: '0x000000000000000000000000000000000000dEaD', 
                value: ethers.utils.parseEther('0.0'), 
                data: txData 
            };
            
            const txResponse = await signer.sendTransaction(txObject);
            buttonElement.innerHTML = `<span data-i18n="farmer.waitingConfirmation">${t('farmer.waitingConfirmation')}</span>`;
            const txReceipt = await txResponse.wait(1);
            txHash = txReceipt.transactionHash; // [!! NEW !!] Store the hash
            console.log(`'DELIVERED' Tx sent: ${txHash}`);

            // Step 3: All DB updates (Payment Logic)
            buttonElement.innerHTML = `<span data-i18n="consumer.completingPayment">${t('consumer.completingPayment')}</span>`;
            
            // 3a. Update the order status (we no longer save the hash here)
            const { error: orderUpdateError } = await db
                .from('product_orders')
                .update({ 
                    order_status: 'DELIVERED',
                    // buyer_tx_hash: txHash // [!! REMOVED !!]
                })
                .eq('id', orderId);
            if (orderUpdateError) throw new Error(`Order update failed: ${orderUpdateError.message}`);

            // 3b. Pay the farmer (QuickFix method)
            const { data: farmerData, error: fetchError } = await db
                .from('sellers')
                .select('wallet_balance')
                .eq('id', sellerId)
                .single();
            if (fetchError) throw new Error(`Farmer fetch failed: ${fetchError.message}`);
            
            const farmerBalance = parseFloat(farmerData.wallet_balance) || 0;
            const { error: payFarmerError } = await db.from('sellers')
                .update({ wallet_balance: farmerBalance + amount })
                .eq('id', sellerId);
            if (payFarmerError) throw new Error(`Farmer payment failed: ${payFarmerError.message}`);
            console.log(`Paid farmer ${sellerId} an amount of ${amount}`);

            // 3c. Deduct from consumer
            const newConsumerBalance = window.currentConsumer.wallet_balance - amount;
            const { error: deductConsumerError } = await db
                .from('sellers')
                .update({ wallet_balance: newConsumerBalance })
                .eq('id', window.currentConsumer.id);
            if (deductConsumerError) throw new Error(`Consumer deduction failed: ${deductConsumerError.message}`);
            console.log(`Deducted ${amount} from consumer ${window.currentConsumer.id}`);
            
            // 3d. Add 'Delivered' event to journey (with tx_hash)
            const journeyEvent = {
                product_id: productId,
                actor_id: window.currentConsumer.id,
                event_icon: "✅",
                event_name: "Delivery Confirmed by Consumer",
                event_details: `Consumer confirmed receipt. TxHash: ${txHash.substring(0, 10)}...`,
                tx_hash: txHash // [!! NEW !!]
            };
            const {error: journeyError} = await db.from('product_journey').insert(journeyEvent);
            if(journeyError) console.error("Failed to add journey event:", journeyError);
            else console.log(`Added journey event: Delivery Confirmed with hash ${txHash}`);

            // Step 4: Success! Refresh UI
            alert("Delivery confirmed and payment sent!");
            window.currentConsumer.wallet_balance = newConsumerBalance;
            
            loadMyOrders();
            loadProfilePage();

        } catch (error) {
            console.error(`Error confirming delivery for ${orderId}:`, error);
            let userErrorMessage = error.message;
            if (error.code === 4001) {
                userErrorMessage = t('farmer.txRejected');
            } else if (error.message.includes("insufficient funds")) {
                userErrorMessage = t('consumer.insufficientFunds');
            }
            alert(`${t('consumer.paymentFailed')} ${userErrorMessage}`);
            
            buttonElement.setAttribute('aria-busy', 'false');
            buttonElement.disabled = false;
            buttonElement.innerHTML = `<span data-i18n="consumer.confirmDelivery">${t('consumer.confirmDelivery')}</span> ✅`;
        }
    }


    // --- Initialize Consumer Profile (Unchanged) ---
    async function initializeConsumer() {
        const db = await getDb();
        if (!db) {
            alert("Failed to connect to database.");
            return;
        }

        await new Promise(resolve => {
            const check = () => {
                if(window.t && window.setLanguage && window.applyTranslations) resolve();
                else setTimeout(check, 50);
            };
            check();
        });

        const { data, error } = await db
            .from('sellers')
            .select('id, seller_name, wallet_balance')
            .eq('seller_name', 'Kavya Joshi')
            .eq('seller_type', 'CONSUMER')
            .single();

        if (error || !data) {
            console.error("Failed to load consumer profile:", error);
            alert("Error: Could not load your user profile. Please reload.");
        } else {
            window.currentConsumer = data;
            console.log("Consumer profile loaded:", data);
            document.getElementById('consumer-name').textContent = data.seller_name;
            
            const initialLang = localStorage.getItem('milletLang') || 'en';
            setLanguage(initialLang);
            
            loadProducts();
            updateCartCount();
        }
    }
    
    // --- Initialize ---
    initializeConsumer();

}); // End of DOMContentLoaded