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

trustSiteButton = document.querySelector('#trust-current-site')

function trustSite(site, currTrusted) {
  console.log("Adding " + site + " to trusted sites");
  if (currTrusted === undefined){
    currTrusted = [site];
  } else {
    currTrusted.push(site);
  }
  chrome.storage.sync.set({trustedSites: currTrusted}, function() {
    trustSiteButton.innerText = "Trusted!";
  });
}

chrome.tabs.query({active:true,currentWindow:true},function(tab){
  currUrl = getBaseUrl(tab[0].url);
  chrome.storage.sync.get(['trustedSites'], function(result) {
    currTrusted = result.trustedSites
    if (!(currTrusted === undefined) && currTrusted.includes(currUrl)) {
      trustSiteButton.innerText = "Trusted!";
      trustSiteButton.style.backgroundColor="green"
    } else {
      trustSiteButton.addEventListener("click", () => trustSite(currUrl, currTrusted));
    }
  });
});
