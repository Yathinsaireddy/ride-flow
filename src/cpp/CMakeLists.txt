cmake_minimum_required(VERSION 3.13)
project(RideFlowWASM)

# Require Emscripten toolchain
if(NOT EMSCRIPTEN)
    message(FATAL_ERROR "This project requires the Emscripten toolchain. Use emcmake cmake ...")
endif()

# Output settings
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)

# Set compile flags for maximum performance (-O3) and WebAssembly target
set(CMAKE_CXX_FLAGS "-O3 -Wall")

# Create the WASM output directory relative to the CMake execution
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY "${CMAKE_SOURCE_DIR}/../wasm")

# Add Emscripten bind flag
set(CMAKE_EXE_LINKER_FLAGS "--bind -s MODULARIZE=1 -s EXPORT_NAME='createRideFlowModule' -s WASM=1")

# The executable definition
add_executable(ride_flow
    BookingEngine.cpp
    bindings.cpp
)
