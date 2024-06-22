// Configuration for different job listing websites
if (typeof siteConfigurations === 'undefined') {
    console.log("Initializing site configurations...");
    var siteConfigurations = {
        "worldbankgroup.csod.com": {
            storageKey: 'worldBankJobIds',
            jobLinkSelector: 'a[href*="JobDetails.aspx?id="]',
            jobIdExtractor: link => new URLSearchParams(link.search).get('id'),
            hideMethod: (element) => element.closest('tr').style.display = 'none'
        },
        "jobs.undp.org": {
            storageKey: 'undpJobIds',
            jobLinkSelector: 'a.vacanciesTableLink',
            jobIdExtractor: link => {
                const regex = /job\/(\d+)$/;
                const match = link.href.match(regex);
                return match ? match[1] : null;
            },
            hideMethod: (element) => element.style.display = 'none'
        },
        "careers.rescue.org": {
            storageKey: 'ircJobIds',
            jobLinkSelector: 'a[data-ph-at-id="job-link"]', // Selector for job links with the specific data attribute
            jobIdExtractor: link => {
                const jobIdMatch = link.href.match(/\/req(\d+)/); // Look for the pattern '/req' followed by digits in the URL
                return jobIdMatch ? `req${jobIdMatch[1]}` : null; // Return the job ID with 'req' prefix
            },
            hideMethod: (element) => element.closest('.jobs-list-item').style.display = 'none' // Hide the entire job list item
        },
        "jobs.unicef.org": {
            storageKey: 'unicefJobIds',
            jobLinkSelector: '.list-view--item:not([style*="display: none"]) a.job-link', // Only select links within list items not styled as hidden
            jobIdExtractor: link => {
                const jobId = link.href.match(/\d{6,}/); // Look for the first sequence of at least 6 digits anywhere in the URL
                return jobId ? jobId[0] : null; // Return only the numeric part if found
            },
            hideMethod: (element) => element.closest('.list-view--item').style.display = 'none' // Hide the entire list view item
        },
        "my.bond.org.uk": {
            storageKey: 'bondJobIds',
            jobLinkSelector: 'div.acjb-job-item__title', // Selector for the job title div with a data-id attribute
            jobIdExtractor: element => element.getAttribute('data-id'), // Extracting the job ID from the data-id attribute
            hideMethod: (element) => element.closest('.acjb-job-list__item').style.display = 'none' // Hide the entire job list item
        },
        "tetratech.referrals.selectminds.com": {
            storageKey: 'tetraTechJobIds',
            jobLinkSelector: 'a.job_link.font_bold', // Selector for the job link
            jobIdExtractor: link => {
                const urlParts = link.href.split('-');
                return urlParts[urlParts.length - 1]; // Extract the numeric job ID from the last part of the URL
            },
            hideMethod: (element) => element.closest('.job_list_row').style.display = 'none' // Hide the entire job list row
        },
        "egpy.fa.us2.oraclecloud.com": {
            storageKey: 'abtJobIds',
            jobLinkSelector: 'li[data-qa="searchResultItem"] a.job-list-item__link', // Selector for the job link
            jobIdExtractor: link => {
                const jobId = link.getAttribute('aria-labelledby'); // Extract the job ID from 'aria-labelledby' attribute
                return jobId;
            },
            hideMethod: (element) => element.closest('li[data-qa="searchResultItem"]').style.display = 'none' // Hide the entire list item
        },
        "crownagents.com": {
            storageKey: 'crownAgentsJobIds',
            jobLinkSelector: 'a[data-lumesse-jl-jobid]', // Selector for job links with the specific data attribute
            jobIdExtractor: link => {
                return link.getAttribute('data-lumesse-jl-jobid'); // Extract job ID from the data attribute
            },
            hideMethod: (element) => element.closest('tr').style.display = 'none' // Hide the entire row
        },
        "recruit.iom.int": {
            storageKey: 'iomJobIds',
            jobLinkSelector: 'td.urCursorClickable a.lsLink',
            jobIdExtractor: link => {
                const text = link.querySelector('span.lsLink__text').textContent.trim();
                const jobIdMatch = text.match(/[A-Z]{2,3} \d{4} \d{1,4}/);
                return jobIdMatch ? jobIdMatch[0] : text;
            },
            hideMethod: (element) => element.closest('tr').style.display = 'none'
        },
        "fticonsult.referrals.selectminds.com": {
            storageKey: 'ftiConsultJobIds',
            jobLinkSelector: 'a.job_link.font_bold',
            jobIdExtractor: link => {
                const urlParts = link.href.split('-');
                const jobId = urlParts[urlParts.length - 1];
                console.log(`Extracted job ID: ${jobId}`);
                return jobId;
            },
            hideMethod: (element) => element.closest('.job_list_row').style.display = 'none'
        },
        "jobs.giz.de": {
            storageKey: 'gizJobIds',
            jobLinkSelector: '[data-jobad-container]',
            jobIdExtractor: element => element.getAttribute('data-jobad-id'),
            hideMethod: (element) => element.closest('tr').style.display = 'none'
        },
        "weforum.wd3.myworkdayjobs.com": {
            storageKey: 'weforumJobIds',
            jobLinkSelector: '.css-b3pn3b h3 a[data-automation-id="jobTitle"]',
            jobIdExtractor: (link) => {
                const urlParts = link.href.split('/');
                // Assuming the job ID is at the end of the URL or has a specific pattern
                const jobIdPart = urlParts[urlParts.length - 1];
                return jobIdPart.split(' ')[0]; // This takes the first part before any space, assuming job ID ends before a space.
            },
            hideMethod: (element) => element.closest('li').style.display = 'none'
        },
        "thepalladiumgroup.com": {
            storageKey: 'palladiumJobIds',
            jobLinkSelector: 'div.heading-joblist a[target="_blank"]',
            jobIdExtractor: link => {
                const urlParams = new URL(link.href);
                return urlParams.pathname.split('/').pop();
            },
            hideMethod: (element) => element.closest('div.heading-joblist').style.display = 'none'
        },
        "helvetas.org": {
            storageKey: 'helvetasJobIds',
            jobLinkSelector: '.listteaser--job h3.listteaser__hl a',
            jobIdExtractor: link => {
                const urlParts = link.href.split('_');
                return urlParts[urlParts.length - 1].replace(/[^0-9]/g, ''); // Extracting numeric part of the job ID from the URL
            },
            hideMethod: (element) => element.closest('.listteaser--job').style.display = 'none'
        },
        "jobs.fao.org": {
            storageKey: 'faoJobIds',
            jobLinkSelector: 'li[id^="job"] a[href*="jobdetail.ftl?job="]',
            jobIdExtractor: (link) => {
                const urlParams = new URLSearchParams(new URL(link.href, document.baseURI).search);
                return urlParams.get('job');
            },
            hideMethod: (element) => element.closest('li').style.display = 'none'
        },
        "careers.ey.com": {
            storageKey: 'eyJobIds',
            jobLinkSelector: 'tr.data-row a.jobTitle-link',
            jobIdExtractor: link => {
                // Trim, split by '/', and filter out empty parts
                const urlParts = link.href.trim().split('/').filter(part => part !== '');
                // Take the last part of the URL as the job ID
                return urlParts[urlParts.length - 1];
            },
            hideMethod: (element) => element.closest('tr').style.display = 'none'
        },
        "jobs.ebrd.com": {
            storageKey: 'ebrdJobIds',
            jobLinkSelector: 'tr.data-row a.jobTitle-link',
            jobIdExtractor: link => {
                const urlParts = link.href.trim().split('/').filter(part => part !== '');
                return urlParts[urlParts.length - 1]; // Extracting the last part of the URL which is the job ID
            },
            hideMethod: (element) => element.closest('tr').style.display = 'none'
        },
        "wfp.org": {
            storageKey: 'wfpJobIds',
            jobLinkSelector: 'article.careers--item a.button-new',
            jobIdExtractor: link => {
                const urlParams = new URL(link.href);
                return urlParams.searchParams.get('career_job_req_id');
            },
            hideMethod: (element) => element.closest('article').style.display = 'none'
        },
        "careers.icrc.org": {
            storageKey: 'icrcJobIds',
            jobLinkSelector: '.tiletitle a.jobTitle-link',
            jobIdExtractor: link => {
                const urlParts = link.href.trim().split('/').filter(part => part !== '');
                return urlParts[urlParts.length - 1]; // Extracting the last part of the URL which seems to contain a job ID
            },
            hideMethod: (element) => element.closest('.job-tile-cell').style.display = 'none'
        },
        "vacancies.osce.org": {
            storageKey: 'osceJobIds',
            jobLinkSelector: 'a.job_link',
            jobIdExtractor: link => {
                const urlParts = link.href.split('/');
                return urlParts[urlParts.length - 1]; // Extracting the last part of the URL which seems to contain a job ID or descriptor
            },
            hideMethod: (element) => element.closest('.job_list_row').style.display = 'none'
        },
        "unhcr.wd3.myworkdayjobs.com": {
            storageKey: 'unhcrJobIds',
            jobLinkSelector: 'a[data-automation-id="jobTitle"]',
            jobIdExtractor: link => {
                // Assuming the job ID is part of the link's href attribute
                const urlParts = link.href.split('/');
                return urlParts[urlParts.length - 1]; // Extracts the last segment of the URL as the job ID
            },
            hideMethod: (element) => element.closest('li').style.display = 'none'
        },
        "ilo.org": {
            storageKey: 'iloJobIds',
            jobLinkSelector: 'tr.data-row a.jobTitle-link',
            jobIdExtractor: link => {
                const jobFacilitySpan = link.closest('tr').querySelector('span.jobFacility');
                return jobFacilitySpan ? jobFacilitySpan.textContent.trim() : null;
            },
            hideMethod: (element) => element.closest('tr').style.display = 'none'
        },
            "netimpact.org": {
                storageKey: 'netImpactJobIds',
                jobLinkSelector: 'h3 a[href^="/jobs/"]', // Selector for the job link within an <h3> tag
                jobIdExtractor: link => {
                    const urlParts = link.href.split('/'); // Splitting the URL into parts
                    return urlParts[urlParts.length - 1]; // Returning the last part of the path as the job ID
                },
                hideMethod: (element) => element.closest('.views-row').style.display = 'none' // Hide the entire views row
            },
        "phf.tbe.taleo.net": {
            storageKey: 'daiJobIds',
            jobLinkSelector: 'div.oracletaleocwsv2-accordion-head-info a.viewJobLink', // Selector for the job link
            jobIdExtractor: link => {
                const urlParams = new URL(link.href);
                return urlParams.searchParams.get('rid'); // Extract the 'rid' parameter from the URL
            },
            hideMethod: (element) => element.closest('div.oracletaleocwsv2-accordion-block').style.display = 'none' // Hide the entire job listing
        },
        "unjobs.org": {
            storageKey: 'unjobsJobIds',
            jobLinkSelector: 'div.job a.jtitle',
            jobIdExtractor: link => {
                const urlParts = link.href.split('/');
                return urlParts[urlParts.length - 1];
            },
            hideMethod: (element) => element.closest('div.job').style.display = 'none'
        }
    };
} else {
    console.log("siteConfigurations already defined.");
}

