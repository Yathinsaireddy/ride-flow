#include "BookingEngine.h"
#include <cmath>
#include <regex>

bool BookingEngine::validatePhone(const std::string& number, const std::string& country) {
    if (country == "IN") {
        // Indian phone format (simplified): optional +91 followed by 10 digits
        std::regex re("^(\\+91[\\-\\s]?)?[0-9]{10}$");
        return std::regex_match(number, re);
    }
    // Default fallback
    return number.length() >= 10;
}

bool BookingEngine::validateEmail(const std::string& email) {
    // Basic RFC 5322 regex approximation in C++
    std::regex re("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$");
    return std::regex_match(email, re);
}

double BookingEngine::calculateDistance(double lat1, double lon1, double lat2, double lon2) {
    // Haversine formula
    const double R = 6371.0; // Earth radius in km
    const double PI = 3.14159265358979323846;
    
    double dLat = (lat2 - lat1) * PI / 180.0;
    double dLon = (lon2 - lon1) * PI / 180.0;
    
    double a = std::sin(dLat / 2.0) * std::sin(dLat / 2.0) +
               std::cos(lat1 * PI / 180.0) * std::cos(lat2 * PI / 180.0) *
               std::sin(dLon / 2.0) * std::sin(dLon / 2.0);
               
    double c = 2.0 * std::atan2(std::sqrt(a), std::sqrt(1.0 - a));
    return R * c;
}

double BookingEngine::calculateFare(double distanceKm, int riders, double baseRatePerKm) {
    double baseFare = 30.0;
    double totalFare = baseFare + (baseRatePerKm * distanceKm);
    
    // Surge / capacity modifiers (example logic)
    if (riders > 1) {
        totalFare *= 1.2; // 20% surge for second rider
    }
    
    return totalFare;
}

int BookingEngine::estimateTimeMinutes(double distanceKm) {
    // Assumes 25 km/h urban average speed
    double timeHours = distanceKm / 25.0;
    return static_cast<int>(std::ceil(timeHours * 60.0));
}

bool BookingEngine::isBikeAvailable(int bikeId, const std::string& timestamp) {
    // Example placeholder logic
    return true;
}

std::string BookingEngine::generateBookingId() {
    // Simple mock random generation
    return "BK" + std::to_string(rand() % 10000 + 1000);
}
