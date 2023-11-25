/*
 * Copyright (c) 2023 Perraco Labs. All rights reserved.
 * This work is licensed under the terms of the MIT license.
 * For a copy, see <https://opensource.org/licenses/MIT>
 */

"use strict";

const widgetEnabledState = document.getElementById("widget-enabled-state");
const widgetPin = document.getElementById("widget-pin");
const widgetListSites = document.getElementById("widget-list-sites");

widgetListSites.placeholder = [
  "",
  "",
  "Site blocking example:",
  "instagram.com",
  "",
  "Subdomain blocking example:",
  "music.youtube.com",
  "",
  "Subdfolder blocking example:",
  "engadget.com/gaming",
  "",
  "Block a site but allow a subdomain:",
  "youtube.com",
  "!music.youtube.com",
  "",
  "Block a site but allow a subfolder:",
  "reddit.com",
  "!reddit.com/r/startrek",
].join("\n");


widgetEnabledState.addEventListener("change", (event) => {
  const setting_enabled_state = event.target.checked;
  
  chrome.storage.local.set({ setting_enabled_state }, function() {
    const piconPath = ((setting_enabled_state) ? "icon_on.png" : "icon_off.png");
    chrome.action.setIcon({ path : piconPath });
  });
});

widgetPin.addEventListener("click", (event) => {
  window.location = "page_pin_create.html"
});

widgetListSites.addEventListener("input", (event) => {
  const setting_list_sites = event.target.value.split("\n").map(s => s.trim()).filter(Boolean);
  chrome.storage.sync.set({ setting_list_sites });
});

window.addEventListener("DOMContentLoaded", () => {

  chrome.storage.local.get(["setting_enabled_state"], function(storageLocal) {

    widgetEnabledState.checked = storageLocal.setting_enabled_state;

    chrome.storage.sync.get(["setting_list_sites"], function (storageSync) {
    
      if (Array.isArray(storageSync.setting_list_sites)) {
        widgetListSites.value = storageSync.setting_list_sites.join("\r\n");
      }

      // Notify ready state
      document.body.classList.add("ready");
    });
  });

});

