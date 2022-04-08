module memory_init_fsm(clk, address, data, wren, finish, restart);
    parameter IDLE = 5'b000_00;
    parameter NEW_ADDRESS = 5'b001_01;
    parameter WRITE_DATA = 5'b010_01;
	parameter WRITE_WAIT = 5'b100_01;
    parameter COMPLETE = 5'b011_10;
    parameter RESTART = 5'b111_00;


    reg [4:0] state;
     
     input clk, restart;
     output reg finish;
     output reg [9:0] address = 10'b0;
     output reg [7:0] data = 8'b0;
     output wren;
	  
     assign wren = state[0];
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
                state <= WRITE_DATA;
            end
            WRITE_DATA: begin
                state <= WRITE_WAIT;
            end
            WRITE_WAIT: begin
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
            WRITE_DATA: begin
                data <= address;
            end
            RESTART: begin
                address <= 10'b0;
                data <= 8'b0;
            end
            default: data = 8'bx;
        endcase
    end
endmodule