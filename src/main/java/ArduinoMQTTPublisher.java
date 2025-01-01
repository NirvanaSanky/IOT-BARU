import com.fazecast.jSerialComm.SerialPort;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;

public class ArduinoMQTTPublisher {
    public static void main(String[] args) {
        // Konfigurasi serial port
        SerialPort serialPort = SerialPort.getCommPorts()[0]; // Pilih port pertama (ubah jika perlu)
        serialPort.setBaudRate(9600);
        serialPort.openPort();

        if (!serialPort.isOpen()) {
            System.out.println("Gagal membuka port serial!");
            return;
        }
        System.out.println("Port serial terbuka.");

        // Konfigurasi MQTT
        String broker = "tcp://broker.hivemq.com:1883"; // Broker MQTT
        String topic = "arduino/dht11";

        try {
            // Buat MqttClient tanpa clientId (otomatis dihasilkan)
            MqttClient mqttClient = new MqttClient(broker, MqttClient.generateClientId());
            mqttClient.connect();
            System.out.println("Terhubung ke broker MQTT.");

            // Membaca data dari serial port dan mengirimkan ke MQTT
            while (true) {
                if (serialPort.bytesAvailable() > 0) {
                    byte[] buffer = new byte[serialPort.bytesAvailable()];
                    serialPort.readBytes(buffer, buffer.length);
                    String data = new String(buffer).trim();

                    // Log data
                    System.out.println("Data diterima: " + data);

                    // Kirim data ke broker MQTT
                    MqttMessage message = new MqttMessage(data.getBytes());
                    message.setQos(0); // QoS 0 untuk pengiriman cepat
                    mqttClient.publish(topic, message);
                    System.out.println("Data dikirim ke broker: " + data);
                }

                Thread.sleep(100); // Tunggu untuk mengurangi penggunaan CPU
            }

        } catch (MqttException | InterruptedException e) {
            e.printStackTrace();
        } finally {
            serialPort.closePort();
            System.out.println("Port serial ditutup.");
        }
    }
}
