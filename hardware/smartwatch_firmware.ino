#include <WiFi.h>
#include <PubSubClient.h>
#include <Wire.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* mqtt_server = "test.mosquitto.org";

WiFiClient espClient;
PubSubClient client(espClient);
Adafruit_MPU6050 mpu;

bool isCollecting = false;
unsigned long lastSendTime = 0;

void setup_wifi() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");
}

void callback(char* topic, byte* payload, unsigned int length) {
  String message = "";
  for (unsigned int i = 0; i < length; i++) message += (char)payload[i];
  
  if (message == "START") isCollecting = true;
  else if (message == "STOP") isCollecting = false;
}

void reconnect() {
  while (!client.connected()) {
    String clientId = "SmartWatch-" + String(random(0xffff), HEX);
    if (client.connect(clientId.c_str())) {
      client.subscribe("controlline");
    } else {
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  if (!mpu.begin()) while (1) delay(10);
  
  mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
  mpu.setGyroRange(MPU6050_RANGE_500_DEG);
  mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);

  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) reconnect();
  client.loop();

  if (isCollecting) {
    unsigned long currentTime = millis();
    if (currentTime - lastSendTime >= 100) { // Sends 10 times a second
      lastSendTime = currentTime;
      sensors_event_t a, g, temp;
      mpu.getEvent(&a, &g, &temp);

      String payload = "{";
      payload += "\"a_x\":" + String(a.acceleration.x) + ",";
      payload += "\"a_y\":" + String(a.acceleration.y) + ",";
      payload += "\"a_z\":" + String(a.acceleration.z) + ",";
      payload += "\"g_x\":" + String(g.gyro.x) + ",";
      payload += "\"g_y\":" + String(g.gyro.y) + ",";
      payload += "\"g_z\":" + String(g.gyro.z);
      payload += "}";

      client.publish("dataline", payload.c_str());
    }
  }
}