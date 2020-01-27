import './index.html';
import './index.less';

const { ensure, handleRejection } = util;

const log = function(val) { console.log(val); return val }; // Debug


const ws = new WebSocket('ws://localhost:49152/');

ws.onopen = function() { toastr.info(null, 'Websocket connection opened'); this.send('Hello from client') };
ws.onclose = evt => toastr.info(evt.reason, 'Websocket connection closed');
ws.onerror = err => toastr.error(err.message, 'Websocket error occurred');


const $messages = ensure.jqElement($('[js-messages]'));

ws.onmessage = function(evt) {
    $messages.append($('<div>', { class: 'messages__message', text: evt.data }));
    $messages.stop().animate({ scrollTop: $messages.prop('scrollHeight') }, 2000);
};


const $closeConnBtn = ensure.jqElement($('[js-close-conn-btn]'));

$closeConnBtn.on('click', () => ws.close(1000, 'Goodbye from client'));


setInterval(() => $messages.empty(), 60000);
