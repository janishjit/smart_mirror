#include <stdlib.h>
#include <stdio.h>
#include <string.h>
// #include "wifi/wifi.h"
#include "uart/uart.h"
#include "mapping/mapping.h"

#define IO_BASE 0xFF210000
#define IO_BRIDGE_SPAN 0x5000
#define BAUD_RATE 115200

// #define IO_Base 0xFF210000
#define RS_Base (0x1000)
#define RS_ReceiverBase (RS_Base + 0x0)
#define RS_TransmitterBase (RS_Base + 0x0)
#define RS_InterruptEnable (RS_Base + 0x2)
#define RS_InterruptIDBase (RS_Base + 0x4)
#define RS_FifoBase (RS_Base + 0x4)
#define RS_LineControlBase (RS_Base + 0x6)
#define RS_ModemControlBase (RS_Base + 0x8)
#define RS_LineStatusBase (RS_Base + 0xA)
#define RS_ModemStatusBase (RS_Base + 0xC)
#define RS_ScratchBase (RS_Base + 0xE)
#define RS_DivisorLSBBase (RS_Base + 0x0)
#define RS_DivisorMSBBase (RS_Base + 0x2)

volatile void *WIFI;
volatile unsigned char *WIFI_ReceiverFifo;
volatile unsigned char *WIFI_TransmitterFifo;
volatile unsigned char *WIFI_InterruptEnable;
volatile unsigned char *WIFI_InterruptIdentificationReg;
volatile unsigned char *WIFI_FifoControlReg;
volatile unsigned char *WIFI_LineControlReg;
volatile unsigned char *WIFI_ModemControlReg;
volatile unsigned char *WIFI_LineStatusReg;
volatile unsigned char *WIFI_ModemStatusReg;
volatile unsigned char *WIFI_ScratchReg;
volatile unsigned char *WIFI_DivisorLatchLSB;
volatile unsigned char *WIFI_DivisorLatchMSB;
int main(void)
{
  int memFd = open_physical(-1);
  void *LW_virtual = map_physical(memFd, IO_BASE, IO_BRIDGE_SPAN);

  WIFI_ReceiverFifo = WIFI + RS_ReceiverBase;
  WIFI_TransmitterFifo = WIFI + RS_TransmitterBase;
  WIFI_InterruptEnable = WIFI + RS_InterruptEnable;
  WIFI_InterruptIdentificationReg = WIFI + RS_InterruptIDBase;
  WIFI_FifoControlReg = WIFI + RS_FifoBase;
  WIFI_LineControlReg = WIFI + RS_LineControlBase;
  WIFI_ModemControlReg = WIFI + RS_ModemControlBase;
  WIFI_LineStatusReg = WIFI + RS_LineStatusBase;
  WIFI_ModemStatusReg = WIFI + RS_ModemStatusBase;
  WIFI_ScratchReg = WIFI + RS_ScratchBase;
  WIFI_DivisorLatchLSB = WIFI + RS_DivisorLSBBase;
  WIFI_DivisorLatchMSB = WIFI + RS_DivisorMSBBase;

  initUART(BAUD_RATE, WIFI_LineControlReg, WIFI_DivisorLatchLSB, WIFI_DivisorLatchMSB, WIFI_FifoControlReg);
  // flushUART(WiFi_LineStatusReg, WiFi_ReceiverFifo);
  // writeStringUART(exec, WiFi_LineStatusReg, WiFi_TransmitterFifo);
}

// int Init_Wifi(void) {
//     // set bit 7 of Line Control Register to 1, to gain access to the baud rate registers
//     // set Divisor latch (LSB and MSB) with correct value for required baud rate
//     // set bit 7 of Line control register back to 0 and
//     // program other bits in that reg for 8 bit data, 1 stop bit, no parity etc
//     // Reset the Fifo’s in the FiFo Control Reg by setting bits 1 & 2
//     // Now Clear all bits in the FiFo control registers
//     int err = initMap();
//     if(err)
//         return err;
//     *RS232_LineControlReg = 0x80;
//     // 115200 Baud rate. Divisor = 27 = 0x1B
//     *RS232_DivisorLatchLSB = 0x1B;
//     *RS232_DivisorLatchMSB = 0x00;
//     // 00xx0011 = 0x03
//     *RS232_LineControlReg = 0x0;
//     *RS232_LineControlReg =  0x03;
//     *RS232_FifoControlReg = 0x06;
//     *RS232_FifoControlReg = 0x0;
//     return 0;
// }