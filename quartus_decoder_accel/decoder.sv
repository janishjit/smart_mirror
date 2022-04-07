module decoder(input logic CLOCK_50,
               input logic start,
			   input logic reset,
			   output logic finish);

mem_in mem_in_inst (.address(address_in),
					.clock(CLOCK_50),
					.data(data_in),
					.wren(wren_in),
					.q(q_in) );
					
mem_out mem_out_inst (.address(address_out),
					.clock(CLOCK_50),
					.data(data_out),
					.wren(wren_out),
					.q(q_out) );

logic [14:0] address_in;
logic [9:0] address_out;
logic [7:0] data_in;
logic [7:0] data_out;
logic wren_in;
logic wren_out;
logic [7:0] q_in;
logic [7:0] q_out;

logic [4:0] state;
logic [14:0] R_ADDR = 15'd0; //addr for reading values
logic [9:0] W_ADDR = 10'd0; //addr for writing index
logic [5:0] i = 6'd0; //outer loop (LOOP2) index
logic [7:0] max = 8'd0;
logic [7:0] value = 8'd0;
logic [7:0] curr_index = 8'd0;
logic [7:0] max_index = 8'd0;

parameter TOTAL_VAL = 6'd10; //total number of index needed to output

//states
parameter [4:0] IDLE = 5'd0;
parameter [4:0] START = 5'd1;
parameter [4:0] LOOP1_START = 5'd2;
parameter [4:0] LOOP1 = 5'd3;
parameter [4:0] LOOP2_START = 5'd4;
parameter [4:0] LOOP2 = 5'd5;
parameter [4:0] READ_VAL = 5'd6;
parameter [4:0] READ_VAL_WAIT = 5'd7;
parameter [4:0] GET_VAL = 5'd8;
parameter [4:0] LOOP2_COMP = 5'd9;
parameter [4:0] UPDATE_MAX = 5'd10;
parameter [4:0] LOOP2_INC = 5'd11;
parameter [4:0] WRITE_INDEX = 5'd12;
parameter [4:0] WAIT_WRITE = 5'd13;
parameter [4:0] WAIT_WRITE2 = 5'd14;
parameter [4:0] INC_W_ADDR = 5'd15;
parameter [4:0] LOOP1_INC = 5'd16;
parameter [4:0] FINISH = 5'd17;

always_ff @(posedge CLOCK_50 or posedge reset) begin
if(reset) state <= IDLE;
else begin
	case(state)
		IDLE: if(start) state <= START;
		START: begin
			finish <= 1'b0;
			R_ADDR <= 15'd0;
			W_ADDR <= 10'd0;
			state <= LOOP1_START;
		end
		LOOP1_START: begin
			i <= 6'd0;
			state <= LOOP1;
		end
		LOOP1: begin
			max <= 8'd0;
			max_index <= 8'd0;
			state <= LOOP2_START;
		end
		LOOP2_START: begin
			curr_index <= 0;
			state <= LOOP2;
		end
		LOOP2: begin
			address_in <= R_ADDR;
			wren_in <= 0;
			state <= READ_VAL;
		end
		READ_VAL: begin
			state <= READ_VAL_WAIT;
		end
		READ_VAL_WAIT: begin
			state <= GET_VAL;
		end
		GET_VAL: begin
			value <= q_in;
			state <= LOOP2_COMP;
		end
		LOOP2_COMP: begin
			if(value > max) state <= UPDATE_MAX;
			else state <= LOOP2_INC;
		end
		UPDATE_MAX: begin
			max <= value;
			max_index <= curr_index;
			state <= LOOP2_INC;
		end
		LOOP2_INC: begin
			curr_index <= curr_index + 1'b1;
			R_ADDR <= R_ADDR + 15'd1;
			if(curr_index >= 6'd31) state <= WRITE_INDEX;
			else state <= LOOP2;
		end
		WRITE_INDEX: begin
			data_out <= max_index;
			address_out <= W_ADDR;
			wren_out <= 1;
			state <= WAIT_WRITE;
		end
		WAIT_WRITE: begin
			state <= WAIT_WRITE2;
		end
		WAIT_WRITE2:
			state <= INC_W_ADDR;
		INC_W_ADDR: begin
			wren_out <= 0;
			W_ADDR <= W_ADDR + 10'd1;
			state <= LOOP1_INC;
		end
		LOOP1_INC: begin
			i <= i + 1'b1;
			if(i >= TOTAL_VAL - 1'b1) state <= FINISH;
			else state <= LOOP1;
		end
		FINISH: begin
			finish <= 1'b1;
			state <= IDLE;
		end
		default: state <= IDLE;
	endcase
end
end

endmodule

//Find the max index every 32 values and write it to another memory

// R_ADDR=0
// W_ADDR=0
// for i=0, i<TOTAL_VAL, i++
// 	max=0
// 	for curr_index=0, curr_index<32, curr_index++
// 		read value
// 		if value>max:
// 			max=value
// 			max_index=curr_index
// 		R_ADDR+=8
	
// 	write max_index to mem_out at W_ADDR
// 	W_ADDR+=8