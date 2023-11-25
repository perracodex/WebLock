/*
 * Copyright (c) 2023 Perraco Labs. All rights reserved.
 * This work is licensed under the terms of the MIT license.
 * For a copy, see <https://opensource.org/licenses/MIT>
 */

chrome.storage.local.get(["setting_enabled_state"], function (storage) {
    const setting_enabled_state = ((typeof storage.setting_enabled_state == "boolean") && storage.setting_enabled_state);
    const requestedUrl = (new URLSearchParams(window.location.search)).get("url");

    if (setting_enabled_state)
        document.getElementById("url").textContent = requestedUrl;
    else {
        // If the lock is deactivated and the error page refreshed,
        // then redirecte back to the original URL.
        window.location = requestedUrl;
    }
});
