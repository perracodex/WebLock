/*
 * Copyright (c) 2023 Perraco Labs. All rights reserved.
 * This work is licensed under the terms of the MIT license.
 * For a copy, see <https://opensource.org/licenses/MIT>
 */

window.addEventListener("load", () => {
    chrome.storage.local.get(["setting_pin"], function(storageLocal) {
        const setting_pin = storageLocal.setting_pin;
        const requirePin = (setting_pin != null) && (setting_pin.length > 0);

        // If the pin is configured then prompt for it before allowing to open the extension.
        if (requirePin) {
            window.location = "page_pin_prompt.html"
        }
        else {
            window.location = "page_options.html"
        }
    });
});
