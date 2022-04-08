`default_nettype none
//=======================================================
//  This code is generated by Terasic System Builder
//=======================================================

module WiFi_Network_Time(

	//////////// CLOCK //////////
	input 		          		CLOCK2_50,
	input 		          		CLOCK3_50,
	input 		          		CLOCK_50,

	//////////// LED //////////
	output		     [8:0]		LEDG,
	output		    [17:0]		LEDR,

	//////////// KEY //////////
	input 		     [3:0]		KEY,

	//////////// SW //////////
	input 		    [17:0]		SW,

	//////////// SEG7 //////////
	output		     [6:0]		HEX0,
	output		     [6:0]		HEX1,
	output		     [6:0]		HEX2,
	output		     [6:0]		HEX3,
	output		     [6:0]		HEX4,
	output		     [6:0]		HEX5,
	output		     [6:0]		HEX6,
	output		     [6:0]		HEX7,

	//////////// GPIO, GPIO connect to RFS - RF and Sensor //////////
	inout 		          		BT_KEY,
	input 		          		BT_UART_RX,
	output		          		BT_UART_TX,
	input 		          		LSENSOR_INT,
	inout 		          		LSENSOR_SCL,
	inout 		          		LSENSOR_SDA,
	output		          		MPU_AD0_SDO,
	output		          		MPU_CS_n,
	output		          		MPU_FSYNC,
	input 		          		MPU_INT,
	inout 		          		MPU_SCL_SCLK,
	inout 		          		MPU_SDA_SDI,
	input 		          		RH_TEMP_DRDY_n,
	inout 		          		RH_TEMP_I2C_SCL,
	inout 		          		RH_TEMP_I2C_SDA,
	inout 		     [7:0]		TMD_D,
	input 		          		UART2USB_CTS,
	output		          		UART2USB_RTS,
	input 		          		UART2USB_RX,
	output		          		UART2USB_TX,
	output		          		WIFI_EN,
	output		          		WIFI_RST_n,
	input 		          		WIFI_UART0_CTS,
	output		          		WIFI_UART0_RTS,
	input 		          		WIFI_UART0_RX,
	output		          		WIFI_UART0_TX,
	input 		          		WIFI_UART1_RX
);



//=======================================================
//  REG/WIRE declarations
//=======================================================
wire pio_wifi_reset;

wire HEX0_DP, HEX1_DP, HEX2_DP, HEX3_DP, HEX4_DP, HEX5_DP;

//=======================================================
//  Structural coding
//=======================================================

assign WIFI_RST_n = KEY[0] & pio_wifi_reset;
assign WIFI_EN = 1'b1;

assign LEDR[8] = ~WIFI_UART0_TX;
assign LEDR[9] = ~WIFI_UART0_RX;

assign UART2USB_TX = ((SW[0] == 1'b0)? WIFI_UART0_RX: WIFI_UART0_TX);

wire [9:0] address;
wire [7:0] readdata;
wire [7:0] writedata;
wire finish;
wire restart;
wire wren;
RFS_WiFi u0(
        .clk_clk(CLOCK_50),                                             //                                clk.clk
        .reset_reset_n(KEY[0]),                                         //                              reset.reset_n
        .pio_key_external_connection_export(KEY[1]),                    //            key_external_connection.export

        .wifi_uart0_external_connection_rxd(WIFI_UART0_RX),             //     wifi_uart0_external_connection.rxd
        .wifi_uart0_external_connection_txd(WIFI_UART0_TX),             //                                   .txd
        .wifi_uart0_external_connection_cts_n(WIFI_UART0_CTS),          //                                   .cts_n
        .wifi_uart0_external_connection_rts_n(WIFI_UART0_RTS),          //                                   .rts_n

        .seg7_if_0_conduit_end_export({HEX5_DP, HEX5, HEX4_DP, HEX4,
                                       HEX3_DP, HEX3, HEX2_DP, HEX2,
                                       HEX1_DP, HEX1, HEX0_DP, HEX0}),  //              seg7_if_0_conduit_end.export

        .pio_wifi_reset_external_connection_export(pio_wifi_reset),     // pio_wifi_reset_external_connection.export
        .pio_led_external_connection_export(LEDR[3: 0]),
		.onchip_memory2_s2_address                      (address),                      //                       voice_ram_s1.address
		.onchip_memory2_s2_clken                        (1'b1),                        //                                   .clken
		.onchip_memory2_s2_chipselect                   (1'b0),                   //                                   .chipselect
		.onchip_memory2_s2_write                        (1'b0),                        //                                   .write
		.onchip_memory2_s2_readdata                     (readdata),                     //                                   .readdata
		.onchip_memory2_s2_writedata                    (writedata)               //        pio_led_external_connection.export
    );

// memory_init_fsm init(
// 	.clk(CLOCK_50), 
// 	.address(address), 
// 	.data(writedata), 
// 	.wren(wren), 
// 	.finish(finish), 
// 	.restart(1'b1)
// );

memory_read_fsm reader(
	.clk(CLOCK_50), 
	.address(address), 
	.data(writedata), 
	.read_data(readdata), 
	.finish(finish), 
	.restart(1'b1)
);


endmodule
