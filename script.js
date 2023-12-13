function isValidInput(value) {
    return value && !isNaN(value) && Number(value) >= 0;
}

function isValidHost(value) {
    return value.trim() !== '';
}

function scanPorts() {
    const host = document.getElementById('host').value;
    const startPort = document.getElementById('startPort').value;
    const endPort = document.getElementById('endPort').value;
    if (!isValidHost(host)) {
        window.alert('Please enter a valid host.');
        return;
    }

    if (!isValidInput(startPort) || !isValidInput(endPort)) {
        window.alert('Please enter valid start and end ports.');
        return;
    }
    const data = {
        host: host,
        startPort: startPort,
        endPort: endPort
    };

    fetch('http://localhost:3000/scan-ports', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(result => {
        const openPorts = result.openPorts;

        // Render a box with open ports
        renderOpenPortsBox(openPorts);
    })
    .catch(error => {
        console.error('Error:', error);
        window.alert('An error occurred. Please try again.');
    });
}

function renderOpenPortsBox(openPorts) {
    const box = document.createElement('div');
    box.className = 'open-ports-box';

    const title = document.createElement('h2');
    title.textContent = 'Open Ports List';
    box.appendChild(title);

    const list = document.createElement('ul');
    list.className = 'open-ports-list';

    openPorts.forEach(port => {
        const listItem = document.createElement('li');
        listItem.className = 'open-port';
        listItem.textContent = `Open Port: ${port}`;
        list.appendChild(listItem);
    });

    box.appendChild(list);

    const cancelButton = document.createElement('button');
    cancelButton.className = 'cancel-button';
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', () => {
        document.body.removeChild(box);
    });

    box.appendChild(cancelButton);

    document.body.appendChild(box);
}

document.querySelector("#scanning").addEventListener("click", scanPorts);