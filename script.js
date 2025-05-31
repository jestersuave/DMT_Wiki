document.addEventListener('DOMContentLoaded', function() {
    const jsonData = [
        {
            "ID": 1,
            "Name": "Alice",
            "Age": 30,
            "City": "New York"
        },
        {
            "ID": 2,
            "Name": "Bob",
            "Age": 24,
            "City": "Paris"
        },
        {
            "ID": 3,
            "Name": "Charlie",
            "Age": 35,
            "City": "London"
        },
        {
            "ID": 4,
            "Name": "Diana",
            "Age": 28,
            "City": "Berlin"
        }
    ];

    const table = document.getElementById('jsonTable');
    const thead = table.querySelector('thead tr');
    const tbody = table.querySelector('tbody');

    // Clear existing headers and rows
    thead.innerHTML = '';
    tbody.innerHTML = '';

    if (jsonData.length > 0) {
        // Create table headers
        const headers = Object.keys(jsonData[0]);
        headers.forEach(headerText => {
            const header = document.createElement('th');
            header.textContent = headerText;
            thead.appendChild(header);
        });

        // Create table rows
        jsonData.forEach(obj => {
            const row = tbody.insertRow();
            headers.forEach(header => {
                const cell = row.insertCell();
                cell.textContent = obj[header];
            });
        });
    } else {
        tbody.innerHTML = '<tr><td colspan="100%" style="text-align:center;">No data available.</td></tr>';
    }
});
