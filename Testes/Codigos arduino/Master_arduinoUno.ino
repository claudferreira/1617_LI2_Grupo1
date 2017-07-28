// demo: CAN-BUS Shield, send data
#include <mcp_can.h>
#include <SPI.h>

// the cs pin of the version after v1.1 is default to D9
// v0.9b and v1.0 is default D10
const int SPI_CS_PIN =10;
const int ledHIGH    = 1;
const int ledLOW     = 0;

MCP_CAN CAN(SPI_CS_PIN);                                    // Set CS pin
String a;
 
void setup()
{
    Serial.begin(115200);

    while (CAN_OK != CAN.begin(CAN_500KBPS))              // init can bus : baudrate = 500k
    {
        Serial.println("CAN BUS Shield init fail");
        Serial.println(" Init CAN BUS Shield again");
        delay(100);
    }
    Serial.println("CAN BUS Shield init ok!");
}

unsigned char refresh[8] = {0, 0, 0, 0, 0, 0, 0, 0};
unsigned char esp0_banco100[8] = {1, 0, 0, 0, 0, 1, 0, 0};
unsigned char esp50_banco100[8] = {0, 1, 0, 0, 0, 1, 0, 0};
unsigned char esp100_banco100[8] = {0, 0, 1, 0, 0, 1, 0, 0};
unsigned char esp0_banco50[8] = {1, 0, 0, 0, 1, 0, 0, 0};
unsigned char esp50_banco50[8] = {0, 1, 0, 0, 1, 0, 0, 0};
unsigned char esp100_banco50[8] = {0, 0, 1, 0, 1, 0, 0, 0};
unsigned char esp0_banco0[8] = {1, 0, 0, 1, 0, 0, 0, 0};
unsigned char esp50_banco0[8] = {0, 1, 0, 1, 0, 0, 0, 0};
unsigned char esp100_banco0[8] = {0, 0, 1, 1, 0, 0, 0, 0};

//String protocolo="esp50_banco0";

void loop()
{
  while(Serial.available()) {

a= Serial.readString();// read the incoming data as string

Serial.println(a);

}
  
  
  if(a == "refresh")
{
  CAN.sendMsgBuf(0x70,0, 8, refresh);
};
   if(a == "esp0_banco100")
{
  CAN.sendMsgBuf(0x70,0, 8, esp0_banco100);
};
   if(a == "esp50_banco100")
{
  CAN.sendMsgBuf(0x70,0, 8, esp50_banco100);
};
   if(a == "esp100_banco100")
{
  CAN.sendMsgBuf(0x70,0, 8, esp100_banco100);
};
   if(a == "esp0_banco50")
{
  CAN.sendMsgBuf(0x70,0, 8, esp0_banco50);
};
   if(a == "esp50_banco50")
{
  CAN.sendMsgBuf(0x70,0, 8, esp50_banco50);
};
   if(a == "esp100_banco50")
{
  CAN.sendMsgBuf(0x70,0, 8, esp100_banco50);
};
   if(a == "esp0_banco0")
{
  CAN.sendMsgBuf(0x70,0, 8, esp0_banco0);
};
   if(a == "esp50_banco0")
{
  CAN.sendMsgBuf(0x70,0, 8, esp50_banco0);
};
   if(a == "esp100_banco0")
{
  CAN.sendMsgBuf(0x70,0, 8, esp100_banco0);
};




  Serial.println("In loop");
  Serial.println(a);
    // send data:  id = 0x00, standard frame, data len = 8, stmp: data buf
    delay(1000);                       // send data once per second
}

/*********************************************************************************************************
  END FILE
*********************************************************************************************************/
