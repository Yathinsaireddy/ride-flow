// ================================================================
// RideFlow Booking Engine — B.Tech 2nd Year OODP Concepts Demo
// ================================================================
#ifndef BOOKING_ENGINE_H
#define BOOKING_ENGINE_H

#include <string>
#include <vector>
#include <map>
#include <queue>
#include <stack>
#include <memory>
#include <iostream>
#include <sstream>
#include <fstream>
#include <algorithm>
#include <functional>
#include <stdexcept>
#include <cmath>
#include <regex>
#include <cstdlib>
#include <typeinfo>

// ======================== CONCEPT 1: Namespaces ========================
namespace RideFlow {

// ======================== CONCEPT 2: Enum Class ========================
enum class VehicleType { BIKE, SCOOTER, ELECTRIC_BIKE };
enum class BookingStatus { PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED };

inline std::string vehicleTypeToString(VehicleType t) {
    switch (t) {
        case VehicleType::BIKE:          return "Bike";
        case VehicleType::SCOOTER:       return "Scooter";
        case VehicleType::ELECTRIC_BIKE: return "Electric Bike";
        default: return "Unknown";
    }
}

inline std::string statusToString(BookingStatus s) {
    switch (s) {
        case BookingStatus::PENDING:     return "Pending";
        case BookingStatus::CONFIRMED:   return "Confirmed";
        case BookingStatus::IN_PROGRESS: return "In Progress";
        case BookingStatus::COMPLETED:   return "Completed";
        case BookingStatus::CANCELLED:   return "Cancelled";
        default: return "Unknown";
    }
}

// =============== CONCEPT 3: Custom Exception Hierarchy ================
class BookingException : public std::runtime_error {
public:
    explicit BookingException(const std::string& msg) : std::runtime_error(msg) {}
};

class InvalidInputException : public BookingException {
public:
    explicit InvalidInputException(const std::string& msg)
        : BookingException("Invalid Input: " + msg) {}
};

class VehicleUnavailableException : public BookingException {
public:
    explicit VehicleUnavailableException(int id)
        : BookingException("Vehicle #" + std::to_string(id) + " unavailable") {}
};

// ========== CONCEPT 4: Interface (Pure Abstract Class) =================
class ITrackable {
public:
    virtual double getLatitude() const = 0;
    virtual double getLongitude() const = 0;
    virtual std::string getLocation() const = 0;
    virtual ~ITrackable() = default;
};

class ISerializable {
public:
    virtual std::string serialize() const = 0;
    virtual ~ISerializable() = default;
};

// =============== CONCEPT 5: Function Template ==========================
template<typename T>
T findMax(T a, T b) { return (a > b) ? a : b; }

template<typename T>
T findMin(T a, T b) { return (a < b) ? a : b; }

// =============== CONCEPT 6: Class Template =============================
template<typename T>
class DataStore {
private:
    std::vector<T> items;
    std::string name;
public:
    explicit DataStore(const std::string& n = "store") : name(n) {}
    void add(const T& item) { items.push_back(item); }
    T& get(size_t i) {
        if (i >= items.size()) throw std::out_of_range("DataStore index OOB");
        return items[i];
    }
    size_t size() const { return items.size(); }
    void clear() { items.clear(); }
    typename std::vector<T>::iterator begin() { return items.begin(); }
    typename std::vector<T>::iterator end()   { return items.end(); }
    typename std::vector<T>::const_iterator begin() const { return items.begin(); }
    typename std::vector<T>::const_iterator end()   const { return items.end(); }
};

// ================================================================
// CONCEPT 7: Abstract Base Class + Virtual Functions + Encapsulation
// CONCEPT 8: Multiple Inheritance (Vehicle : ITrackable, ISerializable)
// CONCEPT 9: Static Members + this pointer + Const member functions
// ================================================================
class Vehicle : public ITrackable, public ISerializable {
private:   // Encapsulation – private data
    int id;
    std::string model;
    double latitude, longitude;

protected: // Encapsulation – protected for derived classes
    VehicleType type;
    double ratePerKm;
    bool available;
    static int totalVehicles;
    static int nextId;

public:
    // CONCEPT 10: Constructor Variants
    Vehicle();                                                        // Default
    Vehicle(const std::string& model, VehicleType type, double rate,  // Parameterized
            double lat = 0.0, double lon = 0.0);                      // Default args
    Vehicle(const Vehicle& other);             // Copy Constructor
    Vehicle(Vehicle&& other) noexcept;         // Move Constructor

