document.addEventListener('DOMContentLoaded', function() {
    const availableJsonFiles = ['data.json', 'itemtable.json', 'recipetable.json', 'spawntable.json'];
    const addTabBtn = document.getElementById('addTabBtn');
    const jsonFileSelector = document.getElementById('jsonFileSelector');
    const tabBar = document.getElementById('tabBar');
    const tabContentArea = document.getElementById('tabContentArea');
    const deleteTabBtn = document.getElementById('deleteTabBtn');

    if (jsonFileSelector) {
        jsonFileSelector.style.display = 'none';
    }

    let activeTabButton = null;
    let activeTabContent = null;
    let openTabs = {};

    function createTableFromData(data, targetDiv) {
        // ... (implementation)
        if (!data) {
            targetDiv.innerHTML = '<p>Error loading data or data is null.</p>';
            return;
        }
        if (Object.keys(data).length === 0 && data.constructor === Object || (Array.isArray(data) && data.length === 0) ) {
             targetDiv.innerHTML = '<p>No data to display or data is empty.</p>';
             return;
        }
        const table = document.createElement('table');
        const thead = table.createTHead();
        const tbody = table.createTBody();
        const headerRow = thead.insertRow();
        const firstItem = Array.isArray(data) ? data[0] : data;
        if (!firstItem || (typeof firstItem === 'object' && Object.keys(firstItem).length === 0)) {
             targetDiv.innerHTML = '<p>Data format incorrect, empty, or no headers found.</p>';
             return;
        }
        const headers = Object.keys(firstItem);
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        const dataArray = Array.isArray(data) ? data : [data];
        dataArray.forEach(obj => {
            const row = tbody.insertRow();
            headers.forEach(header => {
                const cell = row.insertCell();
                const value = obj[header];
                cell.textContent = value !== null && value !== undefined ? (typeof value === 'object' ? JSON.stringify(value) : value) : '';
            });
        });
        targetDiv.innerHTML = '';
        targetDiv.appendChild(table);
    }

    async function loadJsonData(filePath) {
        // ... (implementation)
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error fetching or parsing ${filePath}:`, error);
            return null;
        }
    }

    function switchToTab(tabButtonToActivate, contentDivToActivate) {
        // ... (implementation)
        if (activeTabButton) {
            activeTabButton.classList.remove('active');
        }
        if (activeTabContent) {
            activeTabContent.style.display = 'none';
        }
        if (tabButtonToActivate && contentDivToActivate) {
            tabButtonToActivate.classList.add('active');
            contentDivToActivate.style.display = 'block';
            activeTabButton = tabButtonToActivate;
            activeTabContent = contentDivToActivate;
        } else {
            activeTabButton = null;
            activeTabContent = null;
            if (tabContentArea) tabContentArea.innerHTML = '<p>No tab selected or tab does not exist.</p>';
        }
    }

    // --- Refactored function for opening a new tab ---
    async function openNewTab(selectedFile) {
        if (openTabs[selectedFile]) {
            switchToTab(openTabs[selectedFile].button, openTabs[selectedFile].contentDiv);
            if (jsonFileSelector) jsonFileSelector.style.display = 'none'; // Ensure selector is hidden
            return;
        }

        const newTabButton = document.createElement('button');
        newTabButton.textContent = selectedFile;
        newTabButton.className = 'tab-button';
        newTabButton.setAttribute('data-tabid', selectedFile);

        newTabButton.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tabid');
            if (openTabs[tabId]) {
                switchToTab(openTabs[tabId].button, openTabs[tabId].contentDiv);
            }
        });

        if (tabBar) tabBar.appendChild(newTabButton);

        const newTabContentDiv = document.createElement('div');
        newTabContentDiv.className = 'tab-content';
        newTabContentDiv.style.display = 'none'; // Initially hidden
        newTabContentDiv.setAttribute('data-contentid', selectedFile);
        if (tabContentArea) tabContentArea.appendChild(newTabContentDiv);

        openTabs[selectedFile] = { button: newTabButton, contentDiv: newTabContentDiv };

        newTabContentDiv.innerHTML = '<p>Loading...</p>';
        switchToTab(newTabButton, newTabContentDiv);

        const jsonData = await loadJsonData(selectedFile);
        if (jsonData) {
            createTableFromData(jsonData, newTabContentDiv);
        } else {
            newTabContentDiv.innerHTML = `<p>Error loading data for ${selectedFile}. Check console for details.</p>`;
        }

        if (jsonFileSelector) jsonFileSelector.style.display = 'none'; // Ensure selector is hidden
    }
    // --- End of refactored function ---

    if (addTabBtn && jsonFileSelector) {
        addTabBtn.addEventListener('click', function() {
            jsonFileSelector.innerHTML = '';
            availableJsonFiles.forEach(fileName => {
                const fileButton = document.createElement('button');
                fileButton.textContent = fileName;
                fileButton.setAttribute('data-filename', fileName);

                // Use the refactored function
                fileButton.addEventListener('click', function() {
                    const selectedFile = this.getAttribute('data-filename');
                    openNewTab(selectedFile);
                });

                jsonFileSelector.appendChild(fileButton);
            });

            const isHidden = jsonFileSelector.style.display === 'none';
            jsonFileSelector.style.display = isHidden ? 'block' : 'none';
        });
    }

    if (deleteTabBtn) {
        deleteTabBtn.addEventListener('click', function() {
            // ... (implementation from Phase 5)
            if (!activeTabButton || !activeTabContent) {
                console.log('No active tab to delete.');
                return;
            }
            const tabIdToDelete = activeTabButton.getAttribute('data-tabid');
            if (activeTabButton.parentElement) activeTabButton.parentElement.removeChild(activeTabButton);
            if (activeTabContent.parentElement) activeTabContent.parentElement.removeChild(activeTabContent);
            delete openTabs[tabIdToDelete];
            activeTabButton = null;
            activeTabContent = null;
            const remainingTabIds = Object.keys(openTabs);
            if (remainingTabIds.length > 0) {
                const nextTabId = remainingTabIds[0];
                switchToTab(openTabs[nextTabId].button, openTabs[nextTabId].contentDiv);
            } else {
                if (tabContentArea) tabContentArea.innerHTML = '<p>All tabs closed. Click "+" to open a new view.</p>';
            }
        });
    }

    // --- Initial Load Logic ---
    if (availableJsonFiles.length > 0) {
        // Load the first file in the list, e.g., 'data.json' if it's first and available
        const defaultFileToLoad = availableJsonFiles.includes('data.json') ? 'data.json' : availableJsonFiles[0];
        if (defaultFileToLoad) {
            openNewTab(defaultFileToLoad);
        }
    } else {
        if (tabContentArea) {
            tabContentArea.innerHTML = "<p>No JSON files configured for display. Click '+' to attempt to load manually if any are added.</p>";
        }
    }
    // --- End of Initial Load Logic ---

}); // End of DOMContentLoaded
