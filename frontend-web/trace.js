// Wait for the page to load before running any script
document.addEventListener('DOMContentLoaded', () => {
    console.log("trace.js: DOM Loaded. Initializing...");
    
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
                        console.log("trace.js: Database connection (window.db) is ready.");
                        resolve(window.db);
                    } else if (dbCheckAttempts < maxDbCheckAttempts) {
                        dbCheckAttempts++;
                        console.warn(`trace.js: DB not ready. Retrying... (${dbCheckAttempts})`);
                        setTimeout(tryCheck, 500);
                    } else {
                        console.error("trace.js: Failed to connect to DB after 10 attempts.");
                        resolve(null);
                    }
                };
                tryCheck();
            });
        }
        return dbCheckPromise;
    }

    // --- [!! REVISED: Main Trace Function !!] ---
    async function loadTraceData() {
        console.log("trace.js: Loading trace data...");
        const timelineContainer = document.getElementById('timeline-container');
        
        // 1. Get Product ID from URL
        const params = new URLSearchParams(window.location.search);
        const productId = params.get('id');

        if (!productId) {
            document.getElementById('product-name').textContent = "Error: No Product ID";
            timelineContainer.innerHTML = `<li class="timeline-item" data-icon="❌"><article class="card"><h5>Error</h5><p>No Product ID was provided in the URL.</p></article></li>`;
            return;
        }
        
        document.getElementById('product-id').textContent = `${productId.substring(0, 8)}...`;

        const db = await getDb();
        if (!db) {
            document.getElementById('product-name').textContent = "Error: DB Connection Failed";
            return;
        }

        try {
            // 2. Fetch all data in parallel
            const productPromise = db.from('products')
                                     .select(`*, sellers(seller_name)`)
                                     .eq('id', productId)
                                     .single();
                                     
            const journeyPromise = db.from('product_journey')
                                     .select('*') // This will now include the new tx_hash column
                                     .eq('product_id', productId)
                                     .order('created_at', { ascending: true });
                                     
            // [!! REVISED !!] No longer need to fetch from product_orders
            const [productResult, journeyResult] = await Promise.all([
                productPromise, 
                journeyPromise
            ]);

            // 3. Process Product Data (Header)
            if (productResult.error) throw productResult.error;
            const product = productResult.data;
            
            document.getElementById('product-image').src = product.image_url || 'https://placehold.co/100x100/E6F0F6/005A9C?text=Millet&font=Inter';
            document.getElementById('product-name').textContent = product.product_name;
            document.getElementById('seller-name').textContent = product.sellers ? product.sellers.seller_name : 'Unknown Seller';
            
            // 4. Process Main Blockchain Proof (Bottom Box)
            const mainProofHashEl = document.getElementById('etherscan-hash');
            const mainProofLinkEl = document.getElementById('etherscan-link');
            
            if (product.tx_hash && product.etherscan_link) {
                mainProofHashEl.textContent = product.tx_hash;
                mainProofLinkEl.href = product.etherscan_link;
                mainProofLinkEl.removeAttribute('disabled');
            } else {
                mainProofHashEl.textContent = "(Not secured on blockchain yet)";
            }

            // 5. Process Journey Data (Timeline)
            if (journeyResult.error) throw journeyResult.error;
            const journeyEvents = journeyResult.data;

            if (journeyEvents.length === 0) {
                 timelineContainer.innerHTML = `<li class="timeline-item" data-icon="⏳"><article class="card"><h5>No journey data found</h5><p>This product has no traceability events logged yet.</p></article></li>`;
                 return;
            }

            let timelineHTML = '';
            for (let i = 0; i < journeyEvents.length; i++) {
                const event = journeyEvents[i];
                const timestamp = new Date(event.created_at).toLocaleString('en-IN', { 
                    day: 'numeric', 
                    month: 'short', 
                    year: 'numeric', 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true
                });
                
                // [!! REVISED: SIMPLER LOGIC !!]
                let blockchainLinkHTML = '';
                
                // Check if the tx_hash column has a value for this event
                if (event.tx_hash) {
                    let linkText = "View Transaction ⛓️"; // Default text
                    if (event.event_name === 'Secured on Blockchain') {
                        linkText = "View 'Listed' Transaction ⛓️";
                    } else if (event.event_name === 'Shipped by Farmer') {
                        linkText = "View 'Shipped' Transaction ⛓️";
                    } else if (event.event_name === 'Delivery Confirmed by Consumer') {
                        linkText = "View 'Delivered' Transaction ⛓️";
                    }

                    blockchainLinkHTML = `
                        <a href="https://sepolia.etherscan.io/tx/${event.tx_hash}" target="_blank" rel="noopener noreferrer" class="blockchain-link">
                            ${linkText}
                        </a>`;
                }

                timelineHTML += `
                    <li class="timeline-item" data-icon="${event.event_icon}" style="--item-index: ${i};">
                        <article class="card">
                            <h5>${event.event_name}</h5>
                            <p>${event.event_details}</p>
                            ${blockchainLinkHTML} <small>${timestamp}</small>
                        </article>
                    </li>
                `;
            }

            timelineContainer.innerHTML = timelineHTML;

        } catch (error) {
            console.error("Error loading trace data:", error);
            document.getElementById('product-name').textContent = "Error loading data";
            timelineContainer.innerHTML = `<li class="timeline-item" data-icon="❌"><article class="card"><h5>Error</h5><p>${error.message}</p></article></li>`;
        }
    }

    // --- Initialize ---
    loadTraceData();
    
}); // End of DOMContentLoaded