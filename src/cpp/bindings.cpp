// ================================================================
// Emscripten Bindings — Expose C++ OODP classes to JavaScript
// ================================================================
#include <emscripten/bind.h>
#include "BookingEngine.h"

using namespace emscripten;
using namespace RideFlow;

// Expose the BookingEngine class to JavaScript
EMSCRIPTEN_BINDINGS(ride_flow_module) {

    // Enum bindings
    enum_<VehicleType>("VehicleType")
        .value("BIKE", VehicleType::BIKE)
        .value("SCOOTER", VehicleType::SCOOTER)
        .value("ELECTRIC_BIKE", VehicleType::ELECTRIC_BIKE);

    enum_<BookingStatus>("BookingStatus")
        .value("PENDING", BookingStatus::PENDING)
        .value("CONFIRMED", BookingStatus::CONFIRMED)
        .value("IN_PROGRESS", BookingStatus::IN_PROGRESS)
        .value("COMPLETED", BookingStatus::COMPLETED)
        .value("CANCELLED", BookingStatus::CANCELLED);

    // BookingEngine — main facade exposed to JS
    class_<BookingEngine>("BookingEngine")
        .constructor<>()
        .function("validatePhone", &BookingEngine::validatePhone)
        .function("validateEmail", &BookingEngine::validateEmail)
        .function("calculateDistance", &BookingEngine::calculateDistance)
        .function("calculateFare", &BookingEngine::calculateFare)
        .function("estimateTimeMinutes", &BookingEngine::estimateTimeMinutes)
        .function("isBikeAvailable", &BookingEngine::isBikeAvailable)
        .function("generateBookingId", &BookingEngine::generateBookingId)
        .function("getFleetSize", &BookingEngine::getFleetSize)
        .function("getTotalBookings", &BookingEngine::getTotalBookings)
        .function("getAvailableVehiclesInfo", &BookingEngine::getAvailableVehiclesInfo)
        .function("getElectricBikeStatus", &BookingEngine::getElectricBikeStatus);
}
