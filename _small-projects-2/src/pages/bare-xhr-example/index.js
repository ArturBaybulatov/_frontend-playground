import './index.html';


const xhr = new XMLHttpRequest();

xhr.addEventListener('load', function() {
    console.log('OK');
});

xhr.addEventListener('error', function() { console.warn("Couldn't get a resource") });

xhr.open('GET', 'http://images.wbstatic.net/brands/small/new/362.jpg');
//xhr.open('GET', 'https://images.wbstatic.net/brands/logo/rimmel.png');

//xhr.responseType = 'blob'; // "arraybuffer", "blob", "document", "json", and "text"
    
//xhr.setRequestHeader('Content-Type', 'image/jpeg'); // Trigger "OPTIONS" request by setting a "custom" header

xhr.send();
