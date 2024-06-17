chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "saveJobs" || request.action === "hideSeenJobs") {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            chrome.scripting.executeScript({
                target: {tabId: tabs[0].id},
                files: ['content.js']
            }, () => {
                chrome.tabs.sendMessage(tabs[0].id, request);
            });
        });
    }
});
