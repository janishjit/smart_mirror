/**************************************************************************
* Subroutine to initialise the Bluetooth Port by writing some data
** to the internal registers.
** Call this function at the start of the program before you attempt
** to read or write to data via the Bluetooth port
**
** Refer to UART data sheet for details of registers and programming
***************************************************************************/

#include "uart.h"
#include "../common.h"

void initUART(
    int baud_rate,
    volatile unsigned char *LineControlReg,
    volatile unsigned char *DivisorLatchLSB,
    volatile unsigned char *DivisorLatchMSB,
    volatile unsigned char *FifoControlReg)
{
    /************** Initialize Bluetooth UART registers **************/

    // set bit 7 of Line Control Register to 1, to gain access to the baud rate registers
    *LineControlReg |= 1U << 7;

    // set Divisor latch (LSB and MSB) with correct value for required baud rate
    if (baud_rate == 9600)
    {
        *DivisorLatchLSB = 0x45;
        *DivisorLatchMSB = 0x01;
    }
    else if (baud_rate == 38400)
    {
        *DivisorLatchLSB = 0x51;
        *DivisorLatchMSB = 0x00;
    }
    else if (baud_rate == 115200)
    {
        *DivisorLatchLSB = 0x1B;
        *DivisorLatchMSB = 0x00;
    }
    else if (baud_rate == 57600)
    {
    	*DivisorLatchLSB = 0x36;
    	*DivisorLatchMSB = 0x00;
    }
    else if (baud_rate == 76800)
    {
    	*DivisorLatchLSB = 0x29;
    	*DivisorLatchMSB = 0x00;
    }

    // set bit 7 of Line control register back to 0 and
    // program other bits in that reg for 8 bit data,
    // 1 stop bit, no parity etc
    *LineControlReg &= ~(1UL << 7);
    *LineControlReg |= 1UL << 1;
    *LineControlReg |= 1UL;

    // Reset the Fifos in the FiFo Control Reg by setting bits 1 & 2
    *FifoControlReg |= 1UL << 2;
    *FifoControlReg |= 1UL << 1;

    // Now Clear all bits in the FiFo control registers
    *FifoControlReg = 0x00;
}

void writeStringUART(char *string, volatile unsigned char *LineStatusReg, volatile unsigned char *TransmitterFifo)
{
    int i;
    char c;

    for (i = 0; ((c = string[i]) != '\0'); i++)
    {
        writeCharUART(c, LineStatusReg, TransmitterFifo);
    }
    writeCharUART('\n', LineStatusReg, TransmitterFifo);
}

void writeCharUART(char c, volatile unsigned char *LineStatusReg, volatile unsigned char *TransmitterFifo)
{
    // wait for Transmitter Holding Register bit (5) of line status register to be '1'
    // indicating we can write to the device
    while (!(*LineStatusReg >> 5) & 1U);

    // write character to Transmitter fifo register
    *TransmitterFifo = c;
}

int dataReadyUART(volatile unsigned char *LineStatusReg)
{
    return (*LineStatusReg & 1U) ? TRUE : FALSE;
}

int readCharUART(volatile unsigned char *LineStatusReg, volatile unsigned char *ReceiverFifo)
{
    // wait for Data Ready bit (0) of line status register to be '1'
    while (!(*LineStatusReg & 1U));

    // return new character from ReceiverFiFo register
    return (int)*ReceiverFifo;
}

void flushUART(volatile unsigned char *LineStatusReg, volatile unsigned char *ReceiverFifo)
{
    // while bit 0 of Line Status Register == ‘1’
    // read unwanted char out of fifo receiver buffer
    int unwanted_char;
    while (dataReadyUART(LineStatusReg))
    {
        unwanted_char = *ReceiverFifo;
    }
}

void enableUARTInterrupt(volatile unsigned char *interruptEnableReg) {
	//currently set for interrupt when reading data is available
	unsigned char receiveDataAvailableInt = 0x01;
	(*interruptEnableReg) = receiveDataAvailableInt;
}

