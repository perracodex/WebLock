/*
 * Copyright (c) 2023 Perraco Labs. All rights reserved.
 * This work is licensed under the terms of the MIT license.
 * For a copy, see <https://opensource.org/licenses/MIT>
 */

"use strict";

import { cipher } from '/cipher.js';

const widgetPin = document.getElementById("widget-pin");
const widgeOk = document.getElementById("widget-ok");
const widgetCancel = document.getElementById("widget-cancel");

/**
 * Prompt the user for the pin before allowing to open the options page.
 */
widgeOk.addEventListener("click", (event) => {
    const pin = cipher(widgetPin.value);
    
    chrome.storage.local.get(["setting_pin"], function(storageLocal) {
        if (storageLocal.setting_pin == pin) {
            window.location = "page_options.html"
        }
        else {
            window.location = "page_pin_error.html"
        }
    });
});

widgetCancel.addEventListener("click", (event) => {
    window.close();
});

