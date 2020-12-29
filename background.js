function getBaseUrl(url){
  return url.split("/")[2]
}

function updateBadge(){
  var badgeValue = mutedTabs.size.toString()
  chrome.browserAction.setBadgeText({text: (badgeValue > 0) ? badgeValue : ""});
}

var mutedTabs = new Map() // tabs muted by the extension. tab id -> base url of tab 

chrome.tabs.onUpdated.addListener(function(updatedTabId) {
  chrome.storage.sync.get(["trustedSites"], function(result) {
    chrome.tabs.get(updatedTabId, function (updatedTab) {
      
      // mute/unmute tabs as needed
      var trustedSites = result.trustedSites
      var audible = updatedTab.audible;
      var notMuted = updatedTab.mutedInfo;
    
      if (notMuted && audible && (trustedSites === undefined || !trustedSites.includes(getBaseUrl(updatedTab.url)))){ 
        console.log("Muting tab: ".concat(updatedTab.title));
        chrome.tabs.update(updatedTab.id, {"muted": true});
        mutedTabs.set(updatedTab.id, getBaseUrl(updatedTab.url));
      } // muted tab has changed to new base url  
      else if (mutedTabs.has(updatedTab.id) && (mutedTabs.get(updatedTab.id) !== getBaseUrl(updatedTab.url))) { 
        if (audible && (trustedSites === undefined || !trustedSites.includes(getBaseUrl(updatedTab.url)))) { 
          console.log("Muting tab: ".concat(updatedTab.title));
          mutedTabs.set(updatedTab.id, getBaseUrl(updatedTab.url));
        } else { // unmute and delete from map 
          console.log("Unmuting tab: " + updatedTab.id);
          chrome.tabs.update(updatedTab.id, {"muted": false});
          console.log(mutedTabs.delete(updatedTab.id));
        }
      }
      updateBadge()
    });
  });
});

chrome.tabs.onRemoved.addListener(function(tabid, removed) { // garbage collection for map 
  console.log(tabid + " closed");
  if (mutedTabs.delete(tabid)) {
    console.log("Deleted " + tabid + " from map");
    updateBadge()
  }
  else {
    console.log(tabid + " was not in map");
  }
});