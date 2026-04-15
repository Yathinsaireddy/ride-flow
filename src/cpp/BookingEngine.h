#ifndef BOOKING_ENGINE_H
#define BOOKING_ENGINE_H

#include <string>

class BookingEngine {
public:
    BookingEngine() = default;
    
    // Validation
    bool validatePhone(const std::string& number, const std::string& country);
    bool validateEmail(const std::string& email);
    
    // Calculations
    double calculateFare(double distanceKm, int riders, double baseRatePerKm);
    double calculateDistance(double lat1, double lon1, double lat2, double lon2);
    int estimateTimeMinutes(double distanceKm);
    
    // Business Logic
    bool isBikeAvailable(int bikeId, const std::string& timestamp);
    std::string generateBookingId();
};

#endif
