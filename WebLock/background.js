/*
 * Copyright (c) 2023 Perraco Labs. All rights reserved.
 * This work is licensed under the terms of the MIT license.
 * For a copy, see <https://opensource.org/licenses/MIT>
 */

"use strict";

// Importing the manageUrl function from core.js
import { manageUrl } from '/core.js';

/**
 * Executes the necessary actions for a given tab and URL.
 * It checks if the URL starts with "http" (which includes "https" URLs as well) and 
 * if the extension's setting is enabled. If both conditions are met, it proceeds to 
 * manage the URL.
 *
 * @param {number} tabId - The ID of the tab where the URL is loaded.
 * @param {string} url - The URL to be processed.
 */
function execute(tabId, url) {
  if (url && url.startsWith("http")) {
    chrome.storage.local.get(["setting_enabled_state"], (storage) => {
      if (storage.setting_enabled_state === true) {
        manageUrl(tabId, url);
      }
    });
  }
}

/**
 * Sets the extension icon based on the enabled state setting.
 * Chooses between 'icon_on.png' and 'icon_off.png'.
 */
function setIconBasedOnSetting() {
  chrome.storage.local.get(["setting_enabled_state"], (storage) => {
    const iconPath = storage.setting_enabled_state ? "icon_on.png" : "icon_off.png";
    chrome.action.setIcon({ path: iconPath });
  });
}

// Listener for when a navigation event is committed in a tab.
chrome.webNavigation.onCommitted.addListener((details) => {
  execute(details.tabId, details.url); 
});

// Listener for tab updates to handle URL changes.
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  const url = changeInfo.pendingUrl || changeInfo.url;
  execute(tabId, url);
});

// Listener for the extension's installation event.
chrome.runtime.onInstalled.addListener(() => {
  // Sets the default state of the extension and initializes the list of sites.
  chrome.storage.local.get(["setting_enabled_state"], (storage) => {
    const setting_enabled_state = !!storage.setting_enabled_state;
    chrome.storage.sync.set({ setting_enabled_state });
    setIconBasedOnSetting();
  });

  // Initializes the list of sites if it's not already set.
  chrome.storage.sync.get(["setting_list_sites"], (storage) => {
    if (!Array.isArray(storage.setting_list_sites)) {
      chrome.storage.sync.set({ setting_list_sites: [] });
    }
  });
});
