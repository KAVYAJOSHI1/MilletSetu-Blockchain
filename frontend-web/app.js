document.addEventListener('DOMContentLoaded', () => {
    console.log("app.js: DOM Loaded. Initializing connections...");

    const SUPABASE_URL = 'https://abpfxatedriemsxwboii.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFicGZ4YXRlZHJpZW1zeHdib2lpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyNzU0MjcsImV4cCI6MjA3Njg1MTQyN30.CGbqpq2bLJrN3lgx6K2KDcKz5-KmOXSB2brzrRZCzUI';

    window.db = null;
    window.provider = null;
    window.signer = null;

    console.log("app.js: Script started.");

    if (!SUPABASE_URL || SUPABASE_URL.includes('YOUR_COPIED_SUPABASE_URL') || !SUPABASE_KEY || SUPABASE_KEY.includes('YOUR_COPIED_SUPABASE_KEY')) {
        console.error("app.js: CRITICAL - Update app.js with your actual Supabase URL and Key!");
    } else {
        console.log("app.js: Supabase URL and Key seem valid.");
        try {
            if (typeof supabase !== 'undefined' && typeof supabase.createClient === 'function') {
                console.log("app.js: Supabase library loaded. Initializing client...");
                window.db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

                if (window.db) {
                    console.log("app.js: Supabase client initialized successfully and assigned to window.db.");
                } else {
                    console.error("app.js: supabase.createClient() did not return a client object but also didn't throw an error!");
                }
            } else {
                console.error("app.js: Supabase library (supabase object or createClient method) is not defined. Check script tag order/loading in HTML.");
            }
        } catch (error) {
            console.error("app.js: Error during supabase.createClient():", error);
        }
    }

    console.log("app.js: Checking for Ethers and MetaMask...");
    if (typeof window.ethereum !== 'undefined' && typeof ethers !== 'undefined' && typeof ethers.providers !== 'undefined' && typeof ethers.providers.Web3Provider === 'function') {
        try {
            console.log("app.js: Ethers library and MetaMask detected. Initializing provider...");
            window.provider = new ethers.providers.Web3Provider(window.ethereum);
            console.log("app.js: Ethers provider initialized successfully.");
        } catch (error) {
            console.error("app.js: Error initializing Ethers provider:", error);
        }
    } else {
        if (typeof ethers === 'undefined' || typeof ethers.providers === 'undefined') {
            console.warn("app.js: Ethers.js library not loaded or incomplete. Check script tag in HTML.");
        }
        if (typeof window.ethereum === 'undefined') {
            console.warn("app.js: MetaMask (window.ethereum) not detected. Blockchain features require MetaMask extension.");
        }
    }

    console.log("app.js: MilletChain App Setup Script Finished.");
    console.log("app.js: Final check - window.db available:", window.db ? 'Yes' : 'No');
    console.log("app.js: Final check - window.provider available:", window.provider ? 'Yes' : 'No');

});