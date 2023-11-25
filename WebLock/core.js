/*
 * Copyright (c) 2023 Perraco Labs. All rights reserved.
 * This work is licensed under the terms of the MIT license.
 * For a copy, see <https://opensource.org/licenses/MIT>
 */

"use strict";

const RULES = {
  ALLOW: 0,
  BLOCK: 1
};

const patternRemoveProtocol = (url) => url.replace(/^http(s?):\/\//, "");
const patternRemoveWww = (url) => url.replace(/^www\./, "");
const patternRemoveTrailingSlash = (url) => url.endsWith("/") ? url.slice(0, -1) : url;

// "https://www.youtube.com/" => "youtube.com"
// "https://www.youtube.com/feed/explore" => "youtube.com/feed/explore"
// "https://music.youtube.com/" => "music.youtube.com"
// "https://music.youtube.com/explore" => "music.youtube.com/explore"
const normalizeUrl = (url) => [url]
  .map(patternRemoveProtocol)
  .map(patternRemoveWww)
  .map(patternRemoveTrailingSlash)
  .pop();

// ["youtube.com", "!music.youtube.com"] => [{ path: "music.youtube.com", type: RULES.ALLOW }, { path: "youtube.com", type: RULES.BLOCK }]
// ["https://youtube.com/", "!https://music.youtube.com/"] => [{ path: "music.youtube.com", type: RULES.ALLOW }, { path: "youtube.com", type: RULES.BLOCK }]
const getAccessRules = (listSites) => {
  const sitesAllowed = listSites
    .filter((item) => item.startsWith("!"))
    .map((item) => normalizeUrl(item.substring(1)));

  const sitesBlocked = listSites
    .filter((item) => !item.startsWith("!"))
    .map(normalizeUrl);

  return [
    ...sitesAllowed.map((path) => ({ path, type: RULES.ALLOW })),
    ...sitesBlocked.map((path) => ({ path, type: RULES.BLOCK })),
  ].sort((a, b) => b.path.length - a.path.length); // Order the rules, so the longer the rule, the more specific.
};

/**
 * Handles whether the page is blocked or allowed.
 */
export function manageUrl(tabId, url) {
  chrome.storage.sync.get(["setting_list_sites"], function (storage) {
    const setting_list_sites = storage.setting_list_sites;
    
    if (Array.isArray(setting_list_sites) && setting_list_sites.length > 0) {
      const normalizedUrl = normalizeUrl(url);
      const accessRules = getAccessRules(setting_list_sites);
      const ruleMatch = accessRules.find((rule) => normalizedUrl.startsWith(rule.path) || normalizedUrl.endsWith(rule.path));
      
      if (ruleMatch && ruleMatch.type == RULES.BLOCK) {
        chrome.tabs.update(tabId, { url: `${chrome.runtime.getURL("page_error.html")}?url=${url}` });
      }
    }
  });
}
