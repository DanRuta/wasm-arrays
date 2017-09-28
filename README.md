# wasm-arrays
[![Build Status](https://travis-ci.org/DanRuta/wasm-arrays.svg?branch=master)](https://travis-ci.org/DanRuta/wasm-arrays) [![Coverage Status](https://coveralls.io/repos/github/DanRuta/wasm-arrays/badge.svg?branch=master)](https://coveralls.io/github/DanRuta/wasm-arrays?branch=master)

A couple of helper functions to make WebAssembly array parameters easy to use.

## Importing
### Browser
Add ```<script src="/dist/wasm-arrays.min.js"></script>``` and use ```ccallArrays``` or ```cwrapArrays```
See the demo.html file included to see a few examples.

NOTE: You will need to serve the html file through a server. There is one already included, so you can run ```node server```, then navigate to ```localhost:1337``` to view.

### Nodejs
```javascript
const {ccallArrays, cwrapArrays} = require("./wasm-arrays.js")
```
You can see the ```test.js``` file to see more nodejs examples.

## Usage

**There are a few examples included in the demo.html, test.js and emscripten.cpp files, for their respective use cases**

The included functions aim to mimick the WebAssembly ccall and cwrap functions. They therefore work the same way.

If you need to pass an array parameter, you need to just add the parameter to the list of parameters.

In the C++ code, this will be turned into two parameters:
1. Array pointer
2. Array size

#### Example:
JavaScript
```javascript
const result = ccallArrays("addNums", "number", ["array"], [[1,2,3,4,5,6,7]])
```
C++
```c++
EMSCRIPTEN_KEEPALIVE
int addNums (float *buf, int bufSize) {

    int total = 0;

    for (int i=0; i<bufSize; i++) {
        total+= buf[i];
    }

    return total;
}
```

To return an array from WebAssembly, you need to specify the return parameter as "array". You also need to specify the size of the returned array.

#### Example:
JavaScript
```javascript
const res = ccallArrays("doubleValues", "array", ["array"], [[1,2,3,4,5]], {heapIn: "HEAP8", heapOut: "HEAP8", returnArraySize: 5})
console.log(res) // [2,4,6,8,10]
```
C++
```c++
EMSCRIPTEN_KEEPALIVE
int8_t* doubleValues (int8_t *buf, int bufSize) {

    int8_t values[bufSize];

    for (int i=0; i<bufSize; i++) {
        values[i] = buf[i] * 2;
    }

    auto arrayPtr = &values[0];
    return arrayPtr;
}
```

### Heaps
You can also specify the heaps used for the arrays going in and out. The following table matches the heaps to the C++ types, for quick reference:

| Heap | C++ |
|:--:|:--:|
| HEAP8 | int8_t |
| HEAPU8 | uint8_t |
| HEAP16 | int16_t |
| HEAPU16 | uint16_t |
| HEAP32 | int32_t |
| HEAPU32 | uint32_t |
| HEAPF32 | float |
| HEAPF64 | double |
