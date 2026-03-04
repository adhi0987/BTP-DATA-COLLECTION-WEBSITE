#include <WiFi.h>
#include <PubSubClient.h>
#include <Wire.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>

// --- Network & MQTT Configuration ---
const char* ssid = "YOUR_WIFI_SSID";          // Replace with your WiFi Name
const char* password = "YOUR_WIFI_PASSWORD";  // Replace with your WiFi Password
const char* mqtt_server = "test.mosquitto.org";

const char* DATALINE_TOPIC = "dataline";
const char* CONTROLLINE_TOPIC = "controlline";

WiFiClient espClient;
PubSubClient client(espClient);
Adafruit_MPU6050 mpu;

// --- State Variables ---
bool isCollecting = false;
unsigned long lastSendTime = 0;
const int SEND_INTERVAL_MS = 100; // Send data every 100ms (10Hz). Adjust as needed.

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

// Callback triggered when a message arrives on the subscribed topic (controlline)
void callback(char* topic, byte* payload, unsigned int length) {
  String message = "";
  for (unsigned int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("]: ");
  Serial.println(message);

  // Check if command is START or STOP
  if (message == "START") {
    isCollecting = true;
    Serial.println("Data collection STARTED.");
  } 
  else if (message == "STOP") {
    isCollecting = false;
    Serial.println("Data collection STOPPED.");
  }
}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Create a random client ID
    String clientId = "SmartWatchClient-";
    clientId += String(random(0, 0xffff), HEX);
    
    // Attempt to connect
    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
      // Once connected, subscribe to the control topic
      client.subscribe(CONTROLLINE_TOPIC);
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  
  // Initialize IMU (MPU6050)
  if (!mpu.begin()) {
    Serial.println("Failed to find MPU6050 chip");
    while (1) {
      delay(10);
    }
  }
  Serial.println("MPU6050 Found!");

  // Setup MPU ranges
  mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
  mpu.setGyroRange(MPU6050_RANGE_500_DEG);
  mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);

  setup_wifi();
  
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  // If we have received the START command, collect and send data
  if (isCollecting) {
    unsigned long currentTime = millis();
    
    // Non-blocking delay to send data at specific intervals
    if (currentTime - lastSendTime >= SEND_INTERVAL_MS) {
      lastSendTime = currentTime;
      
      // Get new sensor events with the readings
      sensors_event_t a, g, temp;
      mpu.getEvent(&a, &g, &temp);

      // Create JSON payload string manually to save memory
      // {"a_x": 1.1, "a_y": 2.2, "a_z": 3.3, "g_x": 4.4, "g_y": 5.5, "g_z": 6.6}
      String payload = "{";
      payload += "\"a_x\":" + String(a.acceleration.x) + ",";
      payload += "\"a_y\":" + String(a.acceleration.y) + ",";
      payload += "\"a_z\":" + String(a.acceleration.z) + ",";
      payload += "\"g_x\":" + String(g.gyro.x) + ",";
      payload += "\"g_y\":" + String(g.gyro.y) + ",";
      payload += "\"g_z\":" + String(g.gyro.z);
      payload += "}";

      // Publish to dataline
      client.publish(DATALINE_TOPIC, payload.c_str());
      
      // Optional: Print to serial for debugging
      // Serial.println(payload);
    }
  }
}