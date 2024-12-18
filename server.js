const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const mqtt = require('mqtt');

// Konfigurasi SerialPort
const serialPath = 'COM4'; // Ganti dengan port serial Arduino Anda
const baudRate = 9600;
const port = new SerialPort(serialPath, { baudRate });

const parser = new ReadlineParser({ delimiter: '\r\n' });
port.pipe(parser);

// Konfigurasi MQTT
const brokerUrl = 'mqtt://broker.hivemq.com'; // Ganti dengan URL broker Anda
const topic = 'arduino/data'; // Ganti dengan topik yang sesuai
const client = mqtt.connect(brokerUrl);

client.on('connect', () => {
  console.log('Terhubung ke broker MQTT:', brokerUrl);

  // Membaca data dari Serial dan mempublikasikan ke broker MQTT
  parser.on('data', (data) => {
    console.log('Data dari Arduino:', data);

    // Publish data ke broker MQTT
    client.publish(topic, data, { qos: 1 }, (err) => {
      if (err) {
        console.error('Gagal mempublikasikan data:', err.message);
      } else {
        console.log(`Data berhasil dipublikasikan ke topik: ${topic}`);
      }
    });
  });
});

client.on('error', (err) => {
  console.error('Error pada MQTT Client:', err.message);
});

port.on('error', (err) => {
  console.error('Error pada Serial Port:', err.message);
});
