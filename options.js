trustedSitesElement = document.querySelector("#trusted-sites-list");
saveButtonElement = document.querySelector("#save-trusted-sites");
clearButtonElement = document.querySelector("#clear-trusted-sites");

function fillInitial() {
    chrome.storage.sync.get(['trustedSites'], function(result) {
        tempResult = "";
        numRows = 5;
        if (result["trustedSites"] !== undefined) {
            tempResult = result["trustedSites"]
            numRows = tempResult.length
        }
        trustedSitesStr = tempResult.toString().replace(/,/g, '\n');
        trustedSitesElement.value = trustedSitesStr;
        trustedSitesElement.rows = numRows.length;
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

function clearTrusted(){
    chrome.storage.sync.clear(() => {
        console.log("Cleared Trusted Sites");
        trustedSitesElement.value = "";
    });
    
}

fillInitial();
saveButtonElement.addEventListener("mouseup", saveTrusted);
clearButtonElement.addEventListener("mouseup", clearTrusted)