    // CONCEPT 11: Virtual Destructor
    virtual ~Vehicle();

    // CONCEPT 12: Assignment Operators
    Vehicle& operator=(const Vehicle& other);
    Vehicle& operator=(Vehicle&& other) noexcept;

    // CONCEPT 13: Pure Virtual Functions (Abstraction / Runtime Polymorphism)
    virtual double calculateFare(double distKm) const = 0;
    virtual std::string getVehicleInfo() const = 0;
    virtual Vehicle* clone() const = 0;

    // CONCEPT 14: Virtual function with default implementation
    virtual double getSurgeMultiplier() const;

    // CONCEPT 15: Const Member Functions (Getters)
    int getId() const;
    std::string getModel() const;
    double getRatePerKm() const;
    bool isAvailable() const;
    VehicleType getType() const;

    // Setters
    void setAvailable(bool a);
    void setLocation(double lat, double lon);

    // CONCEPT 16: this pointer (returns *this for chaining)
    Vehicle& setModel(const std::string& m);

    // CONCEPT 17: Static Member Functions
    static int getTotalVehicles();

    // CONCEPT 18: Operator Overloading (==, <, >)
    bool operator==(const Vehicle& o) const;
    bool operator<(const Vehicle& o) const;
    bool operator>(const Vehicle& o) const;

    // ITrackable interface
    double getLatitude() const override;
    double getLongitude() const override;
    std::string getLocation() const override;

    // ISerializable interface
    std::string serialize() const override;

    // CONCEPT 19: Friend Function (operator<<)
    friend std::ostream& operator<<(std::ostream& os, const Vehicle& v);

    // CONCEPT 20: Friend Class
    friend class Fleet;
};

std::ostream& operator<<(std::ostream& os, const Vehicle& v);

// =================== CONCEPT 21: Single Inheritance ====================
class Bike : public Vehicle {
private:
    int gearCount;
    std::string frameType;
public:
    Bike();
    Bike(const std::string& model, double rate, int gears = 6,
         const std::string& frame = "Standard");
    Bike(const Bike& other);
    ~Bike() override;

    double calculateFare(double distKm) const override;
    std::string getVehicleInfo() const override;
    Vehicle* clone() const override;

    int getGearCount() const;
    std::string getFrameType() const;

    // CONCEPT 22: Function Overloading (compile-time polymorphism)
    double calculateFare(double distKm, int riders) const;
    double calculateFare(double distKm, int riders, double surge) const;
};

// ============= CONCEPT 23: Hierarchical Inheritance ====================
class Scooter : public Vehicle {
private:
    double engineCC;
    bool hasStorage;
public:
    Scooter();
    Scooter(const std::string& model, double rate, double cc, bool storage = true);
    ~Scooter() override;

    double calculateFare(double distKm) const override;
    std::string getVehicleInfo() const override;
    Vehicle* clone() const override;
    double getSurgeMultiplier() const override;

    double getEngineCC() const;
    bool getHasStorage() const;
};

// ============= CONCEPT 24: Multilevel Inheritance ======================
// ElectricBike -> Bike -> Vehicle
class ElectricBike : public Bike {
private:
    double batteryKWh;
    double rangeKm;
    int chargePercent;
public:
    ElectricBike();
    ElectricBike(const std::string& model, double rate, int gears,
                 double battery, double range);
    ~ElectricBike() override;

    double calculateFare(double distKm) const override;
    std::string getVehicleInfo() const override;
    Vehicle* clone() const override;

