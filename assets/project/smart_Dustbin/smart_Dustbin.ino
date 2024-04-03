#define BLYNK_TEMPLATE_ID "TMPL6u4PUkawN"
#define BLYNK_TEMPLATE_NAME "CLEV"
#define BLYNK_AUTH_TOKEN "-***************"
#define BLYNK_PRINT Serial
#include <Wire.h>
#include <ESP8266WiFi.h>
#include <LiquidCrystal_I2C.h>
#include <BlynkSimpleEsp8266.h>


#define trigPin 14
#define echoPin 12
#define trigPin_1 5
#define echoPin_1 4
char auth[] = BLYNK_AUTH_TOKEN;
char ssid[] = "nepal12";//Enter your WIFI name
char pass[] = "123456789";//Enter your WIFI password

long duration;
int distance;
long duration_1;
int distance_1;

BlynkTimer timer;

void readD() {

  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  duration = pulseIn(echoPin, HIGH);
  distance = duration * 0.034 / 2;
  Serial.print("Distance: ");
  Serial.println(distance);
  delay(20);
  Blynk.virtualWrite(V0, distance);
}

void readD_1() {
  digitalWrite(trigPin_1, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin_1, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin_1, LOW);
  duration_1 = pulseIn(echoPin_1, HIGH);
  distance_1 = duration_1 * 0.034 / 2;
  Serial.print("Distance_1: ");
  Serial.println(distance_1);
  delay(20);
  Blynk.virtualWrite(V1, distance_1);
}

void setup()
{
  Serial.begin(115200);
  Serial.println("Hello");
  pinMode(trigPin, OUTPUT); // Sets the trigPin as an Output
  pinMode(echoPin, INPUT); // Sets the echoPin as an Input
  pinMode(trigPin_1, OUTPUT); // Sets the trigPin as an Output
  pinMode(echoPin_1, INPUT); // Sets the echoPin as an Input
  
  Blynk.begin(auth, ssid, pass);


  timer.setInterval(100L, readD);
  timer.setInterval(100L, readD_1);
}


void loop()
{
  Blynk.run();
  timer.run();
}
