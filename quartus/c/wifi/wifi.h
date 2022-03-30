#ifndef WIFI_WIFI_H_
#define WIFI_WIFI_H_

#include <stdint.h>
#include <stdio.h>
#include "../common.h"

// wifi uart register locations. Defined in serialIODecoder.v
// #define WiFi_ReceiverFifo ((volatile unsigned char *)(0xFF211010))
// #define WiFi_TransmitterFifo ((volatile unsigned char *)(0xFF211010))
// #define WiFi_InterruptEnableReg ((volatile unsigned char *)(0xFF211012))
// #define WiFi_InterruptIdentificationReg ((volatile unsigned char *)(0xFF211014))
// #define WiFi_FifoControlReg ((volatile unsigned char *)(0xFF211014))
// #define WiFi_LineControlReg ((volatile unsigned char *)(0xFF211016))
// #define WiFi_ModemControlReg ((volatile unsigned char *)(0xFF211018))
// #define WiFi_LineStatusReg ((volatile unsigned char *)(0xFF21101A))
// #define WiFi_ModemStatusReg ((volatile unsigned char *)(0xFF21101C))
// #define WiFi_ScratchReg ((volatile unsigned char *)(0xFF21101E))
// #define WiFi_DivisorLatchLSB ((volatile unsigned char *)(0xFF211010))
// #define WiFi_DivisorLatchMSB ((volatile unsigned char *)(0xFF211012))

#define WIFI_RST (volatile unsigned int *)(0xFF200060)
#define WIFI_CTS (volatile unsigned int *)(0xFF200070)

#define LUA_MSG_START "STRT\n"
#define LUA_MSG_END_SUCCESS "EXIT0\0" // lua will explicitly send a null terminated character at the end, which is included here

#define BAUD_RATE 115200
/*
 * represents information related to reading from
 * rfs wifi chip
 */
typedef struct wifi_context
{
	char *BUFFER;
	int index;
	char doneRead;
	char status;
} wifi_context;

extern volatile struct wifi_context *WIFI_ISR_CONTEXT;
extern char BUFFER[1024];

/**
 * Initializes wifi with a specific baud rate
 */
void initWiFi(int baud_rate);

/**
 * Sets wifi reset on the chip low so the chip is reset
 */
void resetWiFi(void);

/**
 * Writes every character in the string (except null terminating one)
 * to the UART transmitter fifo
 */
void writeStringWIFI(char *string);

/**
 * Reads from the UART receiver fifo until there is no more data available
 * CAP of 16 bytes
 */
void readStringWIFI(char string[32]);

/**
 * Reads from the UART receiver fifo every cpu cycle until size is reached
 */
void readStringTillSizeWIFI(char *string, int size);

/**
 * Writes a command to the wifi chip, nodemcu (lua), and reads the response
 */
int writeAndReadResponse(char *write, char *response);

/**
 * Triggered on interrupt caused by receiving data from the wifi chip
 */
void wifi_isr_callback(uint32_t icciar, void *context);

/**
 * Resets the wifi isr
 */
void resetWifiIsrContext(void);

#endif