    double getBatteryCapacity() const;
    double getRange() const;
    int getChargePercent() const;
    void setChargePercent(int pct);
    bool canCompleteTrip(double distKm) const;
};

// =================== CONCEPT 25: Composition ===========================
class Rider {
private:
    std::string name, phone, email;
    double rating;
    int totalRides;
public:
    Rider();
    Rider(const std::string& n, const std::string& p, const std::string& e);
    std::string getName() const;
    std::string getPhone() const;
    std::string getEmail() const;
    double getRating() const;
    int getTotalRides() const;
    void updateRating(double r);
    void incrementRides();
    bool operator==(const Rider& o) const;
    friend std::ostream& operator<<(std::ostream& os, const Rider& r);
};
std::ostream& operator<<(std::ostream& os, const Rider& r);

// ========= CONCEPT 26: Composition + Smart Pointers + Static ==========
class Booking {
private:
    std::string bookingId;
    Rider rider;                           // Composition
    std::shared_ptr<Vehicle> vehicle;      // CONCEPT 27: Smart Pointer
    BookingStatus status;
    double pickupLat, pickupLon, dropLat, dropLon;
    double distance, fare;
    static int counter;
public:
    Booking();
    Booking(const Rider& r, std::shared_ptr<Vehicle> v,
            double pLat, double pLon, double dLat, double dLon);
    std::string getBookingId() const;
    BookingStatus getStatus() const;
    std::string getStatusStr() const;
    double getFare() const;
    double getDistance() const;
    std::string getRiderName() const;
    std::string getVehicleInfo() const;
    void confirm();
    void startRide();
    void completeRide();
    void cancel();

    // CONCEPT 28: Operator Overloading (+)
    Booking operator+(const Booking& o) const;
    friend std::ostream& operator<<(std::ostream& os, const Booking& b);
    static std::string generateId();
    static int getTotalBookings();
};
std::ostream& operator<<(std::ostream& os, const Booking& b);

// ===== CONCEPT 29: Aggregation + STL (vector, map, queue, stack) =======
class Fleet {
private:
    std::string fleetName;
    std::vector<std::shared_ptr<Vehicle>> vehicles;       // STL vector
    std::map<int, std::shared_ptr<Vehicle>> vehicleMap;   // STL map
    std::queue<Booking> pendingBookings;                   // STL queue
    std::stack<std::string> actionHistory;                 // STL stack
public:
    Fleet();
    explicit Fleet(const std::string& name);
    void addVehicle(std::shared_ptr<Vehicle> v);
    void removeVehicle(int id);
    std::shared_ptr<Vehicle> findVehicle(int id) const;

    // CONCEPT 30: STL Algorithms + Lambda Expressions
    std::vector<std::shared_ptr<Vehicle>> getAvailableVehicles() const;
    std::vector<std::shared_ptr<Vehicle>> getVehiclesByType(VehicleType t) const;
    std::shared_ptr<Vehicle> findCheapestVehicle() const;
    std::shared_ptr<Vehicle> findNearestVehicle(double lat, double lon) const;
    void sortVehiclesByRate();

    void enqueueBooking(const Booking& b);
    Booking dequeueBooking();
    bool hasPendingBookings() const;
    void pushAction(const std::string& a);
    std::string popAction();
    size_t getFleetSize() const;
    std::string getFleetName() const;

    // CONCEPT 31: File I/O (fstream)
    void saveFleetToFile(const std::string& filename) const;

    // CONCEPT 32: Iterators + range-based for
    void displayAllVehicles() const;
};

// ================================================================
// BookingEngine — Facade wrapping all concepts, exposed to JS
// ================================================================
class BookingEngine {
private:
    Fleet fleet;
    DataStore<Booking> bookingHistory;
    std::vector<Rider> riders;

    // CONCEPT 33: Inline function + Default arguments
    inline double applyDiscount(double fare, double pct = 0.0) const {
        return fare * (1.0 - pct / 100.0);
    }

public:
    BookingEngine();

    // Original methods kept for JS bindings
    bool validatePhone(const std::string& number, const std::string& country);
    bool validateEmail(const std::string& email);
    double calculateDistance(double lat1, double lon1, double lat2, double lon2);
    double calculateFare(double distanceKm, int riders, double baseRatePerKm);
    int estimateTimeMinutes(double distanceKm);
    bool isBikeAvailable(int bikeId, const std::string& timestamp);
    std::string generateBookingId();

    // Enhanced methods
    void registerRider(const std::string& n, const std::string& p, const std::string& e);
    void addVehicleToFleet(std::shared_ptr<Vehicle> v);
    int getFleetSize() const;
    int getTotalBookings() const;
    std::string getAvailableVehiclesInfo() const;

    // CONCEPT 34: dynamic_cast for RTTI
    std::string getElectricBikeStatus(int vehicleId) const;

    // CONCEPT 35: File I/O logging
    void logBooking(const std::string& id, const std::string& details) const;

    // CONCEPT 36: Exception handling demonstration
    std::string createBooking(const std::string& riderPhone, int vehicleId,
                              double pLat, double pLon, double dLat, double dLon);
};

} // namespace RideFlow
#endif
