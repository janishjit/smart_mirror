#include "address_map_arm.h"
#include <sys/mman.h>
#include <stdio.h>
#include <stdlib.h>
#include <fcntl.h>

/* globals */
#define BUF_SIZE 480000			// about 10 seconds of buffer (@ 48K samples/sec)
#define BUF_THRESHOLD 96		// 75% of 128 word buffer

/* function prototypes */
void HEX_PS2(char, char, char, void *);
void check_KEYs( int *, int *, int *, void *);

int open_physical(int);
void close_physical(int);
int unmap_physical(void *, unsigned int);
int i;
int count;
time_t sec_before;
time_t sec_after;
time_t seconds;

/********************************************************************************
 * This program demonstrates use of the media ports in the DE1-SoC Computer
 *
 * It performs the following: 
 *  1. records audio for about 5 seconds when KEY[0] is pressed. LEDR[0] is
 *     lit while recording
 * 
 * Below is what the code originally does
 * 	2. plays the recorded audio when KEY[1] is pressed. LEDR[1] is lit while 
 * 	   playing
 * 	3. Draws a blue box on the VGA display, and places a text string inside
 * 	   the box
 * 	4. Displays the last three bytes of data received from the PS/2 port 
 * 	   on the HEX displays on the DE1-SoC Computer
********************************************************************************/
int main(void)
{
	/* Declare volatile pointers to I/O registers (volatile means that IO load
	   and store instructions will be used to access these pointer locations, 
	   instead of regular memory loads and stores) */
  	volatile int * red_LED_ptr;
	volatile int * audio_ptr;
	volatile int * PS2_ptr;
    
    void * LW_virtual;
    int fd = -1;

    //open /dev/mem
    if((fd = open_physical(fd)) == -1)
        printf("Open physical failed\n");

    // Get a mapping from physical addresses to virtual addresses
    LW_virtual = mmap (NULL, LW_BRIDGE_SPAN, (PROT_READ | PROT_WRITE), MAP_SHARED, fd, LW_BRIDGE_BASE);
    if (LW_virtual == MAP_FAILED){
        printf ("ERROR: mmap() failed...\n");
        close (fd);
    }

    red_LED_ptr = (unsigned int *) (LW_virtual + LEDR_BASE);
    audio_ptr = (unsigned int *) (LW_virtual + AUDIO_BASE);
    PS2_ptr = (unsigned int *) (LW_virtual + PS2_BASE);

	/* used for audio record/playback */
	int fifospace;
	int record = 0, play = 0, buffer_index = 0, buffer_index_play = 0;
	// int left_buffer[BUF_SIZE];
	// int right_buffer[BUF_SIZE];
	int *left_buffer2 = malloc(BUF_SIZE * sizeof(int));
    int *right_buffer2 = malloc(BUF_SIZE * sizeof(int));

	/* used for PS/2 port data */
	int PS2_data, RVALID;
	char byte1 = 0, byte2 = 0, byte3 = 0;

	/* read and echo audio data */
	record = 0;
	play = 0;
	
	// PS/2 mouse needs to be reset (must be already plugged in)
	*(PS2_ptr) = 0xFF;		// reset
	while(1)
	{
		check_KEYs ( &record, &play, &buffer_index, LW_virtual);
		if (record)
		{
			buffer_index = 0;
			*(red_LED_ptr) = 0x1;					// turn on LEDR[0]
			fifospace = *(audio_ptr + 1);	 		// read the audio port fifospace register
			if ( (fifospace & 0x000000FF) > BUF_THRESHOLD ) 	// check RARC
			{
				printf("recording**********\n");
				count = 0;
				sec_before = time(NULL);
				// store data until the the audio-in FIFO is empty or the buffer is full
				while (buffer_index < BUF_SIZE)
				{
					if (count % 63 == 0) {
						// left_buffer[buffer_index] = *(audio_ptr + 2); 		
						// right_buffer[buffer_index] = *(audio_ptr + 3);
						*(left_buffer2 + buffer_index) = *(audio_ptr + 2);
						*(right_buffer2 + buffer_index) = *(audio_ptr + 3); 		
						++buffer_index;
						// printf("buffer_index: %d\n", buffer_index);
						}
					count++;

					if (buffer_index == BUF_SIZE)
					{
						sec_after = time(NULL);
						seconds = sec_after - sec_before;
						printf("Recorded for %ld seconds\n", seconds);
						printf("buffer_index: %d\n", buffer_index);
						// done recording
						record = 0;
						
						// printing out the first few values to see how it looks like
						for(i = 0; i < 10; i++){
							printf("value: %d \n", *(right_buffer2 + i));
						}

						/* writing audio to file */
						printf("writing audio to file\n");
						FILE *f = fopen("audio.bin", "w+");
						fwrite(right_buffer2, BUF_SIZE, sizeof(int), f);
						fclose(f);
						printf("done writing to file\n");

						/* try reading from file to see if data is written correctly */
						// the code below is not working :'( sad
						FILE* file = fopen ("audio.bin", "r");
						// while (1) {
							int num;
							printf("reading******\n");
							fread(&num, 4, 1, file);
							printf("value from file: %d\n", num);
							fseek(file, 4, SEEK_SET);
							fread(&num, 4, 1, file);
							printf("value from file: %d\n", num);
						// }
						fclose (file);
						// printf("done reading from file\n");

						*(red_LED_ptr) = 0x0;				// turn off LEDR

						/* code for playing audio */
						buffer_index_play = 0;
						*(red_LED_ptr) = 0x2;					// turn on LEDR_1
						fifospace = *(audio_ptr + 1);	 		// read the audio port fifospace register
						// while(1) {
						// 	if ( (fifospace & 0x00FF0000) > BUF_THRESHOLD ) 	// check WSRC
						// 	{
								printf("playing**********\n");
								// output data until the buffer is empty or the audio-out FIFO is full
								count = 0;
								while (buffer_index_play < BUF_SIZE)
								{
									if (count % 63 == 0) {
										// *(audio_ptr + 2) = left_buffer[buffer_index_play];
										// *(audio_ptr + 3) = right_buffer[buffer_index_play];
										*(audio_ptr + 2) = *(left_buffer2 + buffer_index_play);
										*(audio_ptr + 3) = *(right_buffer2 + buffer_index_play);
										++buffer_index_play;
									}
									if (buffer_index_play == BUF_SIZE)
									{
										// done playback
										play = 0;
										*(red_LED_ptr) = 0x0;				// turn off LEDR
										printf("done playing**********\n");
										break;
									}
									fifospace = *(audio_ptr + 1);	// read the audio port fifospace register
									count++;
								}
							//}
							/* end of code for playing audio */
						//}
					}
					fifospace = *(audio_ptr + 1);	// read the audio port fifospace register
				}
			}
		}
	}
    unmap_physical(LW_virtual, LW_BRIDGE_SPAN);
    close_physical(fd);

	free(right_buffer2);
	free(left_buffer2);
}

