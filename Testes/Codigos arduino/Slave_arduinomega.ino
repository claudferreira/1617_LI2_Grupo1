// demo: CAN-BUS Shield, receive data with check mode
// send data coming to fast, such as less than 10ms, you can use this way
// loovee, 2014-6-13

#include <SPI.h>
#include "mcp_can.h"

// the cs pin of the version after v1.1 is default to D9
// v0.9b and v1.0 is default D10
const int SPI_CS_PIN = 53;


MCP_CAN CAN(SPI_CS_PIN);                                    // Set CS pin

void setup()
{
    Serial.begin(115200);
    pinMode(8,OUTPUT);
    pinMode(9,OUTPUT);
    pinMode(10,OUTPUT);
    pinMode(11,OUTPUT);
    pinMode(12,OUTPUT);
    pinMode(13,OUTPUT);

    while (CAN_OK != CAN.begin(CAN_500KBPS))              // init can bus : baudrate = 500k
    {
        Serial.println("CAN BUS Shield init fail");
        Serial.println("Init CAN BUS Shield again");
        delay(100);
    }
    Serial.println("CAN BUS Shield init ok!");
}


void loop()
{
    unsigned char len = 0;
    unsigned char buf[8];

    if(CAN_MSGAVAIL == CAN.checkReceive())            // check if data coming
    {
        CAN.readMsgBuf(&len, buf);    // read data,  len: data length, buf: data buf

        unsigned char canId = CAN.getCanId();

        Serial.println("-----------------------------");
        Serial.println("get data from ID: ");
        Serial.println(canId);
            Serial.print("\t");

        for(int i = 0; i<len; i++)    // print the data
        { Serial.print(buf[i]);
        Serial.println(); 
    }
            if(buf[0]==1)
            {digitalWrite(8, HIGH);}
            else digitalWrite(8, LOW);
            if(buf[1]==1)
            {digitalWrite(9, HIGH);}
            else digitalWrite(9, LOW);
            if(buf[2]==1)
            {digitalWrite(10, HIGH);}
            else digitalWrite(10, LOW);
            if(buf[3]==1)
            {digitalWrite(11, HIGH);}
            else digitalWrite(11, LOW);
            if(buf[4]==1)
            {digitalWrite(12, HIGH);}
            else digitalWrite(12, LOW);
            if(buf[5]==1)
            {digitalWrite(13, HIGH);}
           else digitalWrite(13, LOW);
}
}
//END FILE
