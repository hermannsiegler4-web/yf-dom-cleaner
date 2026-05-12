// ==UserScript==
// @name         Yahoo Finance Dom Cleaner
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Removes unwanted elements (e.g. ads, banners) from Yahoo Finance by ID, including dynamically injected ones
// @author       Hermann Siegler
// @match        https://finance.yahoo.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    // -------------------------------------------------------------------------
    //
    // List of element IDs to remove from the page.
    //
    // Add or remove IDs here as needed.
    //
    // -------------------------------------------------------------------------
    //
    const ELEMENT_IDS_TO_REMOVE = ['sda-E2E', 'sda-DCKTOP'];
    // -------------------------------------------------------------------------
    //
    // removeElements()
    //
    // Iterates over ELEMENT_IDS_TO_REMOVE, queries each ID in the DOM,
    //
    // and removes the element if it exists.
    //
    // -------------------------------------------------------------------------
    //
    function removeElements() {
        ELEMENT_IDS_TO_REMOVE.forEach(function (id) {
            const element = document.getElementById(id);
            if (element) {
                element.remove();
                console.log(`[Yahoo Finance Cleaner] Removed element with ID: #${id}`);
            }
        });
    }
    // -------------------------------------------------------------------------
    //
    // setupMutationObserver()
    //
    // Attaches a MutationObserver to document.body so that any dynamically
    //
    // injected elements matching our ID list are also removed after insertion.
    // -------------------------------------------------------------------------
    //
    function setupMutationObserver() {
        const observer = new MutationObserver(function (mutations) {
            // We don't need to inspect individual mutations — simply attempt
            //
            // to remove target elements whenever the DOM changes.
            //
            removeElements();
        });
        // Observe the entire body for added/removed child nodes at all depths.
        //
        observer.observe(document.body, {
            childList: true,   // Watch for added/removed direct children
            subtree: true      // Also watch all descendant nodes
        });
        console.log('[Yahoo Finance Cleaner] MutationObserver is active.');
    }

    // -------------------------------------------------------------------------
    //
    // init()
    // Entry point: performs an initial cleanup pass, then sets up the observer
    // to handle elements injected after the initial page load.
    //
    // -------------------------------------------------------------------------
    function init() {

        console.log('[Yahoo Finance Cleaner] Initializing...');
        // First pass: remove any elements already present in the DOM.
        removeElements();
        // Second: watch for future DOM mutations (e.g. lazy-loaded ads).

        setupMutationObserver();
    }
    // -------------------------------------------------------------------------
    // Bootstrap
    //
    // Wait for DOMContentLoaded before running so that document.body exists.
    //
    // If the document is already interactive/complete, run immediately.
    // -------------------------------------------------------------------------
    if (document.readyState === 'loading') {
        // DOM not yet ready — wait for the event.
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM is already ready (script injected late) — run straight away.
        init();
    }
})();