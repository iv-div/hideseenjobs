// popup.js

// Handle the click event for the save jobs button
document.getElementById('saveButton').addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.runtime.sendMessage({action: "saveJobs"});
    });
});

// Handle the click event for the hide seen jobs button
document.getElementById('hideButton').addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.runtime.sendMessage({action: "hideSeenJobs"});
    });
});

// These functions should be defined in the content script, not injected from popup
// They are here just to send a message to the content script.
function saveJobs() {
    chrome.runtime.sendMessage({action: "saveJobs"});
}

function hideSeenJobs() {
    chrome.runtime.sendMessage({action: "hideSeenJobs"});
}
