#include "wifi.h"
#include "../uart/uart.h"
char * exec = "dofile(\"send_http_requests.lua\")";
char BUFFER[1024];

int initWifi(void) {
  initUART(BAUD_RATE, WiFi_LineControlReg, WiFi_DivisorLatchLSB, WiFi_DivisorLatchMSB, WiFi_FifoControlReg);
  flushUART(WiFi_LineStatusReg, WiFi_ReceiverFifo);
  writeStringUART(exec, WiFi_LineStatusReg, WiFi_TransmitterFifo);

}