/****************************************************************************************
 * Subroutine to show a string of HEX data on the HEX displays
****************************************************************************************/
void HEX_PS2(char b1, char b2, char b3, void * LW_virtual)
{
	volatile int * HEX3_HEX0_ptr;
	volatile int * HEX5_HEX4_ptr;

	HEX3_HEX0_ptr = (unsigned int *) (LW_virtual + HEX3_HEX0_BASE);
	HEX5_HEX4_ptr = (unsigned int *) (LW_virtual + HEX5_HEX4_BASE);

	/* SEVEN_SEGMENT_DECODE_TABLE gives the on/off settings for all segments in 
	 * a single 7-seg display in the DE1-SoC Computer, for the hex digits 0 - F */
	unsigned char	seven_seg_decode_table[] = {	0x3F, 0x06, 0x5B, 0x4F, 0x66, 0x6D, 0x7C, 0x07, 
		  										0x7F, 0x67, 0x77, 0x7C, 0x39, 0x5E, 0x79, 0x71 };
	unsigned char	hex_segs[] = { 0, 0, 0, 0, 0, 0, 0, 0 };
	unsigned int shift_buffer, nibble;
	unsigned char code;
	int i;

	shift_buffer = (b1 << 16) | (b2 << 8) | b3;
	for ( i = 0; i < 6; ++i )
	{
		nibble = shift_buffer & 0x0000000F;		// character is in rightmost nibble
		code = seven_seg_decode_table[nibble];
		hex_segs[i] = code;
		shift_buffer = shift_buffer >> 4;
	}
	/* drive the hex displays */
	*(HEX3_HEX0_ptr) = *(int *) (hex_segs);
	*(HEX5_HEX4_ptr) = *(int *) (hex_segs+4);
}

/****************************************************************************************
 * Subroutine to read KEYs
****************************************************************************************/
void check_KEYs(int * KEY0, int * KEY1, int * counter, void * LW_virtual)
{
	volatile int * KEY_ptr;
	volatile int * audio_ptr;
	int KEY_value;

    KEY_ptr = (unsigned int *) (LW_virtual + KEY_BASE);
    audio_ptr = (unsigned int *) (LW_virtual + AUDIO_BASE);

	KEY_value = *(KEY_ptr); 					// read the pushbutton KEY values
	while (*KEY_ptr);							// wait for pushbutton KEY release
	// printf("KEY_value: %d\n", KEY_value);

	if (KEY_value == 0x1)					// check KEY0
	{
		printf("KEY0 is pressed\n");
		// reset counter to start recording
		*counter = 0;
		// clear audio-in FIFO
		*(audio_ptr) = 0x4;
		*(audio_ptr) = 0x0;

		*KEY0 = 1;
	}
	else if (KEY_value == 0x2)				// check KEY1
	{
		printf("KEY1 is pressed\n");
		// reset counter to start playback
		*counter = 0;
		// clear audio-out FIFO
		*(audio_ptr) = 0x8;
		*(audio_ptr) = 0x0;

		*KEY1 = 1;
	}
}

/* Open /dev/mem to give access to physical addresses */
int open_physical (int fd){
    if (fd == -1) // check if already open
        if ((fd = open( "/dev/mem", (O_RDWR | O_SYNC))) == -1){
            printf ("ERROR: could not open \"/dev/mem\"...\n");
            return (-1);
        }
    return fd;
}

/* Close /dev/mem to give access to physical addresses */
void close_physical (int fd){
    close (fd);
}

/* Close the previously-opened virtual address mapping */
int unmap_physical(void * virtual_base, unsigned int span){
    if (munmap (virtual_base, span) != 0){
        printf ("ERROR: munmap() failed...\n");
        return (-1);
    }
    return 0;
}