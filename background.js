var mutedTabs = new Map() // tabs muted by the extension. tab id -> base url of tab 

function getBaseUrl(url){
  return url.split("/")[2]
}

chrome.tabs.onUpdated.addListener(function(command) {
  chrome.tabs.query({}, function (tabs) {
    console.log(mutedTabs.keys());
    for (var i = 0; i < tabs.length; i++) {
      var audible = tabs[i].audible
      var notMuted = tabs[i].mutedInfo;
    
      if (notMuted && audible){ 
        console.log("Muting tab: ".concat(tabs[i].title));
        chrome.tabs.update(tabs[i].id, {"muted": true});
        mutedTabs.set(tabs[i].id, getBaseUrl(tabs[i].url))
      } // muted tab has changed to new base url 
      else if (mutedTabs.has(tabs[i].id) && (mutedTabs.get(tabs[i].id) !== getBaseUrl(tabs[i].url))) { 
        if (audible) { 
          console.log("Muting tab: ".concat(tabs[i].title));
          mutedTabs.set(tabs[i].id, getBaseUrl(tabs[i].url))
        } else { // unmute and delete from map 
          console.log("unmuting tab: " + tabs[i].id);
          chrome.tabs.update(tabs[i].id, {"muted": false});
          console.log(mutedTabs.delete(tabs[i].id));
        }
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
