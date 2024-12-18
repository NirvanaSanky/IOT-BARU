const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });  // Server di port 8080

const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const port = new SerialPort('COM4', { baudRate: 9600 });
const parser = port.pipe(new Readline({ delimiter: '\r\n' }));

parser.on('data', (data) => {
    console.log('Data diterima:', data);
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);  // Kirim data ke web
        }
    });
});

wss.on('connection', (ws) => {
    console.log('Client terhubung');
});
