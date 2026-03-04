#  code for mqtt client to handle communication with the mqtt broker and devices
import paho.mqtt.client as mqtt
import json
from app.core.database import SessionLocal, MovementData

MQTT_BROKER = "test.mosquitto.org"
DATALINE_TOPIC = "dataline"
CONTROLLINE_TOPIC = "controlline"

ACTIVE_USER_ID = None

def on_connect(client, userdata, flags, rc):
    print(f"Connected to MQTT Broker with result code {rc}")
    client.subscribe(DATALINE_TOPIC)

def on_message(client, userdata, msg):
    global ACTIVE_USER_ID
    if ACTIVE_USER_ID is None:
        return

    try:
        payload = json.loads(msg.payload.decode())
        db = SessionLocal()
        new_data = MovementData(
            user_id=ACTIVE_USER_ID,
            a_x=payload.get("a_x", 0.0),
            a_y=payload.get("a_y", 0.0),
            a_z=payload.get("a_z", 0.0),
            g_x=payload.get("g_x", 0.0),
            g_y=payload.get("g_y", 0.0),
            g_z=payload.get("g_z", 0.0)
        )
        db.add(new_data)
        db.commit()
        db.close()
    except Exception as e:
        print(f"Error saving MQTT data: {e}")

mqtt_client = mqtt.Client()
mqtt_client.on_connect = on_connect
mqtt_client.on_message = on_message

def start_mqtt():
    mqtt_client.connect(MQTT_BROKER, 1883, 60)
    mqtt_client.loop_start()

def publish_control(command: str):
    mqtt_client.publish(CONTROLLINE_TOPIC, command)