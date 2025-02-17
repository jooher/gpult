#include <WiFi.h>

#define ssid "ASUS 123"
#define password "1qaz@WSX"
#define hostname "robot"
#define led 23 //LED_BUILTIN

#define ON LOW
#define OFF !ON

WiFiServer server(80);

void setup() {
  Serial.begin(115200);
  pinMode(led, OUTPUT);  // set the LED pin mode
  connectWiFi();
}

void loop() {
  checkWiFi();
}

void blinkk (int dl, int da = 10) {
  while (dl > 10) {
    digitalWrite(led, OFF);
    delay (dl);
    digitalWrite(led, ON);
    delay (dl);
    dl -= da;
  }
}

void connectWiFi() {
  delay(10);

  Serial.printf("Connecting to %s:", ssid);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("Connected\n");
  Serial.println(WiFi.localIP());

  server.begin();
}

void handleCmd(String cmd) {
  if (cmd.startsWith("H")) {
    Serial.println("HIGH");
    digitalWrite(led, HIGH);
  }
  if (cmd.startsWith("L")) {
    Serial.println("LOW");
    digitalWrite(led, LOW);
  }
  if (cmd.startsWith("F")) {
    Serial.println("FAST");
    blinkk (200);
  }
  if (cmd.startsWith("S")) {
    Serial.println("SLOW");
    blinkk (1000);
  }
  if (cmd.startsWith("f")) {
    Serial.println("fast+");
    blinkk (200, 5);
  }
  if (cmd.startsWith("s")) {
    Serial.println("slow-");
    blinkk (1000, 20);
  }
}

void checkWiFi() {
  WiFiClient client = server.accept();

  if (client) {
    
    String line = "";
    char c;
    
    while (client.connected()) {
      if (client.available()) {
        
        while( (c=client.read()) != '\n') if (c != '\r') line += c;
          
        if (line.length()) {
          int c = line.indexOf("GET /");
          if(c >= 0) handleCmd(line.substring(c + 5));
          line = "";
        } else {
          client.println("HTTP/1.1 204 No Content\nAccess-Control-Allow-Origin: *\nContent-length: 0\n");
          client.flush();
        }
        
      }
    }
    client.stop();
    Serial.println("Disconnected.");
  }
}
