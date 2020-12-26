var mutedTabs = new Map() // tabs muted by the extension. tab id -> base url of tab 

function getBaseUrl(url){
  return url.split("/")[2]
}

chrome.tabs.onUpdated.addListener(function(updatedTabId) {
  chrome.tabs.get(updatedTabId, function (updatedTab) {
    console.log(mutedTabs.keys());
    console.log(updatedTab);
    var audible = updatedTab.audible;
    var notMuted = updatedTab.mutedInfo;
  
    if (notMuted && audible){ 
      console.log("Muting tab: ".concat(updatedTab.title));
      chrome.tabs.update(updatedTab.id, {"muted": true});
      mutedTabs.set(updatedTab.id, getBaseUrl(updatedTab.url));
    } // muted tab has changed to new base url  
    else if (mutedTabs.has(updatedTab.id) && (mutedTabs.get(updatedTab.id) !== getBaseUrl(updatedTab.url))) { 
      if (audible) { 
        console.log("Muting tab: ".concat(updatedTab.title));
        mutedTabs.set(updatedTab.id, getBaseUrl(updatedTab.url));
      } else { // unmute and delete from map 
        console.log("unmuting tab: " + updatedTab.id);
        chrome.tabs.update(updatedTab.id, {"muted": false});
        console.log(mutedTabs.delete(updatedTab.id));
      }
      
    }
  });
});

chrome.tabs.onRemoved.addListener(function(tabid, removed) { // garbage collection for map 
  console.log(tabid + " closed");
  if (mutedTabs.delete(tabid)) {
    console.log("Deleted " + tabid + " from map");
  }
  else {
    console.log(tabid + " was not in map");
  }
});
