// Wait for the page to load before running any script
document.addEventListener('DOMContentLoaded', () => {
    console.log("farmer.js: DOM Loaded.");

    // Store references
    const appTitle = document.getElementById('app-title');
    const navButtons = document.querySelectorAll('.app-nav button');
    const appPages = document.querySelectorAll('.app-page');

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
                        console.log("farmer.js: Database connection (window.db) is ready.");
                        resolve(window.db);
                    } else if (dbCheckAttempts < maxDbCheckAttempts) {
                        dbCheckAttempts++;
                        console.warn(`farmer.js: DB not ready. Retrying... (${dbCheckAttempts})`);
                        setTimeout(tryCheck, 500);
                    } else {
                        console.error("farmer.js: Failed to connect to DB after 10 attempts.");
                        resolve(null);
                    }
                };
                tryCheck();
            });
        }
        return dbCheckPromise;
    }

    // --- Page Switching Logic ---
    window.showPage = (pageId, titleKey = 'farmer.dashboardTitle') => {
        console.log(`farmer.js: showPage called with ID: ${pageId}, Key: ${titleKey}`);

        if (appTitle && window.t) {
            appTitle.textContent = t(titleKey);
            appTitle.dataset.currentPageKey = titleKey;
        }

        appPages.forEach(page => page.classList.remove('active'));
        const targetPage = document.getElementById('page-' + pageId);
        if (targetPage) targetPage.classList.add('active');

        navButtons.forEach(button => button.classList.remove('active'));
        const targetNavButton = document.getElementById('nav-' + pageId);
        if (targetNavButton) targetNavButton.classList.add('active');

        if (pageId === 'dashboard') {
            loadDashboardData();
            loadFarmerProducts();
        } else if (pageId === 'orders') {
            loadOrdersData();
        } else if (pageId === 'payouts') {
            loadPayoutsData();
        }
    };

    // --- File Upload Feedback (Unchanged) ---
     function setupFileUploadFeedback(inputId, boxId) {
        const fileInput = document.getElementById(inputId);
        const uploadBox = document.getElementById(boxId);
        if (!fileInput || !uploadBox) return;

        if (!uploadBox.dataset.originalContent) {
            uploadBox.dataset.originalContent = uploadBox.innerHTML;
        }
        const originalBoxContent = uploadBox.dataset.originalContent;

        uploadBox.addEventListener('click', () => fileInput.click());
        // In farmer.js, inside setupFileUploadFeedback function:
fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
        // ... (your existing code to change innerHTML) ...
        uploadBox.style.borderColor = 'var(--secondary)'; // Keep this or remove if using class
        uploadBox.classList.add('has-file'); // [!! ADD THIS LINE !!]
    } else {
        // ... (your existing code to reset innerHTML) ...
        uploadBox.style.borderColor = '';
        uploadBox.classList.remove('has-file'); // [!! ADD THIS LINE !!]
    }
});


    }

    setupFileUploadFeedback('product-image', 'image-upload-box');
    setupFileUploadFeedback('product-cert', 'cert-upload-box');


    // --- AI Price Suggestion (Unchanged) ---
    const priceBtn = document.getElementById('price-btn');
    const priceResultDiv = document.getElementById('ai-price-result');
    const commoditySelect = document.getElementById('product-name');
    const districtSelect = document.getElementById('location');
    const finalPriceInput = document.getElementById('final-price');

    if (priceBtn) {
        priceBtn.onclick = async () => {
             const commodity = commoditySelect.value;
            const district = districtSelect.value;
            if (!commodity || !district) {
                priceResultDiv.innerHTML = `<p class="text-sm text-danger" data-i18n="farmer.selectProductDistrictError">${t('farmer.selectProductDistrictError')}</p>`;
                priceResultDiv.style.display = 'block';
                return;
            }
            priceBtn.setAttribute('aria-busy', 'true');
            priceBtn.disabled = true;
            priceResultDiv.style.display = 'block';
            priceResultDiv.innerHTML = `<p data-i18n="farmer.gettingPrice">${t('farmer.gettingPrice')}</p>`;

            try {
                const response = await fetch('http://127.0.0.1:8000/api/v1/prices/predict-price/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ commodity, district })
                });
                if (!response.ok) throw new Error(`HTTP error ${response.status}`);
                const data = await response.json();
                const predictedPrice = data.predicted_price;

                priceResultDiv.innerHTML = `
                    <p class="text-base font-semibold text-primary mb-0">
                        <span data-i18n="farmer.aiSuggests">${t('farmer.aiSuggests')}</span> 
                        <strong>₹${predictedPrice.toFixed(0)} / quintal</strong>
                    </p>
                    <small class="text-xs text-gray-600" data-i18n="farmer.basedOnTrends">${t('farmer.basedOnTrends')}</small>
                `;
                finalPriceInput.value = predictedPrice.toFixed(0);

            } catch (error) {
                console.error("farmer.js: Price prediction fetch error:", error);
                priceResultDiv.innerHTML = `<p class="text-sm text-danger">${t('farmer.aiError')}: ${error.message}</p>`;
            } finally {
                priceBtn.setAttribute('aria-busy', 'false');
                priceBtn.disabled = false;
            }
        };
    }

    // --- List Product & Secure on Blockchain (Unchanged) ---
    const listBtn = document.getElementById('list-btn');
    const blockchainBtn = document.getElementById('blockchain-btn');
    const submitStatus = document.getElementById('submit-status');
    const productForm = document.getElementById('product-form');

    if (listBtn && blockchainBtn && submitStatus && productForm) {
        listBtn.onclick = async () => {
             console.log("farmer.js: List Product button clicked.");
            const db = await getDb();
            if (!db || !window.currentFarmer) {
                submitStatus.innerHTML = `<p class="text-sm text-danger" data-i18n="farmer.dbError">${t('farmer.dbError')}</p>`;
                return;
            }
            if (!productForm.checkValidity()) {
                 submitStatus.innerHTML = `<p class="text-sm text-danger" data-i18n="farmer.fillFieldsError">${t('farmer.fillFieldsError')}</p>`;
                 productForm.reportValidity();
                 return;
            }

            listBtn.setAttribute('aria-busy', 'true');
            listBtn.disabled = true;
            submitStatus.innerHTML = `<p class="text-sm text-gray-600" data-i18n="farmer.savingProduct">${t('farmer.savingProduct')}</p>`;
            blockchainBtn.disabled = true;

            try {
                const farmerSellerId = window.currentFarmer.id;
                console.log("farmer.js: Using Farmer Seller ID:", farmerSellerId);

                const imageFile = document.getElementById('product-image').files[0];
                const certFile = document.getElementById('product-cert').files[0];
                let image_url = null;
                let certificate_url = null;
                let certificate_type = null;
                let certificate_status = null;

                if (imageFile) {
                    submitStatus.innerHTML = `<p class="text-sm text-gray-600" data-i18n="farmer.uploadingImage">${t('farmer.uploadingImage')}</p>`;
                    const imageFileName = `${Date.now()}_${imageFile.name}`;
                    const { error: imageUploadError } = await db.storage.from('product_images').upload(imageFileName, imageFile);
                    if (imageUploadError) throw new Error(`Image Upload Failed: ${imageUploadError.message}`);
                    const { data: imageUrlData } = db.storage.from('product_images').getPublicUrl(imageFileName);
                    image_url = imageUrlData.publicUrl;
                    console.log("farmer.js: Image uploaded:", image_url);
                }

                if (certFile) {
                    submitStatus.innerHTML = `<p class="text-sm text-gray-600" data-i18n="farmer.uploadingCert">${t('farmer.uploadingCert')}</p>`;
                    const certFileName = `${Date.now()}_${certFile.name}`;
                    const { error: certUploadError } = await db.storage.from('certificates').upload(certFileName, certFile);
                    if (certUploadError) throw new Error(`Certificate Upload Failed: ${certUploadError.message}`);
                    const { data: certUrlData } = db.storage.from('certificates').getPublicUrl(certFileName);
                    certificate_url = certUrlData.publicUrl;
                    console.log("farmer.js: Certificate uploaded:", certificate_url);

                    submitStatus.innerHTML = `<p class="text-sm text-gray-600" data-i18n="farmer.analyzingCert">${t('farmer.analyzingCert')}</p>`;
                    const aiResponse = await fetch('http://127.0.0.1:8000/api/v1/prices/analyze_certificate/', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ certificate_url: certificate_url })
                    });
                    if (!aiResponse.ok) {
                        const err = await aiResponse.json();
                        throw new Error(`AI analysis failed: ${err.error || aiResponse.statusText}`);
                    }
                    const aiResult = await aiResponse.json();
                    certificate_type = aiResult.certificate_type;
                    certificate_status = aiResult.certificate_status;
                    console.log("farmer.js: AI Analysis complete:", aiResult);
                }

                const productData = {
                    seller_id: farmerSellerId,
                    product_name: commoditySelect.value,
                    quantity: parseInt(document.getElementById('quantity').value, 10),
                    unit: 'quintal',
                    price: parseFloat(finalPriceInput.value),
                    district: districtSelect.value,
                    image_url: image_url,
                    certificate_url: certificate_url,
                    certificate_type: certificate_type,
                    certificate_status: certificate_status
                };

                console.log("farmer.js: Attempting to save product:", productData);
                submitStatus.innerHTML = `<p class="text-sm text-gray-600" data-i18n="farmer.savingToDb">${t('farmer.savingToDb')}</p>`;

                const { data: productInsertData, error: productInsertError } = await db
                    .from('products')
                    .insert(productData)
                    .select()
                    .single();

                if (productInsertError) throw productInsertError;
                if (!productInsertData) throw new Error("Failed to retrieve new product from Supabase.");

                const newProductId = productInsertData.id;
                console.log('farmer.js: Product saved successfully with ID:', newProductId);

                const journeyEvent = {
                    product_id: newProductId,
                    actor_id: farmerSellerId,
                    event_icon: "📝",
                    event_name: "Listed by Farmer",
                    event_details: `Listed ${productData.quantity} ${productData.unit} of ${productData.product_name} from ${productData.district}.`
                };

                const { error: journeyError } = await db.from('product_journey').insert(journeyEvent);
                if (journeyError) console.error("farmer.js: Failed to save to product_journey:", journeyError.message);
                else console.log("farmer.js: 'Listed by Farmer' event added to journey.");
                

                listBtn.setAttribute('aria-busy', 'false');
                listBtn.innerHTML = `✅ <span data-i18n="farmer.saved">${t('farmer.saved')}</span>`;
                listBtn.style.background = 'var(--secondary)';
                listBtn.style.borderColor = 'var(--secondary)';
                blockchainBtn.removeAttribute('disabled');
                blockchainBtn.classList.remove('secondary');
                blockchainBtn.classList.add('primary');
                submitStatus.innerHTML = `<p class="text-sm text-green-700 font-medium" data-i18n="farmer.productSaved">${t('farmer.productSaved')}</p>`;

                listBtn.dataset.productId = newProductId;
                listBtn.dataset.sellerId = farmerSellerId;

                loadFarmerProducts();

            } catch (error) {
                console.error("farmer.js: Error saving product:", error);
                listBtn.setAttribute('aria-busy', 'false');
                listBtn.disabled = false;
                listBtn.innerHTML = `<span data-i18n="farmer.listProductMarketplace">${t('farmer.listProductMarketplace')}</span>`;
                submitStatus.innerHTML = `<p class="text-sm text-danger">${t('farmer.savingFailed')} ${error.message}</p>`;
            }
        };

        blockchainBtn.onclick = async () => {
             const productId = listBtn.dataset.productId;
            const sellerId = listBtn.dataset.sellerId;

            if (!productId || !sellerId) {
                 submitStatus.innerHTML = `<p class="text-sm text-danger" data-i18n="farmer.productIdError">${t('farmer.productIdError')}</p>`;
                 return;
            }
            if (!window.provider || typeof ethers === 'undefined') {
                 submitStatus.innerHTML = `<p class="text-sm text-danger" data-i18n="farmer.metamaskError">${t('farmer.metamaskError')}</p>`;
                 return;
            }

            const db = await getDb();
            if (!db) {
                submitStatus.innerHTML = `<p class="text-sm text-danger" data-i18n="farmer.dbError">${t('farmer.dbError')}</p>`;
                return;
            }

            const destinationAddress = '0x000000000000000000000000000000000000dEaD';

            try {
                blockchainBtn.setAttribute('aria-busy', 'true');
                blockchainBtn.disabled = true;
                listBtn.disabled = true;
                submitStatus.innerHTML = `<p class="text-sm text-gray-600" data-i18n="farmer.approveMetamask">${t('farmer.approveMetamask')}</p>`;

                await window.provider.send('eth_requestAccounts', []);
                const signer = window.provider.getSigner();
                const txData = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(productId));
                const txObject = { to: destinationAddress, value: ethers.utils.parseEther('0.0'), data: txData };

                submitStatus.innerHTML = `<p class="text-sm text-gray-600" data-i18n="farmer.approveTx">${t('farmer.approveTx')}</p>`;
                const txResponse = await signer.sendTransaction(txObject);
                submitStatus.innerHTML = `<p class="text-sm text-gray-600" data-i18n="farmer.waitingConfirmation">${t('farmer.waitingConfirmation')}</p>`;
                const txReceipt = await txResponse.wait(1);

                const txHash = txReceipt.transactionHash;
                const etherscanLink = `https://sepolia.etherscan.io/tx/${txHash}`;
                console.log("farmer.js: Transaction confirmed:", txHash);

                const journeyEvent = {
                    product_id: productId,
                    actor_id: sellerId,
                    event_icon: "🔗",
                    event_name: "Secured on Blockchain",
                    event_details: `Immutable record created on Sepolia. TxHash: ${txHash.substring(0, 10)}...`,
                    tx_hash: txHash
                };
                const { error: journeyError } = await db.from('product_journey').insert(journeyEvent);
                if (journeyError) console.error("farmer.js: Failed to save 'Secured' event to journey:", journeyError);
                else console.log("farmer.js: 'Secured on Blockchain' event added to journey.");

                submitStatus.innerHTML = `<p class="text-sm text-gray-600" data-i18n="farmer.savingProof">${t('farmer.savingProof')}</p>`;
                const { error: updateError } = await db
                    .from('products')
                    .update({
                        tx_hash: txHash,
                        etherscan_link: etherscanLink
                    })
                    .eq('id', productId);

                if (updateError) {
                    console.error("farmer.js: Failed to save tx_hash to products table:", updateError);
                    submitStatus.innerHTML = `<p class="text-sm text-yellow-700 font-medium" data-i18n="farmer.proofSaveError">${t('farmer.proofSaveError')} <small>${updateError.message}</small></p>`;
                } else {
                    console.log("farmer.js: Proof saved to products table successfully.");
                }

                blockchainBtn.setAttribute('aria-busy', 'false');
                blockchainBtn.innerHTML = `⛓️ <span data-i18n="farmer.secured">${t('farmer.secured')}</span>`;
                blockchainBtn.style.background = 'var(--secondary)';
                blockchainBtn.style.borderColor = 'var(--secondary)';
                submitStatus.innerHTML = `
                    <p class="text-sm text-green-700 font-medium" data-i18n="farmer.allDone">
                    ${t('farmer.allDone', { productId: productId.substring(0,8) })}
                    <br><a href="${etherscanLink}" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline" data-i1F8n="farmer.viewOnEtherscan">
                        ${t('farmer.viewOnEtherscan')}
                    </a>
                    </p>`;

                productForm.reset();
                if (priceResultDiv) {
                    priceResultDiv.innerHTML = '';
                    priceResultDiv.style.display = 'none';
                }
                if (listBtn.dataset.productId) delete listBtn.dataset.productId;
                if (listBtn.dataset.sellerId) delete listBtn.dataset.sellerId;

                listBtn.disabled = false;
                listBtn.innerHTML = `<span data-i18n="farmer.listProductMarketplace">${t('farmer.listProductMarketplace')}</span>`;
                listBtn.style.background = '';
                listBtn.style.borderColor = '';
                blockchainBtn.disabled = true;
                blockchainBtn.classList.remove('primary');
                blockchainBtn.classList.add('secondary');
                blockchainBtn.innerHTML = `<span data-i18n="farmer.secureOnBlockchain">${t('farmer.secureOnBlockchain')}</span>`;
                blockchainBtn.style.background = '';
                blockchainBtn.style.borderColor = '';


              // Inside the blockchainBtn.onclick success block, AFTER productForm.reset()

['image-upload-box', 'cert-upload-box'].forEach(boxId => {
    const uploadBox = document.getElementById(boxId);
    if (uploadBox && uploadBox.dataset.originalContent) {
        uploadBox.innerHTML = uploadBox.dataset.originalContent;
        uploadBox.style.borderColor = ''; // Reset border color
        uploadBox.classList.remove('has-file'); // <-- ADD THIS LINE
    }
});
                
                if(window.applyTranslations) window.applyTranslations(productForm);

                loadFarmerProducts();

            } catch (error) {
                 console.error("farmer.js: Blockchain transaction failed:", error);
                 blockchainBtn.setAttribute('aria-busy', 'false');
                 blockchainBtn.disabled = false;
                 listBtn.disabled = false;
                 blockchainBtn.innerHTML = `<span data-i18n="farmer.secureOnBlockchain">${t('farmer.secureOnBlockchain')}</span>`;

                 let userErrorMessageKey = 'farmer.blockchainError';
                 if (error.code === 4001) {
                    userErrorMessageKey = "farmer.txRejected";
                 }
                 if (error.message.includes("insufficient funds")) {
                    userErrorMessageKey = "farmer.insufficientFunds";
                 }

                 submitStatus.innerHTML = `<p class="text-sm text-danger">${t(userErrorMessageKey)}<br>${t('farmer.retrySecure', { productId: productId.substring(0,8) })}</p>`;

                 listBtn.innerHTML = `✅ <span data-i1ed="farmer.saved">${t('farmer.saved')}</span>`;
                 listBtn.style.background = 'var(--secondary)';
                 listBtn.style.borderColor = 'var(--secondary)';
                 blockchainBtn.classList.remove('secondary');
                 blockchainBtn.classList.add('primary');
            }
        };
    } else {
        console.error("farmer.js: Critical UI elements for form submission not found.");
    }

    // --- Initialize Farmer Profile (Unchanged) ---
    async function initializeFarmer() {
        const db = await getDb();
        if (!db) {
            document.getElementById('farmer-name').textContent = 'Error';
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
            .eq('seller_type', 'FARMER')
            .single();

        if (error) {
            console.error("Failed to load farmer profile:", error);
            document.getElementById('farmer-name').textContent = 'Not Found';
        } else if (data) {
            window.currentFarmer = data;
            document.getElementById('farmer-name').textContent = data.seller_name;
            console.log("Farmer profile loaded:", window.currentFarmer);

            const initialLang = localStorage.getItem('milletLang') || 'en';
            setLanguage(initialLang);

            showPage('dashboard', 'farmer.dashboardTitle');
        }
    }


    // --- Dynamic Data Loaders ---

    // Load Dashboard Stats (Unchanged)
    async function loadDashboardData() {
        const db = await getDb();
        if (!db || !window.currentFarmer) return;

        const totalPayoutsEl = document.getElementById('dashboard-total-payouts');
        const pendingOrdersEl = document.getElementById('dashboard-pending-orders');

        const { count: pendingCount, error: ordersError } = await db
            .from('product_orders')
            .select('id', { count: 'exact', head: true })
            .eq('seller_id', window.currentFarmer.id)
            .eq('order_status', 'PENDING');

        pendingOrdersEl.textContent = ordersError ? '0' : (pendingCount || 0);
         if(ordersError) console.error("Error fetching pending orders count:", ordersError);

        const { data: farmerData, error: farmerError } = await db
            .from('sellers')
            .select('wallet_balance')
            .eq('id', window.currentFarmer.id)
            .single();
        
        if (farmerData) {
            const balance = farmerData.wallet_balance || 0;
            totalPayoutsEl.textContent = `₹${balance.toFixed(0)}`;
            window.currentFarmer.wallet_balance = balance;
        } else {
             console.error("Error fetching total payouts:", farmerError);
            totalPayoutsEl.textContent = '₹0';
        }
    }

    // Load Farmer's Products (Unchanged)
    async function loadFarmerProducts() {
        const db = await getDb();
        if (!db || !window.currentFarmer) return;

        const listElement = document.getElementById('farmer-products-list');
        listElement.innerHTML = `<p class="text-center text-gray-500 text-sm py-4" data-i18n="farmer.loading">${t('farmer.loading')}</p>`;

        const { data: products, error } = await db
            .from('products')
            .select('*')
            .eq('seller_id', window.currentFarmer.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching farmer products:", error);
            listElement.innerHTML = `<p class="text-center text-danger text-sm py-4" data-i18n="farmer.errorLoadingProducts">${t('farmer.errorLoadingProducts')}</p>`;
        } else if (products && products.length > 0) {
            listElement.innerHTML = products.map(product => `
                <div class="card product-card bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center space-x-4">
                    <img src="${product.image_url || 'https://via.placeholder.com/80'}" alt="${product.product_name}" class="h-16 w-16 rounded-md object-cover">
                    <div class="flex-grow">
                        <div class="flex justify-between items-center">
                            <h5 class="text-base font-semibold text-gray-800 mb-0">${product.product_name}</h5>
                            <span class="badge ${product.tx_hash ? 'success' : 'warning'} text-xs" data-i18n="${product.tx_hash ? 'farmer.secured' : 'farmer.notSecured'}">
                                ${t(product.tx_hash ? 'farmer.secured' : 'farmer.notSecured')}
                            </span>
                        </div>
                        <p class="text-sm text-gray-500 mb-0">
                            ${product.quantity} ${product.unit} <span class="mx-1">•</span> ₹${product.price}/${product.unit}
                        </p>
                    </div>
                </div>
            `).join('');
            
            if(window.applyTranslations) window.applyTranslations(listElement);
            
        } else {
            const emptyStateHTML = document.querySelector('#page-dashboard #farmer-products-list .empty-state');
            listElement.innerHTML = emptyStateHTML ? emptyStateHTML.outerHTML : '<p>No products listed.</p>';
             if(window.applyTranslations) window.applyTranslations(listElement);
        }
    }

    // Load Orders Data (Unchanged)
    async function loadOrdersData() {
        const db = await getDb();
        if (!db || !window.currentFarmer) return;

        const listElement = document.getElementById('farmer-orders-list');
        listElement.innerHTML = `<p class="text-center text-gray-500 text-sm py-4" data-i18n="farmer.loading">${t('farmer.loading')}</p>`;

        const { data: orders, error } = await db
            .from('product_orders')
            .select(`
                id,
                created_at,
                quantity_ordered,
                total_price,
                order_status,
                products ( product_name, image_url )
            `)
            .eq('seller_id', window.currentFarmer.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching orders:", error);
            listElement.innerHTML = `<p class="text-center text-danger text-sm py-4" data-i18n="farmer.errorLoadingOrders">${t('farmer.errorLoadingOrders')}</p>`;
        } else if (orders && orders.length > 0) {
            listElement.innerHTML = orders.map(order => {
                const productInfo = order.products || { product_name: 'Unknown Product', image_url: 'https://via.placeholder.com/80' };
                const orderTotalPrice = parseFloat(order.total_price) || 0;
                let statusKey = `consumer.status${order.order_status.charAt(0) + order.order_status.slice(1).toLowerCase()}`;

                 let statusBadge;
                 if (order.order_status === 'PENDING') {
                     statusBadge = `<span class="badge warning text-xs" data-i18n="${statusKey}">${t(statusKey)}</span>`;
                 } else if (order.order_status === 'SHIPPED') {
                      statusBadge = `<span class="badge text-xs" style="background-color: var(--primary-light); color: var(--primary);" data-i18n="${statusKey}">${t(statusKey)}</span>`;
                 } else if (order.order_status === 'DELIVERED') {
                     statusBadge = `<span class="badge success text-xs" data-i18n="${statusKey}">${t(statusKey)}</span>`;
                 } else {
                     statusBadge = `<span class="badge text-xs">${order.order_status}</span>`;
                 }

                 let actionButton;
                 if (order.order_status === 'PENDING') {
                     actionButton = `<button class="secondary w-full text-sm order-action-btn" data-order-id="${order.id}" data-action="ship">
                                        <span data-i18n="farmer.markAsShipped">${t('farmer.markAsShipped')}</span>
                                     </button>`;
                 } else {
                     actionButton = `<button class="secondary w-full text-sm" disabled>${t(statusKey) || order.order_status}</button>`;
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
                                    <strong data-i18n="farmer.qty">${t('farmer.qty')}</strong> ${order.quantity_ordered} <span class="mx-1">•</span> 
                                    <strong data-i18n="farmer.total">${t('farmer.total')}</strong> ₹${orderTotalPrice.toFixed(0)}
                                </p>
                                <p class="text-xs text-gray-400 mb-0"><span data-i18n="farmer.orderId">${t('farmer.orderId')}</span> ${order.id.substring(0,8)}...</p>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer bg-gray-50 px-4 py-3 border-t border-gray-200">
                        ${actionButton}
                    </div>
                </div>
            `}).join('');
            
            if(window.applyTranslations) window.applyTranslations(listElement);
            attachOrderButtonListeners();
            
        } else {
            const emptyStateHTML = document.querySelector('#page-orders #farmer-orders-list .empty-state');
            listElement.innerHTML = emptyStateHTML ? emptyStateHTML.outerHTML : '<p>No orders found.</p>';
            if(window.applyTranslations) window.applyTranslations(listElement);
        }
    }

    // Update Order Status (Unchanged)
    async function updateOrderStatus(orderId, newStatus, buttonElement) {
        console.log(`Updating order ${orderId} to ${newStatus}`);
        const db = await getDb();
        if (!db || !window.currentFarmer) {
            alert(t('farmer.dbError'));
            return;
        }

        buttonElement.setAttribute('aria-busy', 'true');
        buttonElement.disabled = true;
        let txHash = null;

        try {
            if (newStatus === 'SHIPPED') {
                if (!window.provider || typeof ethers === 'undefined') {
                    throw new Error(t('farmer.metamaskError'));
                }
                
                buttonElement.innerHTML = `<span data-i18n="farmer.approveTx">${t('farmer.approveTx')}</span>`;
                
                await window.provider.send('eth_requestAccounts', []);
                const signer = window.provider.getSigner();
                const txData = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(`SHIP:${orderId}`));
                const txObject = { 
                    to: '0x000000000000000000000000000000000000dEaD', 
                    value: ethers.utils.parseEther('0.0'), 
                    data: txData 
                };
                
                const txResponse = await signer.sendTransaction(txObject);
                buttonElement.innerHTML = `<span data-i18n="farmer.waitingConfirmation">${t('farmer.waitingConfirmation')}</span>`;
                const txReceipt = await txResponse.wait(1);
                txHash = txReceipt.transactionHash;
            }

            const { error } = await db
                .from('product_orders')
                .update({ order_status: newStatus })
                .eq('id', orderId)
                .eq('seller_id', window.currentFarmer.id);

            if (error) throw error;
            console.log(`Order ${orderId} successfully updated to ${newStatus}.`);


            let journeyEventIcon = '';
            let journeyEventName = '';
            let journeyEventDetails = '';

            if (newStatus === 'SHIPPED') {
                journeyEventIcon = '🚚';
                journeyEventName = 'Shipped by Farmer';
                journeyEventDetails = `Order status updated to SHIPPED. TxHash: ${txHash.substring(0, 10)}...`;
            }

            if (journeyEventName) {
                const { data: orderData, error: fetchError } = await db
                    .from('product_orders')
                    .select('product_id')
                    .eq('id', orderId)
                    .single();

                if (fetchError || !orderData) {
                    console.error("Failed to fetch product_id for journey event:", fetchError);
                } else {
                    const journeyEvent = {
                         product_id: orderData.product_id,
                         actor_id: window.currentFarmer.id,
                         event_icon: journeyEventIcon,
                         event_name: journeyEventName,
                         event_details: journeyEventDetails,
                         tx_hash: txHash
                    };
                    const {error: journeyError} = await db.from('product_journey').insert(journeyEvent);
                    if(journeyError) console.error("Failed to add journey event:", journeyError);
                    else console.log(`Added journey event: ${journeyEventName} with hash ${txHash}`);
                }
            }
            
            loadOrdersData();

        } catch (error) {
            console.error(`Error updating order ${orderId}:`, error);
            
            let userErrorMessage = error.message;
            if (error.code === 4001) {
                userErrorMessage = t('farmer.txRejected');
            } else if (error.message.includes("insufficient funds")) {
                userErrorMessage = t('farmer.insufficientFunds');
            }
            alert(`${t('farmer.savingFailed')} ${userErrorMessage}`);
            
            loadOrdersData();
        }
    }


    // Attach Listeners (Unchanged)
    function attachOrderButtonListeners() {
        const orderListContainer = document.getElementById('farmer-orders-list');
        if (!orderListContainer) return;

        orderListContainer.addEventListener('click', (event) => {
            const button = event.target.closest('.order-action-btn');
            if (button && !button.disabled) {
                const orderId = button.dataset.orderId;
                const action = button.dataset.action;

                if (orderId && action) {
                    let newStatus;
                    if(action === 'ship') newStatus = 'SHIPPED';

                    if(newStatus) {
                        updateOrderStatus(orderId, newStatus, button);
                    }
                }
            }
        });
        console.log("Attached order button listeners using event delegation.");
    }


    // [!! REVISED !!] Load Payouts Data
    // Now adds a listener for the withdraw button
    async function loadPayoutsData() {
        const db = await getDb();
        if (!db || !window.currentFarmer) return;

        const listElement = document.getElementById('payout-history-list');
        const availableAmountEl = document.getElementById('available-payout-amount');
        
        listElement.innerHTML = `<p class="text-center text-gray-500 text-sm py-4" data-i18n="farmer.loading">${t('farmer.loading')}</p>`;

        // Get available balance directly from farmer profile
        const { data: farmerData, error: farmerError } = await db
            .from('sellers')
            .select('wallet_balance')
            .eq('id', window.currentFarmer.id)
            .single();

        if (farmerData) {
            const currentBalance = farmerData.wallet_balance || 0;
            availableAmountEl.textContent = `₹${currentBalance.toFixed(2)}`;
            window.currentFarmer.wallet_balance = currentBalance; // Update global
        } else {
            console.error("Error refreshing farmer balance:", farmerError);
            availableAmountEl.textContent = '₹0.00';
        }

        // Show 'DELIVERED' orders as "history"
        const { data: payouts, error } = await db
            .from('product_orders')
            .select(`id, created_at, total_price, products ( product_name )`)
            .eq('seller_id', window.currentFarmer.id)
            .eq('order_status', 'DELIVERED')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching payouts:", error);
            listElement.innerHTML = `<p class="text-center text-danger text-sm py-4" data-i18n="farmer.errorLoadingPayouts">${t('farmer.errorLoadingPayouts')}</p>`;
        } else if (payouts && payouts.length > 0) {
            listElement.innerHTML = payouts.map(payout => {
                const productInfo = payout.products || { product_name: 'Unknown'};
                return `
                <div class="transaction-item flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0">
                    <div>
                        <p class="text-sm font-medium text-gray-800 mb-0">${t('farmer.payoutFor')} ${productInfo.product_name}</p>
                        <small class="text-xs text-gray-500">${new Date(payout.created_at).toLocaleDateString()}</small>
                    </div>
                    <span class="text-base font-semibold text-secondary">+₹${(parseFloat(payout.total_price) || 0).toFixed(2)}</span>
                </div>
            `}).join('');
        } else {
            const emptyStateHTML = document.querySelector('#page-payouts #payout-history-list .empty-state');
            listElement.innerHTML = emptyStateHTML ? emptyStateHTML.outerHTML : '<p>No transactions found.</p>';
            if(window.applyTranslations) window.applyTranslations(listElement);
        }
        
        // [!! NEW !!] Attach listener for the withdraw button
        const withdrawBtn = document.getElementById('withdraw-btn');
        if (withdrawBtn) {
            // Remove old listener to prevent duplicates
            withdrawBtn.onclick = null; 
            // Add new listener
            withdrawBtn.onclick = withdrawFunds;
        }
    }
    
    // --- [!! NEW FUNCTION: Withdraw Funds !!] ---
    async function withdrawFunds() {
        const db = await getDb();
        if (!db || !window.currentFarmer) {
            alert(t('farmer.dbError'));
            return;
        }

        const currentBalance = parseFloat(window.currentFarmer.wallet_balance) || 0;
        
        const amountStr = prompt(t('farmer.withdrawPrompt'), "100");
        if (amountStr === null) {
            return; // User cancelled
        }

        const amount = parseFloat(amountStr);
        if (isNaN(amount) || amount <= 0) {
            alert(t('farmer.invalidAmount'));
            return;
        }

        if (amount > currentBalance) {
            alert(t('farmer.insufficientFunds', { balance: currentBalance.toFixed(2) }));
            return;
        }
        
        const withdrawBtn = document.getElementById('withdraw-btn');
        withdrawBtn.setAttribute('aria-busy', 'true');
        withdrawBtn.disabled = true;

        try {
            const newBalance = currentBalance - amount;
            
            const { error } = await db
                .from('sellers')
                .update({ wallet_balance: newBalance })
                .eq('id', window.currentFarmer.id);

            if (error) throw error;
            
            // Success
            window.currentFarmer.wallet_balance = newBalance;
            alert(t('farmer.withdrawSuccess', { 
                amount: amount.toFixed(2), 
                newBalance: newBalance.toFixed(2) 
            }));
            
            // Refresh the payouts page
            loadPayoutsData(); 
            // Also refresh dashboard if we are on it
            if (document.getElementById('page-dashboard').classList.contains('active')) {
                loadDashboardData();
            }

        } catch (error) {
            console.error("Withdrawal failed:", error);
            alert(t('farmer.withdrawError'));
        } finally {
            withdrawBtn.setAttribute('aria-busy', 'false');
            withdrawBtn.disabled = false;
        }
    }


    // --- Initialize ---
    initializeFarmer();

}); // End of DOMContentLoaded