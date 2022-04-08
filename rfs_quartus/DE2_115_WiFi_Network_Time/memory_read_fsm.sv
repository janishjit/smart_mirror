module memory_read_fsm(clk, address, data, read_data, finish, restart);
    parameter IDLE = 5'b000_00;
    parameter NEW_ADDRESS = 5'b001_01;
    parameter READ_DATA = 5'b010_01;
	parameter READ_WAIT = 5'b000_01;
    parameter COMPLETE = 5'b011_10;
    parameter RESTART = 5'b011_00;


    reg [4:0] state;
     
     input clk, restart;
     output reg finish;
     output reg [7:0] address = 8'b0;
     output reg [7:0] data = 8'b0;
     input reg [7:0] read_data;
	  
     assign finish = state[1];
    
    //state logic
    always_ff @( posedge clk ) begin
        case (state)
            IDLE: begin
                if(address != 10'b11111111) state <= NEW_ADDRESS;
                else if (address == 10'b11111111) state <= COMPLETE;
                else state <= IDLE;
            end 
            NEW_ADDRESS: begin
                state <= READ_DATA;
            end
            READ_DATA: begin
                state <= READ_WAIT;
            end
            READ_WAIT: begin
                state <= IDLE;
            end
            COMPLETE: begin
                if (restart) state <= RESTART;
                else state <= COMPLETE;
            end
            RESTART: begin
                state <= IDLE;
            end
            default: state <= IDLE; 
        endcase
    end
    
    //output logic
    always_ff @( posedge clk ) begin
        case (state) 
            NEW_ADDRESS: begin
                address <= address + 10'b00000001;
            end 
            READ_DATA: begin
                data <= read_data;
            end
            RESTART: begin
                address <= 10'b0;
                data <= 8'b0;
            end
            default: data = 8'bx;
        endcase
    end
endmodule