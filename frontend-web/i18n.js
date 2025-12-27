const translations = {
  "en": {
    "appName": "MilletChain",
    // --- Farmer App ---
    "farmer": {
      "dashboardTitle": "Dashboard",
      "welcome": "Welcome back",
      "atAGlance": "At a Glance",
      "totalPayouts": "Total Payouts",
      "pendingOrders": "Pending Orders",
      "quickActions": "Quick Actions",
      "addProductBatch": "Add New Product Batch",
      "viewPendingOrders": "View Pending Orders",
      "myListedProducts": "My Listed Products",
      "noProductsListed": "No Products Listed",
      "tapAddProductToStart": "Tap 'Add Product' to get started.",
      "recentActivity": "Recent Activity",
      "noRecentActivity": "No recent activity",
      "addProductTitle": "Add New Product",
      "productDetails": "Product Details",
      "chooseMillet": "Choose a millet...",
      "bajra": "Bajra (Pearl Millet)",
      "jowar": "Jowar (Sorghum)",
      "ragi": "Ragi (Finger Millet)",
      "quantityQuintals": "Quantity (in Quintals)",
      "eg10": "e.g., 10", // Placeholder
      "yourDistrict": "Your District",
      "chooseLocation": "Choose your location...",
      "ahmedabad": "Ahmedabad",
      "gandhinagar": "Gandhinagar",
      "productPhoto": "Product Photo",
      "tapToUploadPhoto": "Tap to Upload Photo",
      "photoBuildsTrust": "A real photo builds trust.",
      "qualityCertificate": "Quality Certificate (Optional)",
      "tapToUploadCert": "Tap to Upload Certificate",
      "certExample": "e.g., Organic, FSSAI (PDF/Image)",
      "aiPriceSuggestion": "AI Price Suggestion",
      "getAiPriceSuggestion": "Get AI Price Suggestion",
      "finalListingPrice": "Final Listing Price (per Quintal)",
      "enterFinalPrice": "Enter your final price", // Placeholder
      "listProductMarketplace": "1. List Product on Marketplace",
      "secureOnBlockchain": "2. Secure on Blockchain (Connect Wallet)",
      "manageOrdersTitle": "Manage Orders",
      "ordersReceived": "Orders Received",
      "noOrdersReceived": "No Orders Received Yet",
      "ordersWillAppearHere": "New orders from consumers will appear here.",
      "myPayoutsTitle": "My Payouts",
      "availablePayout": "Available for Payout",
      "withdrawToBank": "Withdraw to Bank",
      "transactionHistory": "Transaction History",
      "noTransactions": "No Transaction History",
      "payoutsWillAppearHere": "Completed payouts will appear here.",
      "navDashboard": "Dashboard",
      "navAddProduct": "Add Product",
      "navOrders": "Orders",
      "navPayouts": "Payouts",
      "tapToChange": "Tap to change",
      "selectProductDistrictError": "Please select a product and district first.",
      "gettingPrice": "Getting AI suggestion...",
      "aiSuggests": "AI Suggests:",
      "basedOnTrends": "Based on market trends.",
      "aiError": "Error fetching price suggestion", // Simplified
      "dbError": "Error: Database or profile not ready.",
      "fillFieldsError": "Please fill out all required fields.",
      "savingProduct": "Saving product...",
      "uploadingImage": "Uploading product image...",
      "uploadingCert": "Uploading certificate...",
      "analyzingCert": "Analyzing certificate with AI...",
      "savingToDb": "Saving product to database...",
      "saved": "Saved!",
      "productSaved": "<strong>Success! Product saved.</strong><br>Next step: Secure it on the blockchain.",
      "savingFailed": "Saving failed:", // Appended in JS
      "productIdError": "Error: Product or Seller ID not found.",
      "metamaskError": "Error: MetaMask connection (provider) not ready.",
      "approveMetamask": "Please approve the connection in MetaMask.",
      "approveTx": "Please approve the transaction in MetaMask.",
      "waitingConfirmation": "Waiting for blockchain confirmation...",
      "savingProof": "Saving proof to database...",
      "proofSaveError": "<strong>Warning!</strong><br>Product secured, but failed to save proof to DB.", // Appended in JS
      "allDone": "<strong>All done!</strong><br>Product ID {productId}... secured.",
      "productSecured": "Product secured.", // Appended in JS
      "viewOnEtherscan": "View on Etherscan",
      "blockchainError": "Blockchain error:", // Appended in JS
      "txRejected": "Transaction rejected in MetaMask.",
      "insufficientFundsEth": "Insufficient Sepolia ETH for gas fee.", // Renamed slightly
      "retrySecure": "Please try again to secure Product ID {productId}...",
      "loading": "Loading...",
      "errorLoadingProducts": "Error loading products.",
      "secured": "Secured",
      "notSecured": "Not Secured",
      "qty": "Qty:",
      "total": "Total:",
      "orderId": "Order ID:",
      "markAsShipped": "Mark as Shipped",
      "errorLoadingOrders": "Error loading orders.",
      "payoutFor": "Payout for", // JS Appends product name
      "errorLoadingPayouts": "Error loading payouts.",
      "withdrawPrompt": "Enter amount to withdraw:",
      "invalidAmount": "Invalid amount. Please enter a positive number.",
      "insufficientFundsWallet": "Insufficient funds. You only have ₹{balance}.", // Renamed slightly
      "withdrawing": "Withdrawing...",
      "withdrawSuccess": "Withdrawal of ₹{amount} successful! Your new balance is ₹{newBalance}.",
      "withdrawError": "Withdrawal failed. Please try again."
    },
    // --- Consumer App ---
    "consumer": {
      "appName": "MilletChain Store",
      "welcome": "Welcome,",
      "searchPlaceholder": "Search 'Ragi flour', 'Jowar'...",
      "freshFromFarm": "Fresh from the Farm",
      "loadingProducts": "Loading products...",
      "allSoldOut": "All products are currently sold out. Check back soon!",
      "processed": "Processed",
      "rawGood": "Raw Good",
      "soldBy": "Sold by:",
      "trace": "Trace",
      "addToCart": "Add to Cart",
      "itemInCart": "This item is already in your cart.",
      "itemAddedToCart": "added to cart!",
      "remove": "Remove",
      "navStore": "Store",
      "navCart": "Cart",
      "navOrders": "Orders",
      "navProfile": "Profile",
      "cartTitle": "My Cart",
      "cartEmpty": "Your cart is empty.",
      "subtotal": "Subtotal",
      "processingFee": "Processing Fee",
      "total": "Total",
      "checkout": "Proceed to Checkout",
      "checkingWallet": "Checking wallet...",
      "paymentFailed": "Payment Failed!",
      "insufficientFundsWallet": "Insufficient funds in your wallet.", // Matched key name
      "processingItem": "Processing item",
      "of": "of",
      "placingOrder": "Placing your order...",
      "completingPayment": "Completing payment...",
      "checkoutSuccess": "Checkout Successful!",
      "orderPlacedSuccess": "Order Placed Successfully!",
      "checkoutSuccessMsg": "Your order has been placed! You will be notified when it ships.",
      "checkoutFailed": "Checkout Failed!", // Appended in JS
      "ordersTitle": "My Purchase History",
      "ordersSubtitle": "All products you've bought, secured on the blockchain.",
      "loadingOrders": "Loading your orders...",
      "noOrders": "You haven't purchased any products yet.",
      "orderId": "Order ID:",
      "purchasedOn": "Purchased on:",
      "traceJourney": "Trace Full Journey",
      "statusPending": "Pending",
      "statusShipped": "Shipped",
      "statusDelivered": "Delivered",
      "confirmDelivery": "Confirm Delivery",
      "profileTitle": "My Profile",
      "walletBalance": "My Wallet Balance",
      "addMoney": "+ Add Money",
      "shippingAddress": "Shipping Address",
      "editProfile": "Edit Profile",
      "addMoneyPrompt": "Enter amount to add to your wallet:",
      "invalidAmount": "Invalid amount. Please enter a positive number.",
      "addingMoney": "Adding...",
      "moneyAddedSuccess": "added successfully!"
    },
    // --- [!! NEW !!] Processor App ---
    "processor": {
      // Titles & Navigation
      "sourcingTitle": "Sourcing",
      "inventoryTitle": "My Inventory",
      "addProductTitle": "Add Processed Product",
      "ordersTitle": "My Bulk Orders",
      "profileTitle": "Company Profile",
      "navSourcing": "Sourcing",
      "navInventory": "Inventory",
      "navAddProduct": "Add Product",
      "navOrders": "Orders",
      "navProfile": "Profile",

      // Sourcing Page
      "availableRawGoods": "Available Raw Goods",
      "searchPlaceholder": "Search bulk 'Ragi', 'Jowar'...",
      "loadingListings": "Loading listings...",
      "noRawGoods": "No available raw goods listings found.",
      "certified": "Certified",
      "uncertified": "Uncertified",
      "viewJourney": "View product journey",
      "traceUnavailable": "Traceability not available",
      "available": "Available",
      "buyNow": "Buy Now",
      "buyNowTooltip": "Confirm purchase (creates PENDING order)",
      "unknownSeller": "Unknown Seller",
      "errorLoadingListings": "Error loading listings",

      // Buy Now Process
      "buyErrorMissingData": "Error: Missing product data or processor profile.",
      "processingPurchase": "Processing...",
      "reservingItem": "Reserving item...", // Added
      "updatingDB": "Updating DB...",
      "dbUpdateFailed": "DB update failed",
      "loggingJourney": "Logging Journey...",
      "journeyLogFailed": "Failed to save purchase journey event",
      "purchased": "Order Placed!",
      "purchaseSuccessMsg": "Order Placed! The farmer has been notified to ship your item.",
      "buyFailed": "Purchase Failed",

      // Inventory Page
      "inventorySubtitle": "Confirmed raw goods, available to use for processed products.",
      "noInventory": "Your inventory is empty. Purchase raw goods and confirm delivery.",
      "purchasedFrom": "Purchased from:",
      "loadingInventory": "Loading inventory...", // Added
      "errorLoadingInventory": "Error loading inventory", // Added

      // Add Product Page
      "sourceMaterialLabel": "Source Material (from My Purchases)", // Changed key slightly
      "productNameLabel": "Product Name", // Added
      "productNamePlaceholder": "e.g., Organic Ragi Flour (1kg)",
      "quantityUnitsLabel": "Available Quantity (units)", // Added
      "quantityPlaceholder": "e.g., 500",
      "unitLabel": "Unit", // Added
      "unitPlaceholder": "e.g., kg",
      "pricePerUnitLabel": "Price (per unit)", // Added
      "pricePlaceholder": "e.g., 90",
      "loadingSources": "Loading sources...",
      "noSources": "No raw materials purchased yet.",
      "errorLoadingSources": "Error loading sources",
      "noneSource": "None (or multiple sources)",
      "from": "from",
      "listButton": "1. List Processed Product",
      "secureButton": "2. Secure on Blockchain",
      "myListedProducts": "Your Listed Products",
      "insertFailed": "Insert failed",
      "listSuccess": "Success! Product listed.",
      "listError": "Listing Failed",
      "secureSuccess": "Done!",
      "secureError": "Securing Failed",
      "noProductsListed": "You have not listed any products yet.",
      "errorLoadingMyProducts": "Error loading your products",
      "price": "Price",
      "edit": "Edit",
      "delete": "Delete",
      "incomingOrders": "Incoming Orders (Your Sales)", // Added
      "loadingIncomingOrders": "Loading incoming orders...", // Added
      "noIncomingOrders": "No incoming orders for your products yet.", // Added
      "errorLoadingIncomingOrders": "Error loading incoming orders.", // Added
      "buyer": "Buyer:", // Added
      "markAsShipped": "Mark as Shipped", // Added (duplicate key ok)
      "shipped": "Shipped", // Added
      "delivered": "Delivered", // Added
      "updateStatusFailed": "Failed to update status.", // Added

      // My Bulk Orders Page (Processor Purchases)
      "ordersSubtitle": "Track your raw material purchases from farmers.",
      "noOrdersPlaced": "You have not placed any bulk orders yet.",
      "waitForShipment": "Waiting for farmer to ship.",

      // Profile Page
      "walletBalance": "Company Wallet Balance",
      "companyAddress": "Company Address",
      "gstin": "GSTIN",
      "txHistoryEmpty": "Your transaction history will appear here after confirmed purchases or sales.",
      "saleOf": "Sale of",
      "purchaseOf": "Purchase of",
      "processorNotFound": "Processor profile 'Ahmedabad Foods' not found.",
      "refreshing": "Refreshing..." // Added
    }
  },
  "gu": {
    "appName": "મિલેટચેઇન",
    // --- Farmer App ---
    "farmer": {
      "dashboardTitle": "ડેશબોર્ડ",
      "welcome": "ફરી સ્વાગત છે",
      "atAGlance": "એક નજરમાં",
      "totalPayouts": "કુલ ચૂકવણી",
      "pendingOrders": "બાકી ઓર્ડર",
      "quickActions": "ઝડપી ક્રિયાઓ",
      "addProductBatch": "નવી પ્રોડક્ટ બેચ ઉમેરો",
      "viewPendingOrders": "બાકી ઓર્ડર જુઓ",
      "myListedProducts": "મારી સૂચિબદ્ધ પ્રોડક્ટ્સ",
      "noProductsListed": "કોઈ પ્રોડક્ટ્સ સૂચિબદ્ધ નથી",
      "tapAddProductToStart": "શરૂ કરવા માટે 'પ્રોડક્ટ ઉમેરો' પર ટેપ કરો.",
      "recentActivity": "તાજેતરની પ્રવૃત્તિ",
      "noRecentActivity": "કોઈ તાજેતરની પ્રવૃત્તિ નથી",
      "addProductTitle": "નવી પ્રોડક્ટ ઉમેરો",
      "productDetails": "પ્રોડક્ટની વિગતો",
      "chooseMillet": "એક બાજરી પસંદ કરો...",
      "bajra": "બાજરી",
      "jowar": "જુવાર",
      "ragi": "રાગી",
      "quantityQuintals": "જથ્થો (ક્વિન્ટલમાં)",
      "eg10": "દા.ત., ૧૦",
      "yourDistrict": "તમારો જિલ્લો",
      "chooseLocation": "તમારું સ્થાન પસંદ કરો...",
      "ahmedabad": "અમદાવાદ",
      "gandhinagar": "ગાંધીનગર",
      "productPhoto": "પ્રોડક્ટનો ફોટો",
      "tapToUploadPhoto": "ફોટો અપલોડ કરવા માટે ટેપ કરો",
      "photoBuildsTrust": "એક વાસ્તવિક ફોટો વિશ્વાસ બનાવે છે.",
      "qualityCertificate": "ગુણવત્તા પ્રમાણપત્ર (વૈકલ્પિક)",
      "tapToUploadCert": "પ્રમાણપત્ર અપલોડ કરવા માટે ટેપ કરો",
      "certExample": "દા.ત., ઓર્ગેનિક, FSSAI (PDF/છબી)",
      "aiPriceSuggestion": "AI કિંમત સૂચન",
      "getAiPriceSuggestion": "AI કિંમત સૂચન મેળવો",
      "finalListingPrice": "આખરી લિસ્ટિંગ કિંમત (પ્રતિ ક્વિન્ટલ)",
      "enterFinalPrice": "તમારી આખરી કિંમત દાખલ કરો",
      "listProductMarketplace": "૧. માર્કેટપ્લેસ પર પ્રોડક્ટની સૂચિ બનાવો",
      "secureOnBlockchain": "૨. બ્લોકચેન પર સુરક્ષિત કરો (વોલેટ કનેક્ટ કરો)",
      "manageOrdersTitle": "ઓર્ડર મેનેજ કરો",
      "ordersReceived": "પ્રાપ્ત ઓર્ડર",
      "noOrdersReceived": "હજુ સુધી કોઈ ઓર્ડર મળ્યા નથી",
      "ordersWillAppearHere": "ગ્રાહકોના નવા ઓર્ડર અહીં દેખાશે.",
      "myPayoutsTitle": "મારી ચૂકવણીઓ",
      "availablePayout": "ચૂકવણી માટે ઉપલબ્ધ",
      "withdrawToBank": "બેંકમાં ઉપાડો",
      "transactionHistory": "વ્યવહાર ઇતિહાસ",
      "noTransactions": "કોઈ વ્યવહાર ઇતિહાસ નથી",
      "payoutsWillAppearHere": "પૂર્ણ થયેલી ચૂકવણીઓ અહીં દેખાશે.",
      "navDashboard": "ડેશબોર્ડ",
      "navAddProduct": "પ્રોડક્ટ ઉમેરો",
      "navOrders": "ઓર્ડર્સ",
      "navPayouts": "ચૂકવણીઓ",
      "tapToChange": "બદલવા માટે ટેપ કરો",
      "selectProductDistrictError": "કૃપા કરીને પહેલા પ્રોડક્ટ અને જિલ્લો પસંદ કરો.",
      "gettingPrice": "AI સૂચન મેળવી રહ્યું છે...",
      "aiSuggests": "AI સૂચવે છે:",
      "basedOnTrends": "બજારના વલણો પર આધારિત.",
      "aiError": "કિંમત સૂચન મેળવવામાં ત્રુટિ",
      "dbError": "ત્રુટિ: ડેટાબેઝ અથવા પ્રોફાઇલ તૈયાર નથી.",
      "fillFieldsError": "કૃપા કરીને બધા જરૂરી ફીલ્ડ્સ ભરો.",
      "savingProduct": "પ્રોડક્ટ સેવ કરી રહ્યું છે...",
      "uploadingImage": "પ્રોડક્ટની છબી અપલોડ કરી રહ્યું છે...",
      "uploadingCert": "પ્રમાણપત્ર અપલોડ કરી રહ્યું છે...",
      "analyzingCert": "AI વડે પ્રમાણપત્રનું વિશ્લેષણ કરી રહ્યું છે...",
      "savingToDb": "ડેટાબેઝમાં પ્રોડક્ટ સેવ કરી રહ્યું છે...",
      "saved": "સેવ થયું!",
      "productSaved": "<strong>સફળતા! પ્રોડક્ટ સેવ થઈ.</strong><br>આગળનું પગલું: તેને બ્લોકચેન પર સુરક્ષિત કરો.",
      "savingFailed": "સેવ કરવામાં નિષ્ફળ:",
      "productIdError": "ત્રુટિ: પ્રોડક્ટ અથવા વિક્રેતા ID મળ્યું નથી.",
      "metamaskError": "ત્રુટિ: MetaMask કનેક્શન (પ્રદાતા) તૈયાર નથી.",
      "approveMetamask": "કૃપા કરીને MetaMask માં કનેક્શન મંજૂર કરો.",
      "approveTx": "કૃપા કરીને MetaMask માં વ્યવહાર મંજૂર કરો.",
      "waitingConfirmation": "બ્લોકચેન પુષ્ટિ માટે રાહ જોઈ રહ્યું છે...",
      "savingProof": "ડેટાબેઝમાં પુરાવો સેવ કરી રહ્યું છે...",
      "proofSaveError": "<strong>ચેતવણી!</strong><br>પ્રોડક્ટ સુરક્ષિત છે, પરંતુ DB માં પુરાવો સેવ કરવામાં નિષ્ફળ.",
      "allDone": "<strong>બધું પૂર્ણ!</strong><br>પ્રોડક્ટ ID {productId}... સુરક્ષિત.",
      "productSecured": "પ્રોડક્ટ સુરક્ષિત.",
      "viewOnEtherscan": "Etherscan પર જુઓ",
      "blockchainError": "બ્લોકચેન ત્રુટિ:",
      "txRejected": "MetaMask માં વ્યવહાર નકારવામાં આવ્યો.",
      "insufficientFundsEth": "ગેસ ફી માટે અપૂરતું Sepolia ETH.",
      "retrySecure": "કૃપા કરીને પ્રોડક્ટ ID {productId} ને સુરક્ષિત કરવા માટે ફરી પ્રયાસ કરો...",
      "loading": "લોડ કરી રહ્યું છે...",
      "errorLoadingProducts": "પ્રોડક્ટ્સ લોડ કરવામાં ત્રુટિ.",
      "secured": "સુરક્ષિત",
      "notSecured": "સુરક્ષિત નથી",
      "qty": "જથ્થો:",
      "total": "કુલ:",
      "orderId": "ઓર્ડર ID:",
      "markAsShipped": "શિપ તરીકે ચિહ્નિત કરો",
      "errorLoadingOrders": "ઓર્ડર લોડ કરવામાં ત્રુટિ.",
      "payoutFor": "માટે ચૂકવણી",
      "errorLoadingPayouts": "ચૂકવણી લોડ કરવામાં ત્રુટિ.",
      "withdrawPrompt": "ઉપાડવા માટે રકમ દાખલ કરો:",
      "invalidAmount": "અમાન્ય રકમ. કૃપા કરીને હકારાત્મક સંખ્યા દાખલ કરો.",
      "insufficientFundsWallet": "અપૂરતું ફંડ. તમારી પાસે ફક્ત ₹{balance} છે.",
      "withdrawing": "ઉપાડી રહ્યું છે...",
      "withdrawSuccess": "₹{amount} નો ઉપાડ સફળ! તમારું નવું બેલેન્સ ₹{newBalance} છે.",
      "withdrawError": "ઉપાડ નિષ્ફળ. કૃપા કરીને ફરી પ્રયાસ કરો."
    },
    // --- Consumer App ---
    "consumer": {
      "appName": "મિલેટચેઇન સ્ટોર",
      "welcome": "સ્વાગત છે,",
      "searchPlaceholder": "'રાગીનો લોટ', 'જુવાર' શોધો...",
      "freshFromFarm": "ખેતરમાંથી તાજું",
      "loadingProducts": "પ્રોડક્ટ્સ લોડ કરી રહ્યું છે...",
      "allSoldOut": "બધી પ્રોડક્ટ્સ હાલમાં વેચાઈ ગઈ છે. ટૂંક સમયમાં પાછા તપાસો!",
      "processed": "પ્રોસેસ્ડ",
      "rawGood": "કાચો માલ",
      "soldBy": "દ્વારા વેચાયેલ:",
      "trace": "ટ્રેસ",
      "addToCart": "કાર્ટમાં ઉમેરો",
      "itemInCart": "આ વસ્તુ તમારા કાર્ટમાં પહેલેથી જ છે.",
      "itemAddedToCart": "કાર્ટમાં ઉમેર્યું!",
      "remove": "દૂર કરો",
      "navStore": "સ્ટોર",
      "navCart": "કાર્ટ",
      "navOrders": "ઓર્ડર્સ",
      "navProfile": "પ્રોફાઇલ",
      "cartTitle": "મારું કાર્ટ",
      "cartEmpty": "તમારું કાર્ટ ખાલી છે.",
      "subtotal": "પેટાટોટલ",
      "processingFee": "પ્રોસેસિંગ ફી",
      "total": "કુલ",
      "checkout": "ચેકઆઉટ કરવા આગળ વધો",
      "checkingWallet": "વોલેટ તપાસી રહ્યું છે...",
      "paymentFailed": "ચુકવણી નિષ્ફળ!",
      "insufficientFundsWallet": "તમારા વોલેટમાં અપૂરતું ફંડ છે.",
      "processingItem": "આઇટમ પ્રોસેસ કરી રહ્યું છે",
      "of": "માંથી",
      "placingOrder": "તમારો ઓર્ડર મૂકી રહ્યો છે...",
      "completingPayment": "ચુકવણી પૂર્ણ કરી રહ્યું છે...",
      "checkoutSuccess": "ચેકઆઉટ સફળ!",
      "orderPlacedSuccess": "ઓર્ડર સફળતાપૂર્વક મૂક્યો!",
      "checkoutSuccessMsg": "તમારો ઓર્ડર મૂકવામાં આવ્યો છે! જ્યારે તે શિપ થશે ત્યારે તમને સૂચિત કરવામાં આવશે.",
      "checkoutFailed": "ચેકઆઉટ નિષ્ફળ!",
      "ordersTitle": "મારો ખરીદી ઇતિહાસ",
      "ordersSubtitle": "તમે ખરીદેલી બધી પ્રોડક્ટ્સ, બ્લોકચેન પર સુરક્ષિત.",
      "loadingOrders": "તમારા ઓર્ડર લોડ કરી રહ્યું છે...",
      "noOrders": "તમે હજી સુધી કોઈ પ્રોડક્ટ્સ ખરીદી નથી.",
      "orderId": "ઓર્ડર ID:",
      "purchasedOn": "પર ખરીદેલ:",
      "traceJourney": "સંપૂર્ણ જર્ની ટ્રેસ કરો",
      "statusPending": "બાકી",
      "statusShipped": "શિપ કર્યું",
      "statusDelivered": "ડિલિવર થયું",
      "confirmDelivery": "ડિલિવરી કન્ફર્મ કરો",
      "profileTitle": "મારી પ્રોફાઇલ",
      "walletBalance": "મારું વોલેટ બેલેન્સ",
      "addMoney": "+ પૈસા ઉમેરો",
      "shippingAddress": "શિપિંગ સરનામું",
      "editProfile": "પ્રોફાઇલ સંપાદિત કરો",
      "addMoneyPrompt": "તમારા વોલેટમાં ઉમેરવા માટે રકમ દાખલ કરો:",
      "invalidAmount": "અમાન્ય રકમ. કૃપા કરીને હકારાત્મક સંખ્યા દાખલ કરો.",
      "addingMoney": "ઉમેરી રહ્યું છે...",
      "moneyAddedSuccess": "સફળતાપૂર્વક ઉમેર્યું!"
    },
    // --- Processor App ---
    "processor": {
      "sourcingTitle": "સોર્સિંગ",
      "inventoryTitle": "મારી ઇન્વેન્ટરી",
      "addProductTitle": "પ્રોસેસ્ડ પ્રોડક્ટ ઉમેરો",
      "ordersTitle": "મારા બલ્ક ઓર્ડર્સ",
      "profileTitle": "કંપની પ્રોફાઇલ",
      "navSourcing": "સોર્સિંગ",
      "navInventory": "ઇન્વેન્ટરી",
      "navAddProduct": "પ્રોડક્ટ ઉમેરો",
      "navOrders": "ઓર્ડર્સ",
      "navProfile": "પ્રોફાઇલ",
      "availableRawGoods": "ઉપલબ્ધ કાચો માલ",
      "searchPlaceholder": "થોક 'રાગી', 'જુવાર' શોધો...",
      "loadingListings": "લિસ્ટિંગ લોડ કરી રહ્યું છે...",
      "noRawGoods": "કોઈ કાચો માલ ઉપલબ્ધ નથી.",
      "certified": "પ્રમાણિત",
      "uncertified": "બિન-પ્રમાણિત",
      "viewJourney": "પ્રોડક્ટની જર્ની જુઓ",
      "traceUnavailable": "ટ્રેસિંગ અનુપલબ્ધ",
      "available": "ઉપલબ્ધ",
      "buyNow": "હમણાં ખરીદો",
      "buyNowTooltip": "ખરીદીની પુષ્ટિ કરો (PENDING ઓર્ડર બનશે)",
      "unknownSeller": "અજ્ઞાત વિક્રેતા",
      "errorLoadingListings": "લિસ્ટિંગ લોડ કરવામાં ભૂલ",
      "buyErrorMissingData": "ભૂલ: ખરીદી માટે પ્રોડક્ટ ડેટા ખૂટે છે.",
      "processingPurchase": "પ્રક્રિયા ચાલી રહી છે...",
      "reservingItem": "આઇટમ રિઝર્વ થઈ રહી છે...",
      "updatingDB": "ડેટાબેઝ અપડેટ થઈ રહ્યો છે...",
      "dbUpdateFailed": "ડેટાબેઝ અપડેટ નિષ્ફળ",
      "loggingJourney": "જર્ની લોગ કરી રહ્યું છે...",
      "journeyLogFailed": "જર્ની ઇવેન્ટ સેવ નિષ્ફળ",
      "purchased": "ઓર્ડર પ્લેસ થયો!",
      "purchaseSuccessMsg": "ઓર્ડર પ્લેસ થયો! ખેડૂતને શિપિંગ માટે સૂચના આપવામાં આવી છે.",
      "buyFailed": "ખરીદી નિષ્ફળ",
      "inventorySubtitle": "કન્ફર્મ કરેલ કાચો માલ, પ્રોસેસ્ડ પ્રોડક્ટ્સ માટે વાપરવા ઉપલબ્ધ.",
      "noInventory": "તમારી ઇન્વેન્ટરી ખાલી છે. કાચો માલ ખરીદો અને ડિલિવરી કન્ફર્મ કરો.",
      "purchasedFrom": "પાસેથી ખરીદેલ:",
      "loadingInventory": "ઇન્વેન્ટરી લોડ કરી રહ્યું છે...",
      "errorLoadingInventory": "ઇન્વેન્ટરી લોડ કરવામાં ભૂલ",
      "sourceMaterialLabel": "સ્રોત સામગ્રી (મારી ખરીદીમાંથી)",
      "productNameLabel": "પ્રોડક્ટનું નામ",
      "productNamePlaceholder": "દા.ત., ઓર્ગેનિક રાગીનો લોટ (૧ કિલો)",
      "quantityUnitsLabel": "ઉપલબ્ધ જથ્થો (એકમો)",
      "quantityPlaceholder": "દા.ત., ૫૦૦",
      "unitLabel": "એકમ",
      "unitPlaceholder": "દા.ત., કિલો",
      "pricePerUnitLabel": "કિંમત (પ્રતિ એકમ)",
      "pricePlaceholder": "દા.ત., ૯૦",
      "loadingSources": "સ્રોતો લોડ કરી રહ્યું છે...",
      "noSources": "હજી સુધી કોઈ કાચો માલ ખરીદ્યો નથી.",
      "errorLoadingSources": "સ્રોતો લોડ કરવામાં ભૂલ",
      "noneSource": "કોઈ નહીં (અથવા બહુવિધ સ્રોતો)",
      "from": "પાસેથી",
      "listButton": "૧. પ્રોસેસ્ડ પ્રોડક્ટ લિસ્ટ કરો",
      "secureButton": "૨. બ્લોકચેન પર સુરક્ષિત કરો",
      "myListedProducts": "તમારી લિસ્ટેડ પ્રોડક્ટ્સ",
      "insertFailed": "ઉમેરવામાં નિષ્ફળ",
      "listSuccess": "સફળતા! પ્રોડક્ટ લિસ્ટ થઈ.",
      "listError": "લિસ્ટિંગ નિષ્ફળ",
      "secureSuccess": "થઈ ગયું!",
      "secureError": "સુરક્ષિત કરવામાં નિષ્ફળ",
      "noProductsListed": "તમે હજી સુધી કોઈ પ્રોડક્ટ્સ લિસ્ટ કરી નથી.",
      "errorLoadingMyProducts": "તમારી પ્રોડક્ટ્સ લોડ કરવામાં ભૂલ",
      "price": "કિંમત",
      "edit": "ફેરફાર કરો",
      "delete": "કાઢી નાખો",
      "incomingOrders": "આવનારા ઓર્ડર્સ (તમારા વેચાણ)",
      "loadingIncomingOrders": "આવનારા ઓર્ડર્સ લોડ કરી રહ્યું છે...",
      "noIncomingOrders": "તમારી પ્રોડક્ટ્સ માટે હજુ સુધી કોઈ આવનારા ઓર્ડર નથી.",
      "errorLoadingIncomingOrders": "આવનારા ઓર્ડર્સ લોડ કરવામાં ભૂલ.",
      "buyer": "ખરીદનાર:",
      "markAsShipped": "શિપ તરીકે ચિહ્નિત કરો",
      "shipped": "શિપ કર્યું",
      "delivered": "ડિલિવર થયું",
      "updateStatusFailed": "સ્થિતિ અપડેટ કરવામાં નિષ્ફળ.",
      "ordersSubtitle": "ખેડૂતો પાસેથી તમારી કાચા માલની ખરીદીને ટ્રેક કરો.",
      "noOrdersPlaced": "તમે હજી સુધી કોઈ બલ્ક ઓર્ડર આપ્યો નથી.",
      "waitForShipment": "ખેડૂત દ્વારા શિપિંગની રાહ જોવાઈ રહી છે.",
      "walletBalance": "કંપની વોલેટ બેલેન્સ",
      "companyAddress": "કંપનીનું સરનામું",
      "gstin": "જીએસટીઆઇએન",
      "txHistoryEmpty": "કન્ફર્મ ખરીદી કે વેચાણ પછી તમારો વ્યવહાર ઇતિહાસ અહીં દેખાશે.",
      "saleOf": "નું વેચાણ",
      "purchaseOf": "ની ખરીદી",
      "processorNotFound": "પ્રોસેસર પ્રોફાઇલ 'Ahmedabad Foods' મળી નથી.",
      "refreshing": "રીફ્રેશ થઈ રહ્યું છે..."
    },
    "trace": {
  "title": "પ્રોડક્ટ ટ્રેસેબિલિટી",
  "pageHeader": "ફાર્મ-ટુ-ફોર્ક ટ્રેસેબિલિટી",
  "poweredBy": "દ્વારા સંચાલિત",
  "backToStore": "સ્ટોર પર પાછા જાઓ",
  "loadingProduct": "(પ્રોડક્ટ લોડ થઈ રહ્યું છે...)",
  "productIdLabel": "પ્રોડક્ટ ID:",
  "loadingId": "(લોડ થઈ રહ્યું છે...)",
  "sellerLabel": "વિક્રેતા:",
  "loadingSeller": "(લોડ થઈ રહ્યું છે...)",
  "processedFrom": "(માંથી પ્રોસેસ્ડ",
  "by": "દ્વારા",
  "unknown": "અજ્ઞાત",
  "journeyHeader": "પ્રોડક્ટ જર્ની",
  "loadingJourney": "જર્ની લોડ થઈ રહ્યું છે...",
  "connectingDb": "ડેટાબેઝ સાથે કનેક્ટ થઈ રહ્યું છે...",
  "pleaseWait": "કૃપા કરીને રાહ જુઓ...",
  "errorGeneric": "ત્રુટિ",
  "errorNoId": "URL માં કોઈ પ્રોડક્ટ ID પ્રદાન કરવામાં આવ્યું નથી.",
  "errorDbConnection": "ત્રુટિ: DB કનેક્શન નિષ્ફળ",
  "errorLoadingData": "ડેટા લોડ કરવામાં ત્રુટિ",
  "noJourneyData": "કોઈ જર્ની ડેટા મળ્યો નથી",
  "noJourneyDetails": "આ પ્રોડક્ટ માટે હજુ સુધી કોઈ ટ્રેસેબિલિટી ઇવેન્ટ્સ લોગ કરવામાં આવી નથી.",
  "viewTxLink": "વ્યવહાર જુઓ ⛓️",
  "viewTxListed": "'સૂચિબદ્ધ/સુરક્ષિત' Tx જુઓ ⛓️",
  "viewTxShipped": "'શિપ કરેલ' Tx જુઓ ⛓️",
  "viewTxDelivered": "'ડિલિવર કરેલ' Tx જુઓ ⛓️",
  "sourceMaterialIndicator": "[સ્રોત સામગ્રી જર્ની]",
  "processedProductIndicator": "[પ્રોસેસ્ડ પ્રોડક્ટ જર્ની]",
  "proofHeader": "સેપોલિયા ટેસ્ટનેટ પર પુરાવો",
  "proofDescription": "આ પ્રોડક્ટની જર્ની ઈથેરિયમ બ્લોકચેન પર કાયમ માટે રેકોર્ડ કરવામાં આવી છે. આ ખાતરી આપે છે કે ડેટા અપરિવર્તનશીલ છે અને કોઈપણ દ્વારા બદલી શકાતો નથી.",
  "txHashLabel": "પ્રારંભિક લિસ્ટિંગ ટ્રાન્ઝેક્શન હેશ:",
  "waitingTx": "(વ્યવહારની રાહ જોવાઈ રહી છે...)",
  "notSecured": "(હજુ સુધી બ્લોકચેન પર સુરક્ષિત નથી)",
  "viewOnEtherscan": "Etherscan પર જુઓ"
},
  },
  "hi": {
    "appName": "मिलेटचेन",
    // --- Farmer App ---
    "farmer": {
      "dashboardTitle": "डैशबोर्ड",
      "welcome": "वापस स्वागत है",
      "atAGlance": "एक नज़र में",
      "totalPayouts": "कुल भुगतान",
      "pendingOrders": "लंबित ऑर्डर",
      "quickActions": "त्वरित कार्रवाइयाँ",
      "addProductBatch": "नया उत्पाद बैच जोड़ें",
      "viewPendingOrders": "लंबित ऑर्डर देखें",
      "myListedProducts": "मेरे सूचीबद्ध उत्पाद",
      "noProductsListed": "कोई उत्पाद सूचीबद्ध नहीं है",
      "tapAddProductToStart": "शुरू करने के लिए 'उत्पाद जोड़ें' पर टैप करें।",
      "recentActivity": "हाल की गतिविधि",
      "noRecentActivity": "कोई हाल की गतिविधि नहीं",
      "addProductTitle": "नया उत्पाद जोड़ें",
      "productDetails": "उत्पाद विवरण",
      "chooseMillet": "एक बाजरा चुनें...",
      "bajra": "बाजरा",
      "jowar": "ज्वार",
      "ragi": "रागी",
      "quantityQuintals": "मात्रा (क्विंटल में)",
      "eg10": "जैसे, १०",
      "yourDistrict": "आपका जिला",
      "chooseLocation": "अपना स्थान चुनें...",
      "ahmedabad": "अहमदाबाद",
      "gandhinagar": "गांधीनगर",
      "productPhoto": "उत्पाद फोटो",
      "tapToUploadPhoto": "फोटो अपलोड करने के लिए टैप करें",
      "photoBuildsTrust": "एक वास्तविक फोटो विश्वास बनाता है।",
      "qualityCertificate": "गुणवत्ता प्रमाणपत्र (वैकल्पिक)",
      "tapToUploadCert": "प्रमाणपत्र अपलोड करने के लिए टैप करें",
      "certExample": "जैसे, ऑर्गेनिक, FSSAI (PDF/छवि)",
      "aiPriceSuggestion": "AI मूल्य सुझाव",
      "getAiPriceSuggestion": "AI मूल्य सुझाव प्राप्त करें",
      "finalListingPrice": "अंतिम लिस्टिंग मूल्य (प्रति क्विंटल)",
      "enterFinalPrice": "अपना अंतिम मूल्य दर्ज करें",
      "listProductMarketplace": "१. मार्केटप्लेस पर उत्पाद सूचीबद्ध करें",
      "secureOnBlockchain": "२. ब्लॉकचेन पर सुरक्षित करें (वॉलेट कनेक्ट करें)",
      "manageOrdersTitle": "ऑर्डर प्रबंधित करें",
      "ordersReceived": "प्राप्त ऑर्डर",
      "noOrdersReceived": "अभी तक कोई ऑर्डर नहीं मिला है",
      "ordersWillAppearHere": "उपभोक्ताओं से नए ऑर्डर यहां दिखाई देंगे।",
      "myPayoutsTitle": "मेरे भुगतान",
      "availablePayout": "भुगतान के लिए उपलब्ध",
      "withdrawToBank": "बैंक में निकालें",
      "transactionHistory": "लेन-देन इतिहास",
      "noTransactions": "कोई लेन-देन इतिहास नहीं",
      "payoutsWillAppearHere": "पूर्ण भुगतान यहां दिखाई देंगे।",
      "navDashboard": "डैशबोर्ड",
      "navAddProduct": "उत्पाद जोड़ें",
      "navOrders": "ऑर्डर",
      "navPayouts": "भुगतान",
      "tapToChange": "बदलने के लिए टैप करें",
      "selectProductDistrictError": "कृपया पहले एक उत्पाद और जिला चुनें।",
      "gettingPrice": "AI सुझाव प्राप्त हो रहा है...",
      "aiSuggests": "AI सुझाता है:",
      "basedOnTrends": "बाजार के रुझानों पर आधारित।",
      "aiError": "मूल्य सुझाव प्राप्त करने में त्रुटि",
      "dbError": "त्रुटि: डेटाबेस या प्रोफ़ाइल तैयार नहीं है।",
      "fillFieldsError": "कृपया सभी आवश्यक फ़ील्ड भरें।",
      "savingProduct": "उत्पाद सहेजा जा रहा है...",
      "uploadingImage": "उत्पाद छवि अपलोड हो रही है...",
      "uploadingCert": "प्रमाणपत्र अपलोड हो रहा है...",
      "analyzingCert": "AI द्वारा प्रमाणपत्र का विश्लेषण किया जा रहा है...",
      "savingToDb": "डेटाबेस में उत्पाद सहेजा जा रहा है...",
      "saved": "सहेजा गया!",
      "productSaved": "<strong>सफलता! उत्पाद सहेजा गया।</strong><br>अगला कदम: इसे ब्लॉकचेन पर सुरक्षित करें।",
      "savingFailed": "सहेजने में विफल:",
      "productIdError": "त्रुटि: उत्पाद या विक्रेता ID नहीं मिला।",
      "metamaskError": "त्रुटि: MetaMask कनेक्शन (प्रदाता) तैयार नहीं है।",
      "approveMetamask": "कृपया MetaMask में कनेक्शन को मंजूरी दें।",
      "approveTx": "कृपया MetaMask में लेनदेन को मंजूरी दें।",
      "waitingConfirmation": "ब्लॉकचेन पुष्टि की प्रतीक्षा की जा रही है...",
      "savingProof": "डेटाबेस में सबूत सहेजा जा रहा है...",
      "proofSaveError": "<strong>चेतावनी!</strong><br>उत्पाद सुरक्षित है, लेकिन DB में सबूत सहेजने में विफल।",
      "allDone": "<strong>सब हो गया!</strong><br>उत्पाद ID {productId}... सुरक्षित।",
      "productSecured": "उत्पाद सुरक्षित।",
      "viewOnEtherscan": "Etherscan पर देखें",
      "blockchainError": "ब्लॉकचेन त्रुटि:",
      "txRejected": "MetaMask में लेनदेन अस्वीकृत।",
      "insufficientFundsEth": "गैस शुल्क के लिए अपर्याप्त Sepolia ETH।",
      "retrySecure": "कृपया उत्पाद ID {productId} को सुरक्षित करने के लिए पुनः प्रयास करें...",
      "loading": "लोड हो रहा है...",
      "errorLoadingProducts": "उत्पाद लोड करने में त्रुटि।",
      "secured": "सुरक्षित",
      "notSecured": "सुरक्षित नहीं",
      "qty": "मात्रा:",
      "total": "कुल:",
      "orderId": "ऑर्डर ID:",
      "markAsShipped": "शिप के रूप में चिह्नित करें",
      "errorLoadingOrders": "ऑर्डर लोड करने में त्रुटि।",
      "payoutFor": "के लिए भुगतान",
      "errorLoadingPayouts": "भुगतान लोड करने में त्रुटि.",
      "withdrawPrompt": "निकालने के लिए राशि दर्ज करें:",
      "invalidAmount": "अमान्य राशि। कृपया एक सकारात्मक संख्या दर्ज करें।",
      "insufficientFundsWallet": "अपर्याप्त धनराशि। आपके पास केवल ₹{balance} हैं।",
      "withdrawing": "निकाला जा रहा है...",
      "withdrawSuccess": "₹{amount} की निकासी सफल! आपका नया बैलेंस ₹{newBalance} है।",
      "withdrawError": "निकासी विफल। कृपया पुनः प्रयास करें।"
    },
    // --- Consumer App ---
    "consumer": {
      "appName": "मिलेटचेन स्टोर",
      "welcome": "स्वागत है,",
      "searchPlaceholder": "'रागी का आटा', 'ज्वार' खोजें...",
      "freshFromFarm": "खेत से ताज़ा",
      "loadingProducts": "उत्पाद लोड हो रहे हैं...",
      "allSoldOut": "सभी उत्पाद वर्तमान में बिक चुके हैं। जल्द ही वापस देखें!",
      "processed": "संसाधित",
      "rawGood": "कच्चा माल",
      "soldBy": "द्वारा बेचा गया:",
      "trace": "ट्रेस",
      "addToCart": "कार्ट में जोड़ें",
      "itemInCart": "यह आइटम आपके कार्ट में पहले से है।",
      "itemAddedToCart": "कार्ट में जोड़ा गया!",
      "remove": "हटाएं",
      "navStore": "स्टोर",
      "navCart": "कार्ट",
      "navOrders": "ऑर्डर",
      "navProfile": "प्रोफाइल",
      "cartTitle": "मेरा कार्ट",
      "cartEmpty": "आपका कार्ट खाली है।",
      "subtotal": "उप-योग",
      "processingFee": "प्रोसेसिंग शुल्क",
      "total": "कुल",
      "checkout": "चेकआउट के लिए आगे बढ़ें",
      "checkingWallet": "वॉलेट की जाँच हो रही है...",
      "paymentFailed": "भुगतान विफल!",
      "insufficientFundsWallet": "आपके वॉलेट में अपर्याप्त धनराशि है।",
      "processingItem": "आइटम संसाधित हो रहा है",
      "of": "का",
      "placingOrder": "आपका ऑर्डर दिया जा रहा है...",
      "completingPayment": "भुगतान पूरा हो रहा है...",
      "checkoutSuccess": "चेकआउट सफल!",
      "orderPlacedSuccess": "ऑर्डर सफलतापूर्वक दिया गया!",
      "checkoutSuccessMsg": "आपका ऑर्डर दे दिया गया है! जब यह शिप होगा तो आपको सूचित किया जाएगा।",
      "checkoutFailed": "चेकआउट विफल!",
      "ordersTitle": "मेरी खरीद इतिहास",
      "ordersSubtitle": "आपके द्वारा खरीदे गए सभी उत्पाद, ब्लॉकचेन पर सुरक्षित।",
      "loadingOrders": "आपके ऑर्डर लोड हो रहे हैं...",
      "noOrders": "आपने अभी तक कोई उत्पाद नहीं खरीदा है।",
      "orderId": "ऑर्डर ID:",
      "purchasedOn": "को खरीदा गया:",
      "traceJourney": "पूरी यात्रा ट्रेस करें",
      "statusPending": "लंबित",
      "statusShipped": "भेजा गया",
      "statusDelivered": "पहुंचा दिया गया",
      "confirmDelivery": "डिलीवरी की पुष्टि करें",
      "profileTitle": "मेरी प्रोफाइल",
      "walletBalance": "मेरा वॉलेट बैलेंस",
      "addMoney": "+ पैसे जोड़ें",
      "shippingAddress": "शिपिंग पता",
      "editProfile": "प्रोफ़ाइल संपादित करें",
      "addMoneyPrompt": "अपने वॉलेट में जोड़ने के लिए राशि दर्ज करें:",
      "invalidAmount": "अमान्य राशि। कृपया एक सकारात्मक संख्या दर्ज करें।",
      "addingMoney": "जोड़ा जा रहा है...",
      "moneyAddedSuccess": "सफलतापूर्वक जोड़ा गया!"
    },
    // --- Processor App ---
    "processor": {
      "sourcingTitle": "सोर्सिंग",
      "inventoryTitle": "मेरी इन्वेंटरी",
      "addProductTitle": "संसाधित उत्पाद जोड़ें",
      "ordersTitle": "मेरे थोक ऑर्डर",
      "profileTitle": "कंपनी प्रोफ़ाइल",
      "navSourcing": "सोर्सिंग",
      "navInventory": "इन्वेंटरी",
      "navAddProduct": "उत्पाद जोड़ें",
      "navOrders": "ऑर्डर",
      "navProfile": "प्रोफ़ाइल",
      "availableRawGoods": "उपलब्ध कच्चा माल",
      "searchPlaceholder": "थोक 'रागी', 'ज्वार' खोजें...",
      "loadingListings": "लिस्टिंग लोड हो रही हैं...",
      "noRawGoods": "कोई कच्चा माल उपलब्ध नहीं है।",
      "certified": "प्रमाणित",
      "uncertified": "अप्रमाणित",
      "viewJourney": "उत्पाद यात्रा देखें",
      "traceUnavailable": "ट्रेसिंग अनुपलब्ध",
      "available": "उपलब्ध",
      "buyNow": "अभी खरीदें",
      "buyNowTooltip": "खरीद की पुष्टि करें (PENDING ऑर्डर बनेगा)",
      "unknownSeller": "अज्ञात विक्रेता",
      "errorLoadingListings": "लिस्टिंग लोड करने में त्रुटि",
      "buyErrorMissingData": "त्रुटि: खरीद के लिए उत्पाद डेटा गायब है।",
      "processingPurchase": "प्रसंस्करण हो रहा है...",
      "reservingItem": "आइटम आरक्षित किया जा रहा है...",
      "updatingDB": "डेटाबेस अपडेट हो रहा है...",
      "dbUpdateFailed": "डेटाबेस अपडेट विफल",
      "loggingJourney": "यात्रा लॉग हो रही है...",
      "journeyLogFailed": "यात्रा ईवेंट सहेजने में विफल",
      "purchased": "ऑर्डर दे दिया गया!",
      "purchaseSuccessMsg": "ऑर्डर दे दिया गया है! किसान को आपका आइटम शिप करने के लिए सूचित कर दिया गया है।",
      "buyFailed": "खरीद विफल",
      "inventorySubtitle": "पुષ્ટ कच्चा माल, संसाधित उत्पादों के लिए उपयोग हेतु उपलब्ध।",
      "noInventory": "आपकी इन्वेंटरी खाली है। कच्चा माल खरीदें और डिलीवरी की पुष्टि करें।",
      "purchasedFrom": "से खरीदा गया:",
      "loadingInventory": "इन्वेंटरी लोड हो रही है...",
      "errorLoadingInventory": "इन्वेंटरी लोड करने में त्रुटि",
      "sourceMaterialLabel": "स्रोत सामग्री (मेरी खरीद से)",
      "productNameLabel": "उत्पाद का नाम",
      "productNamePlaceholder": "जैसे, ऑर्गेनिक रागी आटा (१ किलो)",
      "quantityUnitsLabel": "उपलब्ध मात्रा (इकाइयाँ)",
      "quantityPlaceholder": "जैसे, ५००",
      "unitLabel": "इकाई",
      "unitPlaceholder": "जैसे, किलो",
      "pricePerUnitLabel": "मूल्य (प्रति इकाई)",
      "pricePlaceholder": "जैसे, ९०",
      "loadingSources": "स्रोत लोड हो रहे हैं...",
      "noSources": "अभी तक कोई कच्चा माल नहीं खरीदा गया है।",
      "errorLoadingSources": "स्रोत लोड करने में त्रुटि",
      "noneSource": "कोई नहीं (या एकाधिक स्रोत)",
      "from": " से",
      "listButton": "१. संसाधित उत्पाद सूचीबद्ध करें",
      "secureButton": "२. ब्लॉकचेन पर सुरक्षित करें",
      "myListedProducts": "आपके सूचीबद्ध उत्पाद",
      "insertFailed": "सम्मिलित करने में विफल",
      "listSuccess": "सफलता! उत्पाद सूचीबद्ध।",
      "listError": "लिस्टिंग विफल",
      "secureSuccess": "हो गया!",
      "secureError": "सुरक्षित करने में विफल",
      "noProductsListed": "आपने अभी तक कोई उत्पाद सूचीबद्ध नहीं किया है।",
      "errorLoadingMyProducts": "आपके उत्पाद लोड करने में त्रुटि",
      "price": "मूल्य",
      "edit": "संपादित करें",
      "delete": "हटाएं",
      "incomingOrders": "आने वाले ऑर्डर (आपकी बिक्री)",
      "loadingIncomingOrders": "आने वाले ऑर्डर लोड हो रहे हैं...",
      "noIncomingOrders": "आपके उत्पादों के लिए अभी तक कोई आने वाले ऑर्डर नहीं हैं।",
      "errorLoadingIncomingOrders": "आने वाले ऑर्डर लोड करने में त्रुटि।",
      "buyer": "खरीदार:",
      "markAsShipped": "शिप के रूप में चिह्नित करें",
      "shipped": "भेजा गया",
      "delivered": "पहुंचा दिया गया",
      "updateStatusFailed": "स्थिति अपडेट करने में विफल।",
      "ordersSubtitle": "किसानों से अपनी कच्चे माल की खरीद को ट्रैक करें।",
      "noOrdersPlaced": "आपने अभी तक कोई थोक ऑर्डर नहीं दिया है।",
      "waitForShipment": "किसान द्वारा शिपिंग की प्रतीक्षा है।",
      "walletBalance": "कंपनी वॉलेट बैलेंस",
      "companyAddress": "कंपनी का पता",
      "gstin": "जीएसटीआईएन",
      "txHistoryEmpty": "पुષ્ટ खरीद या बिक्री के बाद आपका लेनदेन इतिहास यहां दिखाई देगा।",
      "saleOf": "की बिक्री",
      "purchaseOf": "की खरीद",
      "processorNotFound": "प्रोसेसर प्रोफ़ाइल 'Ahmedabad Foods' नहीं मिली।",
      "refreshing": "रीफ्रेश हो रहा है..."
    },
    "trace": {
  "title": "उत्पाद ट्रेसबिलिटी",
  "pageHeader": "फार्म-टू-फोर्क ट्रेसबिलिटी",
  "poweredBy": "द्वारा संचालित",
  "backToStore": "स्टोर पर वापस जाएं",
  "loadingProduct": "(उत्पाद लोड हो रहा है...)",
  "productIdLabel": "उत्पाद ID:",
  "loadingId": "(लोड हो रहा है...)",
  "sellerLabel": "विक्रेता:",
  "loadingSeller": "(लोड हो रहा है...)",
  "processedFrom": "(से संसाधित",
  "by": "द्वारा",
  "unknown": "अज्ञात",
  "journeyHeader": "उत्पाद यात्रा",
  "loadingJourney": "यात्रा लोड हो रही है...",
  "connectingDb": "डेटाबेस से कनेक्ट हो रहा है...",
  "pleaseWait": "कृपया प्रतीक्षा करें...",
  "errorGeneric": "त्रुटि",
  "errorNoId": "URL में कोई उत्पाद ID प्रदान नहीं किया गया था।",
  "errorDbConnection": "त्रुटि: DB कनेक्शन विफल",
  "errorLoadingData": "डेटा लोड करने में त्रुटि",
  "noJourneyData": "कोई यात्रा डेटा नहीं मिला",
  "noJourneyDetails": "इस उत्पाद के लिए अभी तक कोई ट्रेसबिलिटी ईवेंट लॉग नहीं किया गया है।",
  "viewTxLink": "लेनदेन देखें ⛓️",
  "viewTxListed": "'सूचीबद्ध/सुरक्षित' Tx देखें ⛓️",
  "viewTxShipped": "'शिप किया गया' Tx देखें ⛓️",
  "viewTxDelivered": "'डिलीवर किया गया' Tx देखें ⛓️",
  "sourceMaterialIndicator": "[स्रोत सामग्री यात्रा]",
  "processedProductIndicator": "[संसाधित उत्पाद यात्रा]",
  "proofHeader": "सेपोलिया टेस्टनेट पर प्रमाण",
  "proofDescription": "इस उत्पाद की यात्रा स्थायी रूप से इथेरियम ब्लॉकचेन पर दर्ज की गई है। यह गारंटी देता है कि डेटा अपरिवर्तनीय है और इसे किसी के द्वारा बदला नहीं जा सकता है।",
  "txHashLabel": "प्रारंभिक लिस्टिंग लेनदेन हैश:",
  "waitingTx": "(लेनदेन की प्रतीक्षा की जा रही है...)",
  "notSecured": "(अभी तक ब्लॉकचेन पर सुरक्षित नहीं है)",
  "viewOnEtherscan": "Etherscan पर देखें"
}
  }
};


