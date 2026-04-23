// ================================================================
// BookingEngine.cpp — Full OODP Concepts Implementation
// ================================================================
#include "BookingEngine.h"

namespace RideFlow {

// ======================== Static Member Initialization ========================
int Vehicle::totalVehicles = 0;
int Vehicle::nextId = 1;
int Booking::counter = 0;

// ================================================================
//  VEHICLE — Abstract Base Class Implementation
// ================================================================

// CONCEPT 10a: Default Constructor
Vehicle::Vehicle()
    : id(nextId++), model("Unknown"), latitude(0), longitude(0),
      type(VehicleType::BIKE), ratePerKm(5.0), available(true) {
    totalVehicles++;
}

// CONCEPT 10b: Parameterized Constructor with Initializer List + Default Arguments
Vehicle::Vehicle(const std::string& model, VehicleType type, double rate,
                 double lat, double lon)
    : id(nextId++), model(model), latitude(lat), longitude(lon),
      type(type), ratePerKm(rate), available(true) {
    totalVehicles++;
}

// CONCEPT 10c: Copy Constructor
Vehicle::Vehicle(const Vehicle& other)
    : id(nextId++), model(other.model), latitude(other.latitude),
      longitude(other.longitude), type(other.type),
      ratePerKm(other.ratePerKm), available(other.available) {
    totalVehicles++;
}

// CONCEPT 10d: Move Constructor (Move Semantics, rvalue reference)
Vehicle::Vehicle(Vehicle&& other) noexcept
    : id(other.id), model(std::move(other.model)),
      latitude(other.latitude), longitude(other.longitude),
      type(other.type), ratePerKm(other.ratePerKm), available(other.available) {
    other.id = -1;
    other.available = false;
}

// CONCEPT 11: Virtual Destructor
Vehicle::~Vehicle() {
    if (id != -1) totalVehicles--;
}

// CONCEPT 12: Copy Assignment Operator
Vehicle& Vehicle::operator=(const Vehicle& other) {
    if (this != &other) {   // self-assignment check using 'this' pointer
        model = other.model;
        latitude = other.latitude;
        longitude = other.longitude;
        type = other.type;
        ratePerKm = other.ratePerKm;
        available = other.available;
    }
    return *this;  // return *this for chaining
}

// CONCEPT 13: Move Assignment Operator
Vehicle& Vehicle::operator=(Vehicle&& other) noexcept {
    if (this != &other) {
        model = std::move(other.model);
        latitude = other.latitude;
        longitude = other.longitude;
        type = other.type;
        ratePerKm = other.ratePerKm;
        available = other.available;
        other.id = -1;
        other.available = false;
    }
    return *this;
}

// CONCEPT 14: Virtual function with default implementation
double Vehicle::getSurgeMultiplier() const { return 1.0; }

// CONCEPT 15: Const Member Functions (Getters)
int Vehicle::getId() const { return id; }
std::string Vehicle::getModel() const { return model; }
double Vehicle::getRatePerKm() const { return ratePerKm; }
bool Vehicle::isAvailable() const { return available; }
VehicleType Vehicle::getType() const { return type; }

void Vehicle::setAvailable(bool a) { available = a; }
void Vehicle::setLocation(double lat, double lon) {
    latitude = lat;
    longitude = lon;
}

// CONCEPT 16: this pointer for method chaining
Vehicle& Vehicle::setModel(const std::string& m) {
    this->model = m;   // explicit this pointer usage
    return *this;       // return reference for chaining
}

// CONCEPT 17: Static Member Function
int Vehicle::getTotalVehicles() { return totalVehicles; }

// CONCEPT 18: Operator Overloading (==, <, >)
bool Vehicle::operator==(const Vehicle& o) const { return id == o.id; }
bool Vehicle::operator<(const Vehicle& o) const { return ratePerKm < o.ratePerKm; }
bool Vehicle::operator>(const Vehicle& o) const { return ratePerKm > o.ratePerKm; }

// ITrackable interface implementation
double Vehicle::getLatitude() const { return latitude; }
double Vehicle::getLongitude() const { return longitude; }
std::string Vehicle::getLocation() const {
    return "(" + std::to_string(latitude) + ", " + std::to_string(longitude) + ")";
}

// ISerializable interface implementation
std::string Vehicle::serialize() const {
    std::ostringstream oss;
    oss << id << "|" << model << "|" << static_cast<int>(type)
        << "|" << ratePerKm << "|" << available
        << "|" << latitude << "|" << longitude;
    return oss.str();
}

// CONCEPT 19: Friend Function — operator<< overloading
std::ostream& operator<<(std::ostream& os, const Vehicle& v) {
    os << "[Vehicle #" << v.id << "] " << v.model
       << " | Type: " << vehicleTypeToString(v.type)
       << " | Rate: Rs." << v.ratePerKm << "/km"
       << " | " << (v.available ? "Available" : "Unavailable");
    return os;
}

// ================================================================
//  BIKE — Single Inheritance from Vehicle
// ================================================================

Bike::Bike() : Vehicle(), gearCount(6), frameType("Standard") {
    type = VehicleType::BIKE;
}

Bike::Bike(const std::string& model, double rate, int gears, const std::string& frame)
    : Vehicle(model, VehicleType::BIKE, rate), gearCount(gears), frameType(frame) {}

Bike::Bike(const Bike& other)
    : Vehicle(other), gearCount(other.gearCount), frameType(other.frameType) {}

Bike::~Bike() {}

// Runtime Polymorphism — overriding pure virtual
double Bike::calculateFare(double distKm) const {
    double base = 20.0;
    return base + (ratePerKm * distKm * getSurgeMultiplier());
}

std::string Bike::getVehicleInfo() const {
    std::ostringstream oss;
    oss << "Bike: " << getModel() << " | " << gearCount
        << " gears | Frame: " << frameType;
    return oss.str();
}

Vehicle* Bike::clone() const { return new Bike(*this); }

int Bike::getGearCount() const { return gearCount; }
std::string Bike::getFrameType() const { return frameType; }

// CONCEPT 22: Function Overloading (Compile-time Polymorphism)
double Bike::calculateFare(double distKm, int riders) const {
    double fare = calculateFare(distKm);
    if (riders > 1) fare *= 1.2;  // 20% surcharge
    return fare;
}

double Bike::calculateFare(double distKm, int riders, double surge) const {
    double fare = calculateFare(distKm, riders);
    return fare * surge;
}

// ================================================================
//  SCOOTER — Hierarchical Inheritance (another child of Vehicle)
// ================================================================

Scooter::Scooter() : Vehicle(), engineCC(110.0), hasStorage(true) {
    type = VehicleType::SCOOTER;
}

Scooter::Scooter(const std::string& model, double rate, double cc, bool storage)
    : Vehicle(model, VehicleType::SCOOTER, rate), engineCC(cc), hasStorage(storage) {}

Scooter::~Scooter() {}

double Scooter::calculateFare(double distKm) const {
    double base = 25.0;
    return base + (ratePerKm * distKm * getSurgeMultiplier());
}

std::string Scooter::getVehicleInfo() const {
    std::ostringstream oss;
    oss << "Scooter: " << getModel() << " | " << engineCC
        << "cc | Storage: " << (hasStorage ? "Yes" : "No");
    return oss.str();
}

Vehicle* Scooter::clone() const { return new Scooter(*this); }

// Override virtual function — different surge for scooters
double Scooter::getSurgeMultiplier() const { return 1.15; }

double Scooter::getEngineCC() const { return engineCC; }
bool Scooter::getHasStorage() const { return hasStorage; }

// ================================================================
//  ELECTRIC BIKE — Multilevel Inheritance (ElectricBike -> Bike -> Vehicle)
// ================================================================

ElectricBike::ElectricBike()
    : Bike(), batteryKWh(2.0), rangeKm(80.0), chargePercent(100) {
    type = VehicleType::ELECTRIC_BIKE;
}

ElectricBike::ElectricBike(const std::string& model, double rate, int gears,
                           double battery, double range)
    : Bike(model, rate, gears, "Carbon"), batteryKWh(battery),
      rangeKm(range), chargePercent(100) {
    type = VehicleType::ELECTRIC_BIKE;
}

ElectricBike::~ElectricBike() {}

double ElectricBike::calculateFare(double distKm) const {
    double base = 15.0;  // eco discount
    double ecoFactor = 0.9;
    return base + (ratePerKm * distKm * ecoFactor * getSurgeMultiplier());
}

std::string ElectricBike::getVehicleInfo() const {
    std::ostringstream oss;
    oss << "E-Bike: " << getModel() << " | Battery: " << batteryKWh
        << "kWh | Range: " << rangeKm << "km | Charge: " << chargePercent << "%";
    return oss.str();
}

Vehicle* ElectricBike::clone() const { return new ElectricBike(*this); }

double ElectricBike::getBatteryCapacity() const { return batteryKWh; }
double ElectricBike::getRange() const { return rangeKm; }
int ElectricBike::getChargePercent() const { return chargePercent; }
void ElectricBike::setChargePercent(int pct) {
    chargePercent = findMax(0, findMin(100, pct));  // template function usage
}
bool ElectricBike::canCompleteTrip(double distKm) const {
    double effectiveRange = rangeKm * (chargePercent / 100.0);
    return distKm <= effectiveRange;
}

// ================================================================
//  RIDER — Composition component
// ================================================================

Rider::Rider() : name(""), phone(""), email(""), rating(5.0), totalRides(0) {}

Rider::Rider(const std::string& n, const std::string& p, const std::string& e)
    : name(n), phone(p), email(e), rating(5.0), totalRides(0) {}

std::string Rider::getName() const { return name; }
std::string Rider::getPhone() const { return phone; }
std::string Rider::getEmail() const { return email; }
double Rider::getRating() const { return rating; }
int Rider::getTotalRides() const { return totalRides; }

void Rider::updateRating(double r) {
    rating = (rating * totalRides + r) / (totalRides + 1);
}

void Rider::incrementRides() { totalRides++; }

bool Rider::operator==(const Rider& o) const { return phone == o.phone; }

std::ostream& operator<<(std::ostream& os, const Rider& r) {
    os << "Rider: " << r.name << " | Phone: " << r.phone
       << " | Rating: " << r.rating << "/5";
    return os;
}

// ================================================================
//  BOOKING — Composition + Smart Pointers + Operator Overloading
// ================================================================

Booking::Booking()
    : bookingId(""), rider(), vehicle(nullptr), status(BookingStatus::PENDING),
      pickupLat(0), pickupLon(0), dropLat(0), dropLon(0),
      distance(0), fare(0) {}

Booking::Booking(const Rider& r, std::shared_ptr<Vehicle> v,
                 double pLat, double pLon, double dLat, double dLon)
    : bookingId(generateId()), rider(r), vehicle(v),
      status(BookingStatus::PENDING),
      pickupLat(pLat), pickupLon(pLon), dropLat(dLat), dropLon(dLon) {
    // Haversine distance calculation
    const double R = 6371.0, PI = 3.14159265358979323846;
    double dLa = (dLat - pLat) * PI / 180.0;
    double dLo = (dLon - pLon) * PI / 180.0;
    double a = std::sin(dLa/2)*std::sin(dLa/2) +
               std::cos(pLat*PI/180)*std::cos(dLat*PI/180)*
               std::sin(dLo/2)*std::sin(dLo/2);
    distance = R * 2.0 * std::atan2(std::sqrt(a), std::sqrt(1-a));
    fare = vehicle ? vehicle->calculateFare(distance) : 0.0;
}

std::string Booking::getBookingId() const { return bookingId; }
BookingStatus Booking::getStatus() const { return status; }
std::string Booking::getStatusStr() const { return statusToString(status); }
double Booking::getFare() const { return fare; }
double Booking::getDistance() const { return distance; }
std::string Booking::getRiderName() const { return rider.getName(); }
std::string Booking::getVehicleInfo() const {
    return vehicle ? vehicle->getVehicleInfo() : "No vehicle";
}

void Booking::confirm() {
    if (status != BookingStatus::PENDING)
        throw BookingException("Cannot confirm — not in PENDING state");
    status = BookingStatus::CONFIRMED;
}

void Booking::startRide() {
    if (status != BookingStatus::CONFIRMED)
        throw BookingException("Cannot start — not CONFIRMED");
    status = BookingStatus::IN_PROGRESS;
    if (vehicle) vehicle->setAvailable(false);
}

void Booking::completeRide() {
    if (status != BookingStatus::IN_PROGRESS)
        throw BookingException("Cannot complete — not IN_PROGRESS");
    status = BookingStatus::COMPLETED;
    if (vehicle) vehicle->setAvailable(true);
}

void Booking::cancel() {
    if (status == BookingStatus::COMPLETED)
        throw BookingException("Cannot cancel a completed ride");
    status = BookingStatus::CANCELLED;
    if (vehicle) vehicle->setAvailable(true);
}

// CONCEPT 28: Operator+ overloading (combine fares)
Booking Booking::operator+(const Booking& o) const {
    Booking combined;
    combined.fare = this->fare + o.fare;
    combined.distance = this->distance + o.distance;
    combined.bookingId = "COMBO-" + this->bookingId + "-" + o.bookingId;
    return combined;
}

std::ostream& operator<<(std::ostream& os, const Booking& b) {
    os << "Booking [" << b.bookingId << "] " << b.rider.getName()
       << " | Status: " << statusToString(b.status)
       << " | Fare: Rs." << b.fare
       << " | Distance: " << b.distance << "km";
    return os;
}

std::string Booking::generateId() {
    return "RF" + std::to_string(++counter * 1000 + rand() % 999);
}

int Booking::getTotalBookings() { return counter; }

// ================================================================
//  FLEET — Aggregation + STL Containers + Algorithms + Lambdas
// ================================================================

Fleet::Fleet() : fleetName("Default Fleet") {}
Fleet::Fleet(const std::string& name) : fleetName(name) {}

void Fleet::addVehicle(std::shared_ptr<Vehicle> v) {
    vehicles.push_back(v);
    vehicleMap[v->getId()] = v;
    pushAction("Added vehicle #" + std::to_string(v->getId()));
}

void Fleet::removeVehicle(int id) {
    // CONCEPT 30: STL algorithm + Lambda Expression
    vehicles.erase(
        std::remove_if(vehicles.begin(), vehicles.end(),
            [id](const std::shared_ptr<Vehicle>& v) { return v->getId() == id; }),
        vehicles.end()
    );
    vehicleMap.erase(id);
    pushAction("Removed vehicle #" + std::to_string(id));
}

std::shared_ptr<Vehicle> Fleet::findVehicle(int id) const {
    auto it = vehicleMap.find(id);  // STL map find
    if (it != vehicleMap.end()) return it->second;
    return nullptr;
}

// Lambda with std::copy_if
std::vector<std::shared_ptr<Vehicle>> Fleet::getAvailableVehicles() const {
    std::vector<std::shared_ptr<Vehicle>> result;
    std::copy_if(vehicles.begin(), vehicles.end(), std::back_inserter(result),
        [](const std::shared_ptr<Vehicle>& v) { return v->isAvailable(); });
    return result;
}

// Lambda with capture
std::vector<std::shared_ptr<Vehicle>> Fleet::getVehiclesByType(VehicleType t) const {
    std::vector<std::shared_ptr<Vehicle>> result;
    std::copy_if(vehicles.begin(), vehicles.end(), std::back_inserter(result),
        [t](const std::shared_ptr<Vehicle>& v) { return v->getType() == t; });
    return result;
}

// STL min_element + Lambda
std::shared_ptr<Vehicle> Fleet::findCheapestVehicle() const {
    auto avail = getAvailableVehicles();
    if (avail.empty()) return nullptr;
    auto it = std::min_element(avail.begin(), avail.end(),
        [](const std::shared_ptr<Vehicle>& a, const std::shared_ptr<Vehicle>& b) {
            return a->getRatePerKm() < b->getRatePerKm();
        });
    return *it;
}

// Lambda with capture by value
std::shared_ptr<Vehicle> Fleet::findNearestVehicle(double lat, double lon) const {
    auto avail = getAvailableVehicles();
    if (avail.empty()) return nullptr;
    auto it = std::min_element(avail.begin(), avail.end(),
        [lat, lon](const std::shared_ptr<Vehicle>& a, const std::shared_ptr<Vehicle>& b) {
            double dA = std::hypot(a->getLatitude() - lat, a->getLongitude() - lon);
            double dB = std::hypot(b->getLatitude() - lat, b->getLongitude() - lon);
            return dA < dB;
        });
    return *it;
}

// STL sort + Lambda
void Fleet::sortVehiclesByRate() {
    std::sort(vehicles.begin(), vehicles.end(),
        [](const std::shared_ptr<Vehicle>& a, const std::shared_ptr<Vehicle>& b) {
            return a->getRatePerKm() < b->getRatePerKm();
        });
}

// STL Queue operations
void Fleet::enqueueBooking(const Booking& b) { pendingBookings.push(b); }
Booking Fleet::dequeueBooking() {
    if (pendingBookings.empty()) throw BookingException("No pending bookings");
    Booking b = pendingBookings.front();
    pendingBookings.pop();
    return b;
}
bool Fleet::hasPendingBookings() const { return !pendingBookings.empty(); }

// STL Stack operations
void Fleet::pushAction(const std::string& a) { actionHistory.push(a); }
std::string Fleet::popAction() {
    if (actionHistory.empty()) return "";
    std::string a = actionHistory.top();
    actionHistory.pop();
    return a;
}

size_t Fleet::getFleetSize() const { return vehicles.size(); }
std::string Fleet::getFleetName() const { return fleetName; }

// CONCEPT 32: Iterators + range-based for loop
void Fleet::displayAllVehicles() const {
    for (const auto& v : vehicles) {   // range-based for with auto
        std::cout << *v << std::endl;  // uses friend operator<<
    }
}

// CONCEPT 31: File I/O (fstream)
void Fleet::saveFleetToFile(const std::string& filename) const {
    std::ofstream file(filename);
    if (!file.is_open())
        throw BookingException("Cannot open file: " + filename);
    for (const auto& v : vehicles) {
        file << v->serialize() << "\n";
    }
    file.close();
}

// ================================================================
//  BOOKING ENGINE — Facade, original + enhanced methods
// ================================================================

BookingEngine::BookingEngine()
    : fleet("RideFlow Fleet"), bookingHistory("BookingHistory") {
    // Seed random for ID generation
    std::srand(static_cast<unsigned>(42));
}

bool BookingEngine::validatePhone(const std::string& number, const std::string& country) {
    if (country == "IN") {
        std::regex re("^(\\+91[\\-\\s]?)?[0-9]{10}$");
        return std::regex_match(number, re);
    }
    return number.length() >= 10;
}

bool BookingEngine::validateEmail(const std::string& email) {
    std::regex re("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$");
    return std::regex_match(email, re);
}

double BookingEngine::calculateDistance(double lat1, double lon1, double lat2, double lon2) {
    const double R = 6371.0, PI = 3.14159265358979323846;
    double dLat = (lat2 - lat1) * PI / 180.0;
    double dLon = (lon2 - lon1) * PI / 180.0;
    double a = std::sin(dLat/2)*std::sin(dLat/2) +
               std::cos(lat1*PI/180)*std::cos(lat2*PI/180)*
               std::sin(dLon/2)*std::sin(dLon/2);
    return R * 2.0 * std::atan2(std::sqrt(a), std::sqrt(1-a));
}

double BookingEngine::calculateFare(double distanceKm, int riders, double baseRatePerKm) {
    double baseFare = 30.0;
    double totalFare = baseFare + (baseRatePerKm * distanceKm);
    if (riders > 1) totalFare *= 1.2;
    return applyDiscount(totalFare);  // inline function + default arg
}

int BookingEngine::estimateTimeMinutes(double distanceKm) {
    double timeHours = distanceKm / 25.0;
    return static_cast<int>(std::ceil(timeHours * 60.0));  // static_cast
}

bool BookingEngine::isBikeAvailable(int bikeId, const std::string& timestamp) {
    auto v = fleet.findVehicle(bikeId);
    if (v) return v->isAvailable();
    return false;
}

std::string BookingEngine::generateBookingId() {
    return Booking::generateId();
}

void BookingEngine::registerRider(const std::string& n, const std::string& p,
                                  const std::string& e) {
    // CONCEPT 36: Exception Handling (try-catch-throw)
    try {
        if (p.empty()) throw InvalidInputException("Phone cannot be empty");
        if (!validateEmail(e)) throw InvalidInputException("Invalid email: " + e);
        riders.emplace_back(n, p, e);
    } catch (const InvalidInputException& ex) {
        std::cerr << "Registration failed: " << ex.what() << std::endl;
        throw;  // re-throw
    }
}

void BookingEngine::addVehicleToFleet(std::shared_ptr<Vehicle> v) {
    fleet.addVehicle(v);
}

int BookingEngine::getFleetSize() const {
    return static_cast<int>(fleet.getFleetSize());
}

int BookingEngine::getTotalBookings() const {
    return static_cast<int>(bookingHistory.size());
}

std::string BookingEngine::getAvailableVehiclesInfo() const {
    auto available = fleet.getAvailableVehicles();
    std::ostringstream oss;
    oss << "Available Vehicles (" << available.size() << "):\n";
    // CONCEPT 32: Range-based for + auto
    for (const auto& v : available) {
        oss << "  " << v->getVehicleInfo() << "\n";
    }
    return oss.str();
}

// CONCEPT 34: dynamic_cast for Runtime Type Identification (RTTI)
std::string BookingEngine::getElectricBikeStatus(int vehicleId) const {
    auto v = fleet.findVehicle(vehicleId);
    if (!v) return "Vehicle not found";

    // dynamic_cast to check if vehicle is an ElectricBike
    ElectricBike* eb = dynamic_cast<ElectricBike*>(v.get());
    if (eb) {
        std::ostringstream oss;
        oss << "E-Bike #" << eb->getId()
            << " | Charge: " << eb->getChargePercent() << "%"
            << " | Range: " << eb->getRange() << "km"
            << " | Battery: " << eb->getBatteryCapacity() << "kWh";
        return oss.str();
    }
    return "Vehicle #" + std::to_string(vehicleId) + " is not an Electric Bike";
}

// CONCEPT 35: File I/O for logging
void BookingEngine::logBooking(const std::string& id, const std::string& details) const {
    std::ofstream logFile("booking_log.txt", std::ios::app);  // append mode
    if (logFile.is_open()) {
        logFile << "[" << id << "] " << details << "\n";
        logFile.close();
    }
}

// CONCEPT 36: Full exception handling flow
std::string BookingEngine::createBooking(const std::string& riderPhone, int vehicleId,
                                         double pLat, double pLon,
                                         double dLat, double dLon) {
    try {
        // Find rider
        auto riderIt = std::find_if(riders.begin(), riders.end(),
            [&riderPhone](const Rider& r) { return r.getPhone() == riderPhone; });

        if (riderIt == riders.end())
            throw InvalidInputException("Rider with phone " + riderPhone + " not found");

        // Find vehicle
        auto vehicle = fleet.findVehicle(vehicleId);
        if (!vehicle)
            throw InvalidInputException("Vehicle #" + std::to_string(vehicleId) + " not found");
        if (!vehicle->isAvailable())
            throw VehicleUnavailableException(vehicleId);

        // Create booking — uses Composition + Smart Pointers
        Booking booking(*riderIt, vehicle, pLat, pLon, dLat, dLon);
        booking.confirm();
        bookingHistory.add(booking);

        // Log to file
        logBooking(booking.getBookingId(), "Booked by " + riderIt->getName());

        return booking.getBookingId();

    } catch (const BookingException& ex) {
        std::cerr << "Booking failed: " << ex.what() << std::endl;
        return "ERROR: " + std::string(ex.what());
    } catch (const std::exception& ex) {
        std::cerr << "Unexpected error: " << ex.what() << std::endl;
        return "ERROR: Unexpected failure";
    }
}

} // namespace RideFlow
