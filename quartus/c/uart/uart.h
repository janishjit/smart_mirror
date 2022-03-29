#ifndef UART_H__
#define UART_H__

void initUART(
    int baud_rate,
    volatile unsigned char *LineControlReg,
    volatile unsigned char *DivisorLatchLSB,
    volatile unsigned char *DivisorLatchMSB,
    volatile unsigned char *FifoControlReg);

/**
 * Writes the string into the specified UART transmitter fifo
 */
void writeStringUART(char *string, volatile unsigned char *LineStatusReg, volatile unsigned char *TransmitterFifo);

/**
 * Writes a character into the specified UART transmitter fifo
 */
void writeCharUART(char c, volatile unsigned char *LineStatusReg, volatile unsigned char *TransmitterFifo);

/**
 * Blocks reading a character from the specified UART receiver fifo
 */
int readCharUART(volatile unsigned char *LineStatusReg, volatile unsigned char *ReceiverFifo);

/**
 * Flushes the specified UART receiver/transmitter fifo
 */
void flushUART(volatile unsigned char *LineStatusReg, volatile unsigned char *ReceiverFifo);

/**
 * Checks if there is data ready in the UART
 */
int dataReadyUART(volatile unsigned char *LineStatusReg);

/**
 * Enables the specified UART interrupt to be able to trigger
 */
void enableUARTInterrupt(volatile unsigned char *interruptEnableReg);

#endif