// --- i18n Functions ---
let currentLang = localStorage.getItem('milletLang') || 'en';

function t(key, replacements = {}) {
  let keys = key.split('.');
  let result = translations[currentLang];
  
  try {
      for (let k of keys) {
          result = result[k];
          if (result === undefined) throw new Error("Key part not found");
      }
  } catch (e) {
      console.warn(`Translation key not found: ${key} for lang: ${currentLang}`);
      return key; // Return the key itself as fallback
  }

  // Handle replacements if it's a string
  if (typeof result === 'string') {
    Object.keys(replacements).forEach(placeholder => {
      // Use a simpler regex that works for basic placeholders
      const regex = new RegExp(`\\{${placeholder}\\}`, 'g');
      result = result.replace(regex, replacements[placeholder]);
    });
    return result;
  } else {
    // If the found value is not a string (e.g., an object if the key was incomplete), return the key
    console.warn(`Translation for key ${key} is not a string, it's a ${typeof result}. Returning key.`);
    return key;
  }
}

function applyTranslations(element = document.body) {
    if (!element || typeof element.querySelectorAll !== 'function') {
        console.error("applyTranslations called with invalid element:", element);
        return;
    }

    // Apply translations to elements with data-i18n attribute
    element.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        
        // Handle placeholders
        if (key.startsWith('[placeholder]')) {
            const placeholderKey = key.substring('[placeholder]'.length);
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = t(placeholderKey);
            } else {
                 console.warn(`[placeholder] used on non-input element: ${key} on <${el.tagName}>`);
            }
        // Handle normal text content
        } else {
            // Use innerHTML only for keys known to contain HTML (like specific status messages)
             if (key.includes('productSaved') || key.includes('proofSaveError') || key.includes('allDone')) {
                 el.innerHTML = t(key); // Allow HTML for specific keys
             } else {
                 el.textContent = t(key); // Safer default
             }
        }
    });

    // Translate page title
    const titleElement = document.querySelector('title[data-i18n]');
    if (titleElement) {
        titleElement.textContent = t(titleElement.dataset.i18n);
    }
    // Translate dynamic app header title based on current page
    const appTitleElement = document.getElementById('app-title');
    if (appTitleElement && appTitleElement.dataset.currentPageKey) {
        appTitleElement.textContent = t(appTitleElement.dataset.currentPageKey);
    }
}


