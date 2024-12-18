const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

const port = new SerialPort('COM4', { baudRate: 9600 });  // Ganti COM3 sesuai port Arduino Anda
const parser = port.pipe(new Readline({ delimiter: '\r\n' }));

parser.on('data', (data) => {
    console.log('Data diterima:', data);  // Tampilkan data di konsol
});

port.on('error', (err) => {
    console.error('Error:', err.message);
});
