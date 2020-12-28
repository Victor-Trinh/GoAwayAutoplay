trustedSitesElement = document.querySelector("#trusted-sites-list");
saveButtonElement = document.querySelector("#save-trusted-sites");

function fillInitial() {
    chrome.storage.sync.get(['trustedSites'], function(result) {
        trustedSitesStr = result["trustedSites"].toString().replace(/,/g, '\n');
        trustedSitesElement.value = trustedSitesStr;
        trustedSitesElement.rows = result["trustedSites"].length;
    });
}

function saveTrusted(){
    newTrustedSites = trustedSitesElement.value.split("\n");
    chrome.storage.sync.set({trustedSites: newTrustedSites}, function() {
        console.log("Sucessfully set trusted sites.");
      });


    chrome.storage.sync.get(['trustedSites'], function(result) {
        console.log(result);
    });
}

fillInitial();
saveButtonElement.addEventListener("click", saveTrusted);