// Module declaration
module 0x6b275e8c7d4fc98e2c61542e5366b9ee62178d7d7d477a2590b113c987eab1a6::counting {

    //simple
    struct Counter {
        count: u64
    }

    // Initialization
    public fun init_counter(): Counter {
        Counter {
            count: 0
        }
    }

    // current count
    public fun get_count(counter: &Counter): u64 {
        counter.count
    }

    // Incrementing
    public fun increment_counter(counter: &mut Counter) {
        counter.count = counter.count + 1;
    }

    public struct IncrementCounterPayload {
    // Example: Include an additional parameter named 'amount'
    amount: u64,
}


    public fun increment_counter_with_payload(counter: &mut Counter, payload: IncrementCounterPayload) {
        counter.count = counter.count + 1;
    }
}