function setLanguage(lang) {
  if (translations[lang]) {
    currentLang = lang;
    localStorage.setItem('milletLang', lang);
    console.log(`Language set to ${lang}`);
    
    // Update active state on language switcher buttons
    document.querySelectorAll('.language-switcher button').forEach(button => {
        button.classList.toggle('active', button.dataset.lang === lang);
    });
    
    // Apply translations to the entire page
    applyTranslations(document.body);

    // --- Re-render dynamic content ---
    // Try to find the active page and call its specific load function if it exists
    const activePage = document.querySelector('.app-page.active');
    if (activePage) {
        const pageId = activePage.id.replace('page-', '');
        console.log(`Re-rendering dynamic content for page: ${pageId}`);
        
        // Check which app context we are likely in based on function existence
        
        // Farmer app functions
        if (typeof loadFarmerProducts === 'function' && pageId === 'dashboard') {
            loadFarmerProducts(); 
        } else if (typeof loadOrdersData === 'function' && pageId === 'orders') { // Farmer orders page
            loadOrdersData();
        } else if (typeof loadPayoutsData === 'function' && pageId === 'payouts') {
            loadPayoutsData();
        }
        
        // Consumer app functions
        else if (typeof loadProducts === 'function' && pageId === 'store') {
             loadProducts();
        } else if (typeof loadCartPage === 'function' && pageId === 'cart') {
             loadCartPage();
        } else if (typeof loadMyOrders === 'function' && pageId === 'orders') { // Consumer orders page
             loadMyOrders();
        } else if (typeof loadProfilePage === 'function' && pageId === 'profile') { // Consumer profile page
            loadProfilePage();
        }

        // Processor app functions
        else if (typeof loadSourcingListings === 'function' && pageId === 'sourcing') {
            loadSourcingListings();
        } else if (typeof loadMyInventory === 'function' && pageId === 'inventory') {
            loadMyInventory();
        } else if (typeof loadMyListedProducts === 'function' && pageId === 'addproduct') {
            loadMyListedProducts();
            loadMyPurchasedProducts();
            loadIncomingOrders(); // Ensure all parts of addproduct page reload
        } else if (typeof loadMyBulkOrders === 'function' && pageId === 'orders') { // Processor bulk orders page
            loadMyBulkOrders();
        } else if (typeof loadProcessorProfile === 'function' && pageId === 'profile') { // Processor profile page
            loadProcessorProfile();
        }

    } else {
        console.warn("Could not find active page to re-render dynamic content.");
    }
  
  } else {
    console.error(`Language ${lang} not supported.`);
  }
}

