pragma circom 2.1.3;

include "../node_modules/circomlib/circuits/comparators.circom";

template SimpleSubstraction() {
    // Private input signals
    signal input in[2];

    // Output signal (public)
    signal output out;

    // Define the greater than and less than components
    component gte[2];
    component lte[2];

    // Loop through the two signals to compare them
    for (var i = 0; i < 2; i++) {
        // Ensure inputs are within a specific range [0, 5] using 3 bits (101)
        lte[i] = LessEqThan(3);
        lte[i].in[0] <== in[i];
        lte[i].in[1] <== 5;
        lte[i].out === 1;

        gte[i] = GreaterEqThan(3);
        gte[i].in[0] <== in[i];
        gte[i].in[1] <== 0;
        gte[i].out === 1;
    }

    // Perform the subtraction
    out <== in[0] - in[1];
}

component main = SimpleSubstraction();