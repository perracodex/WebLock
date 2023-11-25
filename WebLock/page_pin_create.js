/*
 * Copyright (c) 2023 Perraco Labs. All rights reserved.
 * This work is licensed under the terms of the MIT license.
 * For a copy, see <https://opensource.org/licenses/MIT>
 */

"use strict";

import { cipher } from '/cipher.js';

const widgetPinFirst = document.getElementById("widget-pin-first");
const widgetPinSecond = document.getElementById("widget-pin-second");
const widgetPinCancel = document.getElementById("widget-pin-cancel");
const widgePinSave = document.getElementById("widget-pin-save");

widgetPinCancel.addEventListener("click", (event) => {
    window.location = "page_options.html"
});

widgePinSave.addEventListener("click", (event) => {
    const pinFirst = widgetPinFirst.value;
    const pinSecond = widgetPinSecond.value;

    if (pinFirst != pinSecond) {
        alert("The PINs do not match.");
        return;
    }

    const pin = cipher(pinFirst);

    chrome.storage.local.set({'setting_pin': pin}, function() {
        window.location = "page_options.html";
    });
});

window.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local.get(["setting_pin"], function(storageLocal) {
        const pin = (storageLocal.setting_pin == null || storageLocal.setting_pin.length == 0) ? "" : cipher(storageLocal.setting_pin);
        widgetPinFirst.value = pin;
        widgetPinSecond.value = pin;
    });
});