// Listener for messages from the popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(`Received message: ${request.action}`);
    if (request.action === "saveJobs") {
        saveJobs();
    } else if (request.action === "hideSeenJobs") {
        hideSeenJobs();
    }
});

// Function to retrieve the appropriate configuration based on the current site
function getConfig() {
    const host = window.location.host;
    console.log(`Getting configuration for host: ${host}`);
    const hostParts = host.split('.').reverse(); // Reversing to start comparison from TLD
    for (const domain in siteConfigurations) {
        const domainParts = domain.split('.').reverse();
        if (hostParts.length >= domainParts.length &&
            hostParts.slice(0, domainParts.length).every((part, index) => part === domainParts[index])) {
            console.log(`Configuration found for ${domain}`);
            return siteConfigurations[domain];
        }
    }
    console.log("No configuration found for the current site.");
    return null;
}

// Function to save job IDs based on the current website
function saveJobs() {
    const config = getConfig();
    if (!config) {
        console.log("Site not supported for saving jobs.");
        return; // Exit if site is not supported
    }

    const { storageKey, jobLinkSelector, jobIdExtractor } = config;
    const jobLinks = Array.from(document.querySelectorAll(jobLinkSelector));
    const newJobIds = jobLinks.map(jobIdExtractor).filter(id => id !== null); // Filter out null IDs
    console.log(`Valid job IDs: ${newJobIds}`);

    if (newJobIds.length > 0) {
        chrome.storage.local.get(storageKey, function(data) {
            let seenJobIds = data[storageKey] || [];
            let updatedJobIds = [...new Set([...seenJobIds, ...newJobIds])];
            let storageObject = {};
            storageObject[storageKey] = updatedJobIds;
            chrome.storage.local.set(storageObject, () => {
                console.log(`Updated list of job IDs saved for ${storageKey}:`, updatedJobIds);
            });
        });
    } else {
        console.log("No valid job IDs to save.");
    }
}
// Function to hide seen jobs based on the current website
function hideSeenJobs() {
    const config = getConfig();
    if (!config) {
        console.log("Site not supported for hiding jobs.");
        return; // Exit if site is not supported
    }

    const { storageKey, jobLinkSelector, hideMethod } = config;
    chrome.storage.local.get(storageKey, function(data) {
        if (data[storageKey]) {
            const seenIds = new Set(data[storageKey]);
            document.querySelectorAll(jobLinkSelector).forEach(link => {
                const jobId = config.jobIdExtractor(link);
                if (seenIds.has(jobId)) {
                    hideMethod(link); // Apply the specific hide method
                    console.log(`Hiding job ID: ${jobId}`);
                }
            });
            console.log('Seen jobs are hidden.');
        } else {
            console.log("No job IDs found in storage to hide.");
        }
    });
}
