#include "wifi.h"
#include "../uart/uart.h"
char *exec = "dofile(\"hello_world.lua\")";
char BUFFER[1024];

int initWifi(volatile unsigned char *WiFi_LineControlReg)
{
  initUART(BAUD_RATE, WiFi_LineControlReg, WiFi_DivisorLatchLSB, WiFi_DivisorLatchMSB, WiFi_FifoControlReg);
  flushUART(WiFi_LineStatusReg, WiFi_ReceiverFifo);
  writeStringUART(exec, WiFi_LineStatusReg, WiFi_TransmitterFifo);
}