#include <emscripten/bind.h>
#include "BookingEngine.h"

using namespace emscripten;

// Expose the BookingEngine class to JavaScript
EMSCRIPTEN_BINDINGS(ride_flow_module) {
    class_<BookingEngine>("BookingEngine")
        .constructor<>()
        .function("validatePhone", &BookingEngine::validatePhone)
        .function("validateEmail", &BookingEngine::validateEmail)
        .function("calculateDistance", &BookingEngine::calculateDistance)
        .function("calculateFare", &BookingEngine::calculateFare)
        .function("estimateTimeMinutes", &BookingEngine::estimateTimeMinutes)
        .function("isBikeAvailable", &BookingEngine::isBikeAvailable)
        .function("generateBookingId", &BookingEngine::generateBookingId);
}