// Initialize i18n on page load
function initializeI18n() {
     console.log("i18n.js: Initializing...");
    const initialLang = localStorage.getItem('milletLang') || 'en';
    
    // Set initial active state for language switcher
    const switcher = document.querySelector('.language-switcher');
    if (switcher) {
        switcher.querySelectorAll('button').forEach(button => {
            button.classList.toggle('active', button.dataset.lang === initialLang);
        });
    } else {
        // If there's no switcher, still set the language internally
        currentLang = initialLang; 
    }
    
    // Apply translations once DOM is ready
    applyTranslations(document.body);
    console.log("i18n.js: Initial translations applied for language:", initialLang);
}

// Ensure initialization runs after DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeI18n);
} else {
    // DOMContentLoaded has already fired
    initializeI18n();
}

// Expose functions globally if needed (useful for inline onclick handlers)
window.t = t;
window.setLanguage = setLanguage;
window.applyTranslations = applyTranslations;

// --- [!! START: ADD/REPLACE THIS BLOCK AT THE END of i18n.js !!] ---

// Function to trigger page-specific data loading AFTER i18n is ready
function triggerPageLoadIfReady() {
    // Check if the specific function for the trace page exists
    if (typeof loadTracePageData === 'function') {
        console.log("i18n.js: Triggering loadTracePageData()...");
        loadTracePageData(); // Call the function defined in trace.js
    }
    // Add 'else if' checks here for other page-specific load functions if needed
    // else if (typeof loadConsumerPageData === 'function') { loadConsumerPageData(); }
}

// Re-define initializeI18n to include the trigger call at the end
function initializeI18n() {
     console.log("i18n.js: Initializing...");
    const initialLang = localStorage.getItem('milletLang') || 'en';

    // Set initial active state for language switcher
    const switcher = document.querySelector('.language-switcher');
    if (switcher) {
        switcher.querySelectorAll('button').forEach(button => {
            button.classList.toggle('active', button.dataset.lang === initialLang);
        });
    }
    // Always set currentLang regardless of switcher presence
    currentLang = initialLang;

    // Apply translations to static content that's already in the DOM
    applyTranslations(document.body);
    console.log("i18n.js: Initial static translations applied for language:", initialLang);

    // Now trigger the page-specific function to load dynamic data
    triggerPageLoadIfReady(); // <-- This is the crucial addition
}

// Ensure initialization runs after DOM is loaded (Keep existing logic)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeI18n);
} else {
    // DOMContentLoaded has already fired
    initializeI18n();
}

// Expose functions globally (Keep existing)
window.t = t;
window.setLanguage = setLanguage;
window.applyTranslations = applyTranslations;

// --- [!! END: ADD/REPLACE THIS BLOCK AT THE END of i18n.js !!] ---