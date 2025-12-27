// Wait for the page to load before running any script
document.addEventListener('DOMContentLoaded', () => {
    console.log("processor.js: DOM Loaded.");

    // Global state
    window.currentProcessor = null;

    // Store references
    const appTitle = document.getElementById('app-title');
    const navButtons = document.querySelectorAll('.app-nav button');
    const appPages = document.querySelectorAll('.app-page');
    const processorNameEl = document.getElementById('processor-name');

    // --- HELPER FUNCTION: Wait for DB ---
    let dbCheckPromise = null;
    async function getDb() {
        if (typeof window.db !== 'undefined' && window.db) return window.db;
        if (!dbCheckPromise) {
            dbCheckPromise = new Promise((resolve) => {
                let dbCheckAttempts = 0; const maxDbCheckAttempts = 10;
                const tryCheck = () => {
                    if (typeof window.db !== 'undefined' && window.db) {
                        console.log("processor.js: DB ready."); resolve(window.db);
                    } else if (dbCheckAttempts < maxDbCheckAttempts) {
                        dbCheckAttempts++; console.warn(`processor.js: DB retry ${dbCheckAttempts}`); setTimeout(tryCheck, 500);
                    } else { console.error("processor.js: DB connect failed."); resolve(null); }
                }; tryCheck();
            });
        }
        return dbCheckPromise;
    }

    // --- Initialize Processor Profile ---
    async function initializeProcessor() {
        const db = await getDb();
        if (!db) {
            processorNameEl.textContent = 'Error';
            return;
        }

        const { data, error } = await db
            .from('sellers')
            .select('id, seller_name, wallet_balance')
            .eq('seller_name', 'Ahmedabad Foods') // Hardcoded as per your plan
            .eq('seller_type', 'PROCESSOR')
            .single();

        if (error || !data) {
            console.error("Failed to load processor profile:", error);
            alert("Processor profile 'Ahmedabad Foods' not found.");
            processorNameEl.textContent = 'Not Found';
        } else {
            window.currentProcessor = data;
            processorNameEl.textContent = data.seller_name;
            console.log("Processor profile loaded:", window.currentProcessor);

            // Load the default page
            showPage('sourcing');
        }
    }


    // --- Page Switching Logic ---
    window.showPage = (pageId) => {
        console.log(`processor.js: showPage called with ID: ${pageId}`);
        
        let title = 'Sourcing';
        if (pageId === 'inventory') title = 'My Inventory';
        if (pageId === 'addproduct') title = 'Add Processed Product';
        if (pageId === 'orders') title = 'My Bulk Orders';
        if (pageId === 'profile') title = 'Company Profile';

        if (appTitle) appTitle.textContent = title;
        appPages.forEach(page => page.classList.remove('active'));
        const targetPage = document.getElementById('page-' + pageId);
        if (targetPage) targetPage.classList.add('active');

        navButtons.forEach(button => button.classList.remove('active'));
        const targetNavButton = document.getElementById('nav-' + pageId);
        if (targetNavButton) targetNavButton.classList.add('active');

        // Load data for relevant pages
        if (pageId === 'sourcing') {
            loadSourcingListings();
        } else if (pageId === 'inventory') {
            loadMyInventory();
        } else if (pageId === 'addproduct') {
            loadMyListedProducts(); 
            loadMyPurchasedProducts(); // Load dropdown
            loadIncomingOrders();      // [!! NEW !!] Load orders for processor's products
        } else if (pageId === 'orders') {
            loadMyBulkOrders();
        } else if (pageId === 'profile') {
            loadProcessorProfile();
        }
    };

    // --- Load Sourcing Listings ---
    async function loadSourcingListings() {
        const productList = document.getElementById('product-list-b2b');
        if (!productList) return;
        productList.innerHTML = `<p class="text-center text-gray-500 py-4">Loading listings...</p>`;
        
        const db = await getDb();
        if (!db || !window.currentProcessor) { productList.innerHTML = `<p class="error">DB Error</p>`; return; }
        
        try {
            const { data, error } = await db.from('products')
                .select(`*, sellers ( id, seller_name, seller_type )`)
                .eq('status', 'AVAILABLE')
                .neq('seller_id', window.currentProcessor.id)
                .order('created_at', { ascending: false });
                
            if (error) throw error;
            if (data.length === 0) {
                productList.innerHTML = `<div class="card bg-white"><p class="text-center text-gray-500 py-4">No available raw goods listings found.</p></div>`;
                return;
            }

            productList.innerHTML = data.map(product => {
                const seller = product.sellers;
                const isSecured = product.etherscan_link && product.tx_hash;
                const certificateBadge = product.certificate_url ? `<span class="badge success">Certified</span>` : `<span class="badge warning">Uncertified</span>`;
                const traceButtonHtml = isSecured ?
                    `<a href="trace.html?id=${product.id}" role="button" class="secondary" title="View product journey" target="_blank">Trace ⛓️</a>` :
                    `<button class="secondary" disabled title="Traceability not available">Trace (N/A)</button>`;
                const imageUrl = product.image_url || `https://placehold.co/600x400/E6F0F6/005A9C?text=${encodeURIComponent(product.product_name)}&font=Inter`;

                return `
                <article class="product-card b2b-card card bg-white shadow-sm border border-gray-200">
                     <img src="${imageUrl}" alt="${product.product_name}" onerror="this.onerror=null; this.src='https://placehold.co/600x400/eee/aaa?text=Image+Error'">
                     <div class="content p-4">
                         <hgroup>
                             <h4 class="text-base font-semibold text-gray-800">${product.product_name}</h4>
                             <p class="seller-info text-sm text-gray-600">
                                Sold by: <strong>${seller ? seller.seller_name : 'Unknown Seller'}</strong>
                             </p>
                         </hgroup>
                         <div class="details mt-2">
                             <p class="badges flex gap-2"> ${certificateBadge} ${isSecured ? `<span class="badge success">Secured</span>` : ''} </p>
                             <p class="availability text-sm text-gray-600 mt-2">
                                Available: <strong>${product.quantity} ${product.unit}</strong>
                             </p>
                             <p class="price-info text-lg font-bold text-primary mt-1">
                                <strong>₹${product.price}</strong> <small class="text-sm font-medium text-gray-500">/ ${product.unit}</small>
                             </p>
                         </div>
                     </div>
                     <footer class="p-4 bg-gray-50 border-t border-gray-200">
                         ${traceButtonHtml}
                         <button class="primary buy-now-btn" 
                                 data-product-id="${product.id}"
                                 data-seller-id="${seller ? seller.id : ''}" 
                                 data-product-name="${product.product_name}" 
                                 data-quantity="${product.quantity}"
                                 data-price="${product.price}"
                                 data-unit="${product.unit}"
                                 title="Confirm purchase (creates PENDING order)">
                             Buy Now
                         </button>
                     </footer>
                 </article>`;
            }).join('');
            
            attachBuyNowListeners();

        } catch (error) {
            console.error("processor.js: Error fetching sourcing products:", error);
            productList.innerHTML = `<p class="error">Error loading listings: ${error.message}</p>`;
        }
    }

    // --- "BUY NOW" LOGIC ---
    function attachBuyNowListeners() {
        console.log("Attaching buy now listeners...");
        document.querySelectorAll('.buy-now-btn').forEach(button => {
            button.onclick = null; // Clear previous listener
            button.onclick = async (event) => {
                const targetButton = event.currentTarget;
                const productId = targetButton.dataset.productId;
                const sellerId = targetButton.dataset.sellerId; 
                const productName = targetButton.dataset.productName;
                const quantity = targetButton.dataset.quantity;
                const price = targetButton.dataset.price;
                
                if (!productId || !sellerId || !window.currentProcessor) {
                    alert("Error: Missing product data or processor profile.");
                    console.error("Buy Now Error: Missing data", targetButton.dataset, window.currentProcessor);
                    return;
                }
                console.log(`Attempting to buy Product ID: ${productId}`);

                targetButton.setAttribute('aria-busy', 'true');
                targetButton.disabled = true;
                const originalButtonText = targetButton.innerHTML;
                targetButton.innerHTML = `<span>Processing...</span>`;

                try {
                    const db = await getDb();
                    if (!db) throw new Error("Database connection failed.");

                    const processorId = window.currentProcessor.id;
                    const itemTotal = parseFloat(price) * parseFloat(quantity);

                    // 1. Update Product Status in DB to 'SOLD'
                    targetButton.innerHTML = `<span>Reserving item...</span>`;
                    const { error: updateError } = await db.from('products')
                        .update({ status: 'SOLD' })
                        .eq('id', productId)
                        .eq('status', 'AVAILABLE');
                    
                    if (updateError) throw new Error(`DB update failed: ${updateError.message}`);
                    console.log(`Product ${productId} marked as SOLD.`);

                    // 2. Create the 'PENDING' order
                    const orderData = {
                        product_id: productId,
                        seller_id: sellerId,     
                        buyer_id: processorId,   
                        quantity_ordered: parseFloat(quantity),
                        total_price: itemTotal,
                        order_status: 'PENDING',
                    };
                    const { error: orderError } = await db.from('product_orders').insert(orderData);
                    if (orderError) throw new Error(`Failed to save order: ${orderError.message}`); 
                    
                    // 3. Add Journey Event
                    targetButton.innerHTML = `<span>Logging Journey...</span>`;
                    const journeyEvent = {
                        product_id: productId,
                        actor_id: processorId,
                        event_icon: "🛍️",
                        event_name: "Purchased by Processor",
                        event_details: `Processor '${window.currentProcessor.seller_name}' purchased ${productName}. Order is PENDING.`
                    };
                    await db.from('product_journey').insert(journeyEvent);

                    // 4. Success
                    targetButton.innerHTML = `<span>Order Placed!</span> ✅`;
                    targetButton.classList.remove('primary');
                    targetButton.classList.add('success');
                    targetButton.disabled = true; 
                    
                    alert("Order Placed! The farmer has been notified to ship your item.");
                    loadSourcingListings(); // Refresh the sourcing list

                } catch (error) {
                    console.error("processor.js: Error during Buy Now:", error);
                    alert(`Purchase Failed: ${error.message}`);
                    targetButton.innerHTML = originalButtonText;
                    targetButton.setAttribute('aria-busy', 'false');
                    targetButton.disabled = false;
                }
            };
        });
    }

    // --- "MY ORDERS" PAGE (Processor Purchases) ---
    async function loadMyBulkOrders() {
        const container = document.getElementById('my-bulk-orders-list');
        if (!container) return;
        
        container.innerHTML = `<p class="text-center text-gray-500 py-4">Loading your orders...</p>`;

        const db = await getDb();
        if (!db || !window.currentProcessor) return;

        try {
            const { data: orders, error: ordersError } = await db
                .from('product_orders')
                .select(`id, created_at, order_status, total_price, quantity_ordered, product_id, seller_id, products (product_name, unit, image_url, sellers (seller_name))`)
                .eq('buyer_id', window.currentProcessor.id)
                .order('created_at', { ascending: false });

            if (ordersError) throw ordersError;

            if (orders.length === 0) {
                container.innerHTML = `<div class="card bg-white"><p class="text-center text-gray-500 py-4">You have not placed any bulk orders yet.</p></div>`;
                return;
            }

            container.innerHTML = orders.map(order => {
                const product = order.products || {};
                const seller = product.sellers || {};
                const purchaseDate = new Date(order.created_at).toLocaleString('en-IN', { day: 'numeric', month: 'short' });
                
                let statusBadge;
                let actionButton = `<a href="trace.html?id=${order.product_id}" target="_blank" rel="noopener noreferrer" role="button" class="primary" style="width: 100%;">
                            <span>Trace Full Journey</span> ⛓️
                        </a>`;

                if (order.order_status === 'PENDING') {
                    statusBadge = `<span class="badge warning">Pending</span>`;
                    actionButton = `<p class="text-sm text-gray-500 text-center">Waiting for farmer to ship.</p>`;
                } else if (order.order_status === 'SHIPPED') {
                    statusBadge = `<span class="badge" style="background-color: var(--primary-light); color: var(--primary);">Shipped</span>`;
                    actionButton = `
                        <a href="trace.html?id=${order.product_id}" target="_blank" rel="noopener noreferrer" role="button" class="secondary" style="width: 100%;">
                            <span>Trace Full Journey</span> ⛓️
                        </a>
                        <button class="primary confirm-delivery-btn" 
                                data-order-id="${order.id}" 
                                data-product-id="${order.product_id}"
                                data-seller-id="${order.seller_id}"
                                data-amount="${order.total_price}" 
                                style="width: 100%;">
                            <span>Confirm Delivery</span> ✅
                        </button>
                    `;
                } else if (order.order_status === 'DELIVERED') {
                    statusBadge = `<span class="badge success">Delivered</span>`;
                } else {
                    statusBadge = `<span class="badge">${order.order_status}</span>`;
                }

                return `
                <article class="order-history-item card bg-white shadow-sm border border-gray-200" id="order-card-${order.id}">
                    <div class="p-4">
                        <hgroup class="flex justify-between items-center mb-2">
                            <h5 class="text-base font-semibold text-gray-800">${product.product_name || 'Product Not Found'}</h5>
                            ${statusBadge}
                        </hgroup>
                        <p class="text-sm text-gray-600 mb-2">
                            Sold by: <strong>${seller.seller_name || 'N/A'}</strong><br>
                            Purchased on: ${purchaseDate}
                        </p>
                        <p class="text-lg font-semibold text-primary mb-4">
                            ${order.quantity_ordered} ${product.unit || ''} • Total: ₹${order.total_price.toFixed(0)}
                        </p>
                    </div>
                    <footer class="p-4 bg-gray-50 border-t border-gray-200">
                        ${actionButton}
                    </footer>
                </article>
                `;
            }).join('');
            
            attachConfirmDeliveryListeners();

        } catch (error) {
            console.error("Error loading my orders:", error);
            container.innerHTML = `<article class="card bg-white"><p class="text-center text-danger p-4">Error loading orders: ${error.message}</p></article>`;
        }
    }

    // --- "CONFIRM DELIVERY" LOGIC (For Processor Purchases) ---
    function attachConfirmDeliveryListeners() {
        const container = document.getElementById('my-bulk-orders-list');
        if (!container) return; // Make sure container exists
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

    async function confirmDelivery_QuickFix(buttonElement, orderId, productId, sellerId, amount) {
        console.log(`Confirming delivery for order ${orderId} with amount ${amount}`);
        buttonElement.setAttribute('aria-busy', 'true');
        buttonElement.disabled = true;

        const db = await getDb();
        if (!db || !window.currentProcessor || !window.provider) {
            alert("Database connection error. Please reload.");
            buttonElement.setAttribute('aria-busy', 'false');
            buttonElement.disabled = false;
            return;
        }
        
        let txHash = null;

        try {
            // Step 1: Check Processor's Wallet Balance
            if (window.currentProcessor.wallet_balance < amount) {
                alert("Insufficient funds in your wallet. Please add money first.");
                throw new Error("Insufficient funds");
            }

            // Step 2: Send Blockchain Transaction
            buttonElement.innerHTML = `<span>Approve in MetaMask...</span>`;
            
            await window.provider.send('eth_requestAccounts', []);
            const signer = window.provider.getSigner();
            const txData = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(`DELIVER:${orderId}`));
            const txObject = { 
                to: '0x000000000000000000000000000000000000dEaD', 
                value: ethers.utils.parseEther('0.0'), 
                data: txData 
            };
            
            const txResponse = await signer.sendTransaction(txObject);
            buttonElement.innerHTML = `<span>Confirming Tx...</span>`;
            const txReceipt = await txResponse.wait(1);
            txHash = txReceipt.transactionHash;
            console.log(`'DELIVERED' Tx sent: ${txHash}`);

            // Step 3: All DB updates (Payment Logic)
            buttonElement.innerHTML = `<span>Completing payment...</span>`;
            
            // 3a. Update the order status
            const { error: orderUpdateError } = await db
                .from('product_orders')
                .update({ order_status: 'DELIVERED' })
                .eq('id', orderId);
            if (orderUpdateError) throw new Error(`Order update failed: ${orderUpdateError.message}`);

            // 3b. Pay the farmer
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

            // 3c. Deduct from processor
            const newProcessorBalance = window.currentProcessor.wallet_balance - amount;
            const { error: deductError } = await db
                .from('sellers')
                .update({ wallet_balance: newProcessorBalance })
                .eq('id', window.currentProcessor.id);
            if (deductError) throw new Error(`Processor deduction failed: ${deductError.message}`);
            
            // 3d. Add 'Delivered' event to journey
            const journeyEvent = {
                product_id: productId,
                actor_id: window.currentProcessor.id,
                event_icon: "✅",
                event_name: "Delivery Confirmed by Processor",
                event_details: `Processor confirmed receipt. TxHash: ${txHash.substring(0, 10)}...`,
                tx_hash: txHash
            };
            await db.from('product_journey').insert(journeyEvent);

            // Step 4: Success! Refresh UI
            alert("Delivery confirmed and payment sent!");
            window.currentProcessor.wallet_balance = newProcessorBalance;
            
            loadMyBulkOrders();
            if (document.getElementById('page-profile').classList.contains('active')) {
                loadProcessorProfile();
            }

        } catch (error) {
            console.error(`Error confirming delivery for ${orderId}:`, error);
            let userErrorMessage = "Payment Failed.";
            if (error.code === 4001) {
                userErrorMessage = "Transaction rejected in MetaMask.";
            } else if (error.message.includes("Insufficient funds")) {
                userErrorMessage = "Insufficient funds in your wallet.";
            }
            alert(userErrorMessage);
            
            buttonElement.setAttribute('aria-busy', 'false');
            buttonElement.disabled = false;
            buttonElement.innerHTML = `<span>Confirm Delivery</span> ✅`;
        }
    }


    // --- "PROFILE & PAYMENTS" PAGE ---
    async function loadProcessorProfile() {
        const db = await getDb();
        if (!db || !window.currentProcessor) return;

        const balanceDisplay = document.getElementById('wallet-balance-display');
        const profileName = document.getElementById('profile-name');
        const profileEmail = document.getElementById('profile-email');
        const withdrawBtn = document.getElementById('withdraw-btn');
        const addMoneyBtn = document.getElementById('add-money-btn');

        balanceDisplay.textContent = 'Refreshing...';
        
        const { data, error } = await db
            .from('sellers')
            .select('seller_name, wallet_balance')
            .eq('id', window.currentProcessor.id)
            .single();

        if (error) {
            console.error("Error refreshing wallet balance:", error);
            balanceDisplay.textContent = 'Error';
        } else {
            balanceDisplay.textContent = `₹${data.wallet_balance.toFixed(2)}`;
            profileName.textContent = data.seller_name;
            profileEmail.textContent = `procurement@${data.seller_name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
            window.currentProcessor.wallet_balance = data.wallet_balance;
        }

        // Attach listeners
        if (withdrawBtn) {
            withdrawBtn.onclick = null; 
            withdrawBtn.onclick = withdrawFunds;
        }
        if (addMoneyBtn) {
            addMoneyBtn.onclick = null;
            addMoneyBtn.onclick = addMoney;
        }

        loadTransactionHistory();
    }

    async function loadTransactionHistory() {
        const listElement = document.getElementById('transaction-history-list');
        listElement.innerHTML = `<p class="text-center text-gray-500 text-sm py-4">Loading...</p>`;

        const db = await getDb();
        if (!db || !window.currentProcessor) return;

        const processorId = window.currentProcessor.id;
        let allTransactions = [];

        try {
            // 1. Get money IN (Sales of processed goods)
            const { data: sales, error: salesError } = await db
                .from('product_orders')
                .select(`id, created_at, total_price, products ( product_name )`)
                .eq('seller_id', processorId)
                .eq('order_status', 'DELIVERED');
            
            if(salesError) throw salesError;
            sales.forEach(s => allTransactions.push({ type: 'in', data: s }));

            // 2. Get money OUT (Purchases of raw goods)
            const { data: purchases, error: purchasesError } = await db
                .from('product_orders')
                .select(`id, created_at, total_price, products ( product_name )`)
                .eq('buyer_id', processorId)
                .eq('order_status', 'DELIVERED');
            
            if(purchasesError) throw purchasesError;
            purchases.forEach(p => allTransactions.push({ type: 'out', data: p }));

            // 3. Sort by date
            allTransactions.sort((a, b) => new Date(b.data.created_at) - new Date(a.data.created_at));

            if (allTransactions.length === 0) {
                 const emptyStateHTML = `<div class="empty-state text-center py-4">
                    <svg class="mx-auto h-10 w-10 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.768 0-1.536.219-2.121.659-.922.688-.922 1.81 0 2.498l.879.659Z" /></svg>
                    <p class="text-sm font-medium text-gray-600 mt-2">No Transaction History</p>
                    <p class="text-xs text-gray-500">Your transaction history will appear here.</p>
                </div>`;
                listElement.innerHTML = emptyStateHTML;
                return;
            }

            listElement.innerHTML = allTransactions.map(tx => {
                const item = tx.data;
                const productInfo = item.products || { product_name: 'Unknown'};
                const date = new Date(item.created_at).toLocaleDateString('en-IN');
                const price = (parseFloat(item.total_price) || 0).toFixed(2);
                
                if (tx.type === 'in') {
                    return `
                    <div class="transaction-item flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0">
                        <div>
                            <p class="text-sm font-medium text-gray-800 mb-0">Sale of ${productInfo.product_name}</p>
                            <small class="text-xs text-gray-500">${date}</small>
                        </div>
                        <span class="text-base font-semibold text-secondary">+₹${price}</span>
                    </div>`;
                } else {
                    return `
                    <div class="transaction-item flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0">
                        <div>
                            <p class="text-sm font-medium text-gray-800 mb-0">Purchase of ${productInfo.product_name}</p>
                            <small class="text-xs text-gray-500">${date}</small>
                        </div>
                        <span class="text-base font-semibold text-danger">-₹${price}</span>
                    </div>`;
                }
            }).join('');
            
        } catch (error) {
            console.error("Error loading transaction history:", error);
            listElement.innerHTML = `<p class="text-center text-danger text-sm py-4">${error.message}</p>`;
        }
    }

    // --- WALLET FUNCTIONS ---
    async function addMoney() {
        const amountStr = prompt("Enter amount to add to your wallet:", "10000");
        if (amountStr === null) return;
        const amount = parseFloat(amountStr);
        if (isNaN(amount) || amount <= 0) {
            alert("Invalid amount. Please enter a positive number."); return;
        }

        const db = await getDb();
        if (!db || !window.currentProcessor) {
            alert("Error: Not connected. Please try again."); return;
        }

        const balanceDisplay = document.getElementById('wallet-balance-display');
        balanceDisplay.textContent = "Adding...";

        const currentBalance = parseFloat(window.currentProcessor.wallet_balance);
        const newBalance = currentBalance + amount;

        const { error } = await db
            .from('sellers')
            .update({ wallet_balance: newBalance })
            .eq('id', window.currentProcessor.id);

        if (error) {
            alert(`Error updating balance: ${error.message}`);
            loadProcessorProfile(); // Revert
        } else {
            window.currentProcessor.wallet_balance = newBalance;
            alert(`₹${amount} added successfully!`);
            loadProcessorProfile(); // Refresh
        }
    };

    async function withdrawFunds() {
        const db = await getDb();
        if (!db || !window.currentProcessor) {
            alert("Error: Database or profile not ready."); return;
        }

        const currentBalance = parseFloat(window.currentProcessor.wallet_balance) || 0;
        const amountStr = prompt("Enter amount to withdraw:", "1000");
        if (amountStr === null) return; 

        const amount = parseFloat(amountStr);
        if (isNaN(amount) || amount <= 0) {
            alert("Invalid amount. Please enter a positive number."); return;
        }
        if (amount > currentBalance) {
            alert(`Insufficient funds. You only have ₹${currentBalance.toFixed(2)}.`); return;
        }
        
        const withdrawBtn = document.getElementById('withdraw-btn');
        withdrawBtn.setAttribute('aria-busy', 'true');
        withdrawBtn.disabled = true;

        try {
            const newBalance = currentBalance - amount;
            const { error } = await db
                .from('sellers')
                .update({ wallet_balance: newBalance })
                .eq('id', window.currentProcessor.id);
            if (error) throw error;
            
            window.currentProcessor.wallet_balance = newBalance;
            alert(`Withdrawal of ₹${amount.toFixed(2)} successful! Your new balance is ₹${newBalance.toFixed(2)}.`);
            loadProcessorProfile(); 

        } catch (error) {
            console.error("Withdrawal failed:", error);
            alert("Withdrawal failed. Please try again.");
        } finally {
            withdrawBtn.setAttribute('aria-busy', 'false');
            withdrawBtn.disabled = false;
        }
    }


    // --- "INVENTORY" PAGE ---
    async function loadMyInventory() {
        const container = document.getElementById('inventory-list');
        if (!container) return;

        container.innerHTML = `<p class="text-center text-gray-500 py-4">Loading...</p>`;
        
        const db = await getDb();
        if (!db || !window.currentProcessor) return;

        try {
            // This page *correctly* only shows DELIVERED items
            const { data: orders, error } = await db
                .from('product_orders')
                .select(`id, quantity_ordered, products (product_name, unit, sellers (seller_name))`)
                .eq('buyer_id', window.currentProcessor.id)
                .eq('order_status', 'DELIVERED')
                .order('created_at', { ascending: false });
            
            if(error) throw error;

            if (orders.length === 0) {
                container.innerHTML = `<div class="card bg-white"><p class="text-center text-gray-500 py-4">Your inventory is empty. Purchase raw goods and confirm delivery.</p></div>`;
                return;
            }

            container.innerHTML = orders.map(order => {
                const product = order.products || {};
                const seller = product.sellers || {};
                return `
                <div class="card inventory-item bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h5 class="text-base font-semibold text-gray-800">${product.product_name}</h5>
                    <p class="text-sm text-gray-600">
                        Purchased from: <strong>${seller.seller_name || 'N/A'}</strong>
                    </p>
                    <p class="text-lg font-bold text-primary mt-2">
                        ${order.quantity_ordered} ${product.unit}
                    </p>
                </div>
                `;
            }).join('');
            
        } catch (error) {
            console.error("Error loading inventory:", error);
            container.innerHTML = `<p class="text-center text-danger p-4">${error.message}</p>`;
        }
    }


    // --- Load "Add Product" Dropdown ---
    async function loadMyPurchasedProducts() {
        const sourceDropdown = document.getElementById('proc-source-product');
        if (!sourceDropdown) return; 

        sourceDropdown.innerHTML = `<option value="">Loading sources...</option>`;
        const db = await getDb();
        if (!db || !window.currentProcessor) {
            sourceDropdown.innerHTML = `<option value="">DB Error</option>`;
            return;
        }

        try {
            // Get ALL orders placed by this processor
            const { data, error } = await db
                .from('product_orders')
                .select(`id, product_id, order_status, products (product_name, sellers (seller_name))`)
                .eq('buyer_id', window.currentProcessor.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            
            if (data.length === 0) {
                sourceDropdown.innerHTML = `<option value="">No raw materials purchased yet.</option>`;
                return;
            }

            // Populate the dropdown
            sourceDropdown.innerHTML = `
                <option value="">None (or multiple sources)</option>
                ${data.map(order => {
                    const product = order.products || {};
                    const seller = product.sellers || {};
                    return `
                    <option value="${order.product_id}">
                        ${product.product_name} (from ${seller.seller_name || 'N/A'}) - [${order.order_status}]
                    </option>`
                }).join('')}
            `;
            
        } catch (error) {
            console.error("loadMyPurchasedProducts Error:", error);
            sourceDropdown.innerHTML = `<option value="">Error loading sources</option>`;
        }
    }

    // --- [!! FIX: Re-added this function !!] ---
    // --- Load My Listed Products (Processor's Own Products) ---
    async function loadMyListedProducts() {
         const myList = document.getElementById('my-products-list'); 
         if (!myList) return;
         myList.innerHTML = `<p class="text-center text-gray-500 py-4">Loading...</p>`;
         
         const db = await getDb(); 
         if (!db || !window.currentProcessor) { 
             myList.innerHTML = `<p class="text-danger">Error: Not connected.</p>`;
             return; 
         }
         
         try {
             // Use the global processor ID
             const processorSellerId = window.currentProcessor.id;
             const { data, error } = await db.from('products').select('*').eq('seller_id', processorSellerId).order('created_at', { ascending: false });
             
             if (error) throw error; 
             
             if (data.length === 0) { 
                myList.innerHTML = `<p class="text-center text-gray-500 py-4">You have not listed any products yet.</p>`;
                return; 
             }
             
             // Render the list
             myList.innerHTML = data.map(product => {
                 const isSecured = product.etherscan_link && product.tx_hash;
                 const traceButtonHtml = isSecured ? `<a href="trace.html?id=${product.id}" role="button" class="secondary" target="_blank">Trace ⛓️</a>` : `<button class="secondary" disabled>Trace (N/A)</button>`;
                 return `
                 <article class="card my-product-item bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                     <div class="flex justify-between items-center">
                        <h5 class="text-base font-semibold text-gray-800">${product.product_name}</h5>
                        ${isSecured ? `<span class="badge success">Secured</span>` : `<span class="badge warning">Not Secured</span>`}
                     </div>
                     <p class="text-sm text-gray-600 mt-1">
                        Available: <strong>${product.quantity} ${product.unit}</strong> | 
                        Price: <strong>₹${product.price} / ${product.unit}</strong>
                     </p>
                     <footer class="mt-4 flex gap-2">
                        ${traceButtonHtml} 
                        <button class="secondary">Edit</button> 
                        <button class="danger">Delete</button>
                     </footer>
                 </article>`;
             }).join('');

         } catch (error) { 
            console.error("Error fetching my products:", error); 
            myList.innerHTML = `<p class="text-danger">Error loading products: ${error.message}</p>`; 
         }
    }


    // --- "Add Product" Form Logic ---
    const procListBtn = document.getElementById('proc-list-btn'); 
    const procBlockchainBtn = document.getElementById('proc-blockchain-btn'); 
    const procSubmitStatus = document.getElementById('proc-submit-status'); 
    const procProductForm = document.getElementById('processed-product-form'); 
    const procNameInput = document.getElementById('proc-product-name'); 
    const procQtyInput = document.getElementById('proc-quantity'); 
    const procPriceInput = document.getElementById('proc-price'); 
    const procUnitInput = document.getElementById('proc-unit');
    const procSourceProductSelect = document.getElementById('proc-source-product');

    if (procListBtn && procBlockchainBtn && procSubmitStatus && procProductForm) {
        procListBtn.onclick = async () => { 
            const db = await getDb(); 
            if (!db || !window.currentProcessor) { 
                procSubmitStatus.innerHTML = `<small class="text-danger">Error: Database or profile not ready.</small>`;
                return; 
            }
            
            const procName = procNameInput.value; 
            const procQty = procQtyInput.value; 
            const procPrice = procPriceInput.value; 
            const procUnit = procUnitInput.value; 
            const procSourceId = procSourceProductSelect.value; 

            if (!procName || !procQty || !procPrice || !procUnit) { 
                procSubmitStatus.innerHTML = `<small class="text-danger">Please fill out all required fields.</small>`;
                return; 
            }

            procListBtn.setAttribute('aria-busy', 'true'); procListBtn.disabled = true; 
            procSubmitStatus.innerHTML = `<small class="text-gray-600">Saving product...</small>`; 
            procBlockchainBtn.disabled = true;
            
            try {
                const processorSellerId = window.currentProcessor.id;
                const productData = { 
                    seller_id: processorSellerId, 
                    product_name: procName, 
                    quantity: parseInt(procQty, 10), 
                    unit: procUnit, 
                    price: parseFloat(procPrice),
                    source_product_id: procSourceId ? procSourceId : null
                };
                
                const { data: insertData, error: insertError } = await db.from('products').insert(productData).select().single(); 
                if (insertError) throw insertError; 
                if (!insertData) throw new Error("Insert failed"); 
                
                const newProductId = insertData.id;
                const journeyEvent = { 
                    product_id: newProductId, 
                    actor_id: processorSellerId, 
                    event_icon: "🏭", 
                    event_name: "Listed by Processor", 
                    event_details: `Listed ${productData.quantity} ${productData.unit} of ${productData.product_name}.` 
                }; 
                await db.from('product_journey').insert(journeyEvent);
                
                procListBtn.setAttribute('aria-busy', 'false'); 
                procListBtn.innerHTML = `<span>✅ Saved!</span>`; 
                procListBtn.style.background = 'var(--secondary)'; 
                procListBtn.style.borderColor = 'var(--secondary)'; 
                procBlockchainBtn.removeAttribute('disabled'); 
                procBlockchainBtn.classList.remove('secondary'); 
                procBlockchainBtn.classList.add('primary'); 
                procSubmitStatus.innerHTML = `<p class="text-green-700 font-medium">Success! Product listed.</p>`; 
                procListBtn.dataset.productId = newProductId; 
                
                loadMyListedProducts(); // <-- Now this works

            } catch (error) { 
                console.error(error); 
                procListBtn.setAttribute('aria-busy', 'false'); 
                procListBtn.disabled = false; 
                procListBtn.innerHTML = `<span>1. List Processed Product</span>`; 
                procSubmitStatus.innerHTML = `<small class="text-danger">Listing Failed: ${error.message}</small>`; 
            }
        };
        
        procBlockchainBtn.onclick = async () => { 
            const productId = procListBtn.dataset.productId; 
            const sellerId = window.currentProcessor.id; 
            if (!productId) { return; } 
            if (typeof window.provider === 'undefined' || typeof ethers === 'undefined') { 
                procSubmitStatus.innerHTML = `<small class="text-danger">Error: MetaMask connection not ready.</small>`;
                return; 
            } 
            const db = await getDb(); 
            if (!db) { return; }

            const destinationAddress = '0x000000000000000000000000000000000000dEaD';
            
            try {
                procBlockchainBtn.setAttribute('aria-busy', 'true'); 
                procBlockchainBtn.disabled = true; 
                procListBtn.disabled = true; 
                procSubmitStatus.innerHTML = `<small class="text-gray-600">Please approve in MetaMask...</small>`;
                
                await window.provider.send('eth_requestAccounts', []); 
                const signer = window.provider.getSigner(); 
                const txDataPayload = `PROC:${productId}`; 
                const txData = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(txDataPayload)); 
                const txObject = { to: destinationAddress, value: ethers.utils.parseEther('0.0'), data: txData };
                
                procSubmitStatus.innerHTML = `<small class="text-gray-600">Approve transaction...</small>`; 
                const txResponse = await signer.sendTransaction(txObject); 
                
                procSubmitStatus.innerHTML = `<small class="text-gray-600">Waiting for confirmation...</small>`; 
                const txReceipt = await txResponse.wait(1); 
                const txHash = txReceipt.transactionHash; 
                const etherscanLink = `https://sepolia.etherscan.io/tx/${txHash}`;
                
                const journeyEvent = { 
                    product_id: productId, 
                    actor_id: sellerId, 
                    event_icon: "🔗", 
                    event_name: "Secured on Blockchain", 
                    event_details: `Immutable record. Tx: ${txHash.substring(0, 10)}...`,
                    tx_hash: txHash 
                }; 
                await db.from('product_journey').insert(journeyEvent);
                
                procSubmitStatus.innerHTML = `<small class="text-gray-600">Saving proof...</small>`; 
                await db.from('products').update({ tx_hash: txHash, etherscan_link: etherscanLink }).eq('id', productId);
                
                procBlockchainBtn.setAttribute('aria-busy', 'false'); 
                procBlockchainBtn.innerHTML = `<span>⛓️ Secured!</span>`; 
                procBlockchainBtn.style.background = 'var(--secondary)'; 
                procBlockchainBtn.style.borderColor = 'var(--secondary)'; 
                procSubmitStatus.innerHTML = `<p class="text-green-700 font-medium">Done! <a href="${etherscanLink}" target="_blank" class="text-primary hover:underline">View on Etherscan</a></p>`;
                
                procProductForm.reset(); 
                loadMyPurchasedProducts(); // Refresh dropdown
                delete procListBtn.dataset.productId; 
                
                procListBtn.disabled = false; 
                procListBtn.innerHTML = `<span>1. List Processed Product</span>`; 
                procListBtn.style.background = ''; 
                procListBtn.style.borderColor = ''; 
                procBlockchainBtn.disabled = true; 
                procBlockchainBtn.classList.remove('primary'); 
                procBlockchainBtn.classList.add('secondary'); 
                procBlockchainBtn.innerHTML = `<span>2. Secure on Blockchain</span>`; 
                procBlockchainBtn.style.background = ''; 
                procBlockchainBtn.style.borderColor = ''; 
                
                loadMyListedProducts(); // <-- Now this works

            } catch (error) { 
                console.error(error); 
                let errMsg = "Securing Failed."; 
                if(error.code===4001) errMsg="Transaction rejected in MetaMask."; 
                
                procBlockchainBtn.setAttribute('aria-busy', 'false'); 
                procBlockchainBtn.disabled = false; 
                procListBtn.disabled = false; 
                procBlockchainBtn.innerHTML = `<span>2. Secure on Blockchain</span>`; 
                procSubmitStatus.innerHTML = `<small class="text-danger">${errMsg}</small>`; 
                
                procListBtn.innerHTML = `<span>✅ Saved!</span>`; 
                procListBtn.style.background = 'var(--secondary)'; 
                procListBtn.style.borderColor = 'var(--secondary)'; 
                procBlockchainBtn.classList.remove('secondary'); 
                procBlockchainBtn.classList.add('primary'); 
            }
        };
    } else { console.error("processor.js: Critical UI elements for ADD form not found."); }

    // --- [!! NEW: Incoming Orders Section (Processor as Seller) !!] ---
    async function loadIncomingOrders() {
        const container = document.getElementById('incoming-orders-list'); // Assumes you add this ID in HTML
        if (!container) { 
            console.warn("Element with ID 'incoming-orders-list' not found. Cannot load incoming orders.");
            return; 
        }

        container.innerHTML = `<p class="text-center text-gray-500 py-4">Loading incoming orders...</p>`;

        const db = await getDb();
        if (!db || !window.currentProcessor) return;

        try {
            const { data: orders, error } = await db
                .from('product_orders')
                .select(`id, created_at, quantity_ordered, total_price, order_status, product_id, products ( product_name, image_url ), sellers!product_orders_buyer_id_fkey ( seller_name )`) // Fetch buyer name
                .eq('seller_id', window.currentProcessor.id) // Orders where processor is the seller
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (orders.length === 0) {
                container.innerHTML = `<p class="text-center text-gray-500 py-4">No incoming orders for your products yet.</p>`;
                return;
            }

            container.innerHTML = orders.map(order => {
                const productInfo = order.products || { product_name: 'Unknown Product', image_url: 'https://via.placeholder.com/80' };
                const buyerInfo = order.sellers || { seller_name: 'Unknown Buyer' }; // Buyer info
                const orderTotalPrice = parseFloat(order.total_price) || 0;
                
                let statusBadge;
                let actionButton;

                if (order.order_status === 'PENDING') {
                    statusBadge = `<span class="badge warning">Pending</span>`;
                    actionButton = `<button class="secondary w-full text-sm order-action-btn" data-order-id="${order.id}" data-action="ship">
                                       <span>Mark as Shipped</span>
                                    </button>`;
                } else if (order.order_status === 'SHIPPED') {
                     statusBadge = `<span class="badge" style="background-color: var(--primary-light); color: var(--primary);">Shipped</span>`;
                     actionButton = `<button class="secondary w-full text-sm" disabled>Shipped</button>`;
                } else if (order.order_status === 'DELIVERED') {
                    statusBadge = `<span class="badge success">Delivered</span>`;
                    actionButton = `<button class="secondary w-full text-sm" disabled>Delivered</button>`;
                } else {
                    statusBadge = `<span class="badge">${order.order_status}</span>`;
                    actionButton = `<button class="secondary w-full text-sm" disabled>${order.order_status}</button>`;
                }

                return `
                <div class="card order-card bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden" data-order-id="${order.id}">
                    <div class="p-4">
                        <div class="flex items-center space-x-4">
                            <img src="${productInfo.image_url}" alt="${productInfo.product_name}" class="h-16 w-16 rounded-md object-cover">
                            <div class="flex-grow">
                                <div class="flex justify-between items-center">
                                    <h5 class="text-base font-semibold text-gray-800 mb-0">${productInfo.product_name}</h5>
                                    ${statusBadge}
                                </div>
                                <p class="text-sm text-gray-600 mb-0">
                                    Buyer: <strong>${buyerInfo.seller_name}</strong><br>
                                    Qty: ${order.quantity_ordered} • Total: ₹${orderTotalPrice.toFixed(0)}
                                </p>
                                <p class="text-xs text-gray-400 mb-0">Order ID: ${order.id.substring(0,8)}...</p>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer bg-gray-50 px-4 py-3 border-t border-gray-200">
                        ${actionButton}
                    </div>
                </div>
                `;
            }).join('');
            
            attachProcessorOrderButtonListeners(); // Attach listeners for the new buttons

        } catch (error) {
            console.error("Error loading incoming orders:", error);
            container.innerHTML = `<p class="text-center text-danger py-4">Error loading incoming orders.</p>`;
        }
    }

    // --- [!! NEW: Handle Processor Shipping Actions !!] ---
    function attachProcessorOrderButtonListeners() {
        const orderListContainer = document.getElementById('incoming-orders-list');
        if (!orderListContainer) return;

        orderListContainer.addEventListener('click', (event) => {
            const button = event.target.closest('.order-action-btn');
            if (button && !button.disabled) {
                const orderId = button.dataset.orderId;
                const action = button.dataset.action;

                if (orderId && action === 'ship') {
                    updateProcessorOrderStatus(orderId, 'SHIPPED', button);
                }
            }
        });
        console.log("Attached incoming order button listeners.");
    }

    async function updateProcessorOrderStatus(orderId, newStatus, buttonElement) {
        console.log(`Updating order ${orderId} to ${newStatus}`);
        const db = await getDb();
        if (!db || !window.currentProcessor || !window.provider) {
            alert("DB or Wallet connection error.");
            return;
        }

        buttonElement.setAttribute('aria-busy', 'true');
        buttonElement.disabled = true;
        let txHash = null;

        try {
            // Send Blockchain TX for 'SHIPPED'
            buttonElement.innerHTML = `<span>Approve Tx...</span>`;
            
            await window.provider.send('eth_requestAccounts', []);
            const signer = window.provider.getSigner();
            const txData = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(`SHIP:${orderId}`));
            const txObject = { 
                to: '0x000000000000000000000000000000000000dEaD', 
                value: ethers.utils.parseEther('0.0'), 
                data: txData 
            };
            
            const txResponse = await signer.sendTransaction(txObject);
            buttonElement.innerHTML = `<span>Confirming Tx...</span>`;
            const txReceipt = await txResponse.wait(1);
            txHash = txReceipt.transactionHash;

            // Update DB Order Status
            const { error: updateError } = await db
                .from('product_orders')
                .update({ order_status: newStatus })
                .eq('id', orderId)
                .eq('seller_id', window.currentProcessor.id); // Make sure it's processor's order
            if (updateError) throw updateError;

            // Add Journey Event
            const { data: orderData } = await db.from('product_orders').select('product_id').eq('id', orderId).single();
            if (orderData?.product_id) {
                const journeyEvent = {
                     product_id: orderData.product_id,
                     actor_id: window.currentProcessor.id,
                     event_icon: '🚚',
                     event_name: 'Shipped by Processor',
                     event_details: `Order status updated to SHIPPED. TxHash: ${txHash.substring(0, 10)}...`,
                     tx_hash: txHash
                };
                await db.from('product_journey').insert(journeyEvent);
            }
            
            loadIncomingOrders(); // Refresh the list

        } catch (error) {
            console.error(`Error updating order ${orderId}:`, error);
            let userErrorMessage = "Failed to update status.";
            if (error.code === 4001) { userErrorMessage = "Transaction rejected."; } 
            alert(userErrorMessage);
            loadIncomingOrders(); // Refresh even on error
        }
    }

    // --- Initialize ---
    console.log("processor.js: Initializing processor...");
    initializeProcessor();

}); // End of DOMContentLoaded