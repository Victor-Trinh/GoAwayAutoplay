function getBaseUrl(url){
  return url.split("/")[2]
}

document.querySelector('#go-to-options').addEventListener("click", function() {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('options.html'));
  }
});

document.querySelector('#whitelist-current').addEventListener("click", function() {
  chrome.tabs.query({active:true,currentWindow:true},function(tab){
    currUrl = getBaseUrl(tab[0].url);
    chrome.storage.sync.get(['trustedSites'], function(result) {
      currTrusted = result.trustedSites
      if (currTrusted === undefined) {
        currTrusted = [currUrl]
      } 
      else {
        if (currTrusted.includes(currUrl)) return false
        currTrusted.push(currUrl)
      }
      alert('Current trusted sites are: ' + currTrusted);

      chrome.storage.sync.set({trustedSites: currTrusted}, function() {
        console.log("Sucessfully set trusted sites.");
      });
    });
  });
});