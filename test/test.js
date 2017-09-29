"use strict"

const chai = require("chai")
const expect = chai.expect
const sinonChai = require("sinon-chai")
const sinon = require("sinon")
chai.use(sinonChai)

const {ccallArrays, cwrapArrays} = require("../dev/wasm-arrays.js")

global.Module = require("../demo.js")

it("Loads ok", () => {
    expect(typeof ccallArrays).to.not.equal("undefined")
    expect(typeof cwrapArrays).to.not.equal("undefined")
})


describe("ccallArrays", () => {

    it("Demo Example 1", () => {
        const res = ccallArrays("getSetWASMArray", "array", ["array", "number", "array"], [[1,2,3,4,5], 12345, [2, 10]], {heapIn: "HEAPF32", returnArraySize: 5})
        expect(res).to.deep.equal([20,40,60,80,100])
    })

    it("Demo Example 1 - no parameter types", () => {
        const res = ccallArrays("getSetWASMArray", "array", null, [[1,2,3,4,5], 12345, [2, 10]], {heapIn: "HEAPF32", returnArraySize: 5})
        expect(res).to.deep.equal([20,40,60,80,100])
    })

    it("Demo example 2", () => {
        const res = ccallArrays("get10Nums", "array", null, null, {heapOut: "HEAP32", returnArraySize: 10})
        expect(res).to.deep.equal([1,2,3,4,5,6,7,8,9,10])
    })

    it("Demo example 3", () => {
        const res = ccallArrays("addNums", "number", ["array"], [[1,2,3,4,5,6,7]])
        expect(res).to.equal(28)
    })

    it("HEAP8 in and out using 'HEAP8' config", () => {
        const res = ccallArrays("testHEAP8", "array", ["array"], [[1,2,3,4,5]], {heapIn: "HEAP8", heapOut: "HEAP8", returnArraySize: 5})
        expect(res).to.deep.equal([2,4,6,8,10])
    })

    it("HEAPU8 in and out using 'HEAPU8' config", () => {
        const res = ccallArrays("testHEAPU8", "array", ["array"], [[1,2,3,4,5]], {heapIn: "HEAPU8", heapOut: "HEAPU8", returnArraySize: 5})
        expect(res).to.deep.equal([2,4,6,8,10])
    })

    it("HEAP16 in and out using 'HEAP16' config", () => {
        const res = ccallArrays("testHEAP16", "array", ["array"], [[1,2,3,4,5]], {heapIn: "HEAP16", heapOut: "HEAP16", returnArraySize: 5})
        expect(res).to.deep.equal([2,4,6,8,10])
    })

    it("HEAPU16 in and out using 'HEAPU16' config", () => {
        const res = ccallArrays("testHEAPU16", "array", ["array"], [[1,2,3,4,5]], {heapIn: "HEAPU16", heapOut: "HEAPU16", returnArraySize: 5})
        expect(res).to.deep.equal([2,4,6,8,10])
    })

    it("HEAP32 in and out using 'HEAP32' config", () => {
        const res = ccallArrays("testHEAP32", "array", ["array"], [[1,2,3,4,5]], {heapIn: "HEAP32", heapOut: "HEAP32", returnArraySize: 5})
        expect(res).to.deep.equal([2,4,6,8,10])
    })

    it("HEAPU32 in and out using 'HEAPU32' config", () => {
        const res = ccallArrays("testHEAPU32", "array", ["array"], [[1,2,3,4,5]], {heapIn: "HEAPU32", heapOut: "HEAPU32", returnArraySize: 5})
        expect(res).to.deep.equal([2,4,6,8,10])
    })

    it("HEAPF32 in and out using 'HEAPF32' config", () => {
        const res = ccallArrays("testHEAPF32", "array", ["array"], [[1,2,3,4,5]], {heapIn: "HEAPF32", heapOut: "HEAPF32", returnArraySize: 5})
        expect(res).to.deep.equal([2,4,6,8,10])
    })

    it("Defaults the HEAP values to HEAPF32", () => {
        const res = ccallArrays("testHEAPF32", "array", ["array"], [[1,2,3,4,5]], {returnArraySize: 5})
        expect(res).to.deep.equal([2,4,6,8,10])
    })

    it("HEAPF64 in and out using 'HEAPF64' config", () => {
        const res = ccallArrays("testHEAPF64", "array", ["array"], [[1,2,3,4,5]], {heapIn: "HEAPF64", heapOut: "HEAPF64", returnArraySize: 5})
        expect(res).to.deep.equal([2,4,6,8,10])
    })

    it("Returns original value when return type is not array", () => {
        const res = ccallArrays("addNums", null, ["array"], [[1,2,3]], {heapIn: "HEAP32"})
        expect(Array.isArray(res)).to.be.false
    })

    it("Throws errors, but first it frees the memory using Module._free", () => {
        sinon.stub(Module, "_free")
        expect(ccallArrays.bind(null, "addNums", "array", ["array"], [[1,2,3]], {heapIn: "HEAP32", heapOut: "HEAP3fdgd2"})).to.throw()
        expect(Module._free).to.be.called
        Module._free.restore()
    })

    it("Throws errors, but first it frees the memory using Module._free", () => {
        sinon.stub(Module, "ccall").callsFake(() => {throw new Error("Fake error")})
        expect(ccallArrays.bind(null, "addNums", "array", ["array"], [[1,2,3]], {heapIn: "HEAP32", heapOut: "HEAP3fdgd2"})).to.throw("Fake error")
        Module.ccall.restore()
    })
})


describe("cwrapArrays", () => {

    it("Demo Example 1", () => {
        const fn = cwrapArrays("getSetWASMArray", "array", ["array", "number", "array"], {heapIn: "HEAPF32", returnArraySize: 5})
        const res = fn([[1,2,3,4,5], 12345, [2, 10]])
        expect(res).to.deep.equal([20,40,60,80,100])
    })

    it("Demo Example 1 - no parameter types", () => {
        const fn = cwrapArrays("getSetWASMArray", "array", null, {heapIn: "HEAPF32", returnArraySize: 5})
        const res = fn([[1,2,3,4,5], 12345, [2, 10]])
        expect(res).to.deep.equal([20,40,60,80,100])
    })

    it("Demo example 2", () => {
        const fn = cwrapArrays("get10Nums", "array", null, {heapOut: "HEAP32", returnArraySize: 10})
        const res = fn(null)
        expect(res).to.deep.equal([1,2,3,4,5,6,7,8,9,10])
    })

    it("Demo example 3", () => {
        const fn = cwrapArrays("addNums", "number", ["array"])
        const res = fn([[1,2,3,4,5,6,7]])
        expect(res).to.equal(28)
    })

    it("HEAP8 in and out using 'HEAP8' config", () => {
        const fn = cwrapArrays("testHEAP8", "array", ["array"], {heapIn: "HEAP8", heapOut: "HEAP8", returnArraySize: 5})
        const res = fn([[1,2,3,4,5]])
        expect(res).to.deep.equal([2,4,6,8,10])
    })

    it("HEAPU8 in and out using 'HEAPU8' config", () => {
        const fn = cwrapArrays("testHEAPU8", "array", ["array"], {heapIn: "HEAPU8", heapOut: "HEAPU8", returnArraySize: 5})
        const res = fn([[1,2,3,4,5]])
        expect(res).to.deep.equal([2,4,6,8,10])
    })

    it("HEAP16 in and out using 'HEAP16' config", () => {
        const fn = cwrapArrays("testHEAP16", "array", ["array"], {heapIn: "HEAP16", heapOut: "HEAP16", returnArraySize: 5})
        const res = fn([[1,2,3,4,5]])
        expect(res).to.deep.equal([2,4,6,8,10])
    })

    it("HEAPU16 in and out using 'HEAPU16' config", () => {
        const fn = cwrapArrays("testHEAPU16", "array", ["array"], {heapIn: "HEAPU16", heapOut: "HEAPU16", returnArraySize: 5})
        const res = fn([[1,2,3,4,5]])
        expect(res).to.deep.equal([2,4,6,8,10])
    })

    it("HEAP32 in and out using 'HEAP32' config", () => {
        const fn = cwrapArrays("testHEAP32", "array", ["array"], {heapIn: "HEAP32", heapOut: "HEAP32", returnArraySize: 5})
        const res = fn([[1,2,3,4,5]])
        expect(res).to.deep.equal([2,4,6,8,10])
    })

    it("HEAPU32 in and out using 'HEAPU32' config", () => {
        const fn = cwrapArrays("testHEAPU32", "array", ["array"], {heapIn: "HEAPU32", heapOut: "HEAPU32", returnArraySize: 5})
        const res = fn([[1,2,3,4,5]])
        expect(res).to.deep.equal([2,4,6,8,10])
    })

    it("HEAPF32 in and out using 'HEAPF32' config", () => {
        const fn = cwrapArrays("testHEAPF32", "array", ["array"], {heapIn: "HEAPF32", heapOut: "HEAPF32", returnArraySize: 5})
        const res = fn([[1,2,3,4,5]])
        expect(res).to.deep.equal([2,4,6,8,10])
    })

    it("Defaults the HEAP values to HEAPF32", () => {
        const fn = cwrapArrays("testHEAPF32", "array", ["array"], {returnArraySize: 5})
        const res = fn([[1,2,3,4,5]])
        expect(res).to.deep.equal([2,4,6,8,10])
    })

    it("HEAPF64 in and out using 'HEAPF64' config", () => {
        const fn = cwrapArrays("testHEAPF64", "array", ["array"], {heapIn: "HEAPF64", heapOut: "HEAPF64", returnArraySize: 5})
        const res = fn([[1,2,3,4,5]])
        expect(res).to.deep.equal([2,4,6,8,10])
    })

    it("Returns original value when return type is not array", () => {
        const fn = cwrapArrays("addNums", null, ["array"], {heapIn: "HEAP32"})
        const res = fn([[1,2,3]])
        expect(Array.isArray(res)).to.be.false
    })

    it("Throws errors, but first it frees the memory using Module._free", () => {
        sinon.stub(Module, "_free")
        const fn = cwrapArrays("addNums", "array", ["array"], {heapIn: "HEAP32", heapOut: "HEAP3fdgd2"})
        expect(fn.bind(null, [[1,2,3]])).to.throw()
        expect(Module._free).to.be.called
        Module._free.restore()
    })

    it("Throws errors, but first it frees the memory using Module._free", () => {
        sinon.stub(Module, "ccall").callsFake(() => {throw new Error("Fake error")})
        const fn = ccallArrays.bind(null, "addNums", "array", ["array"], {heapIn: "HEAP32", heapOut: "HEAP3fdgd2"})
        expect(fn.bind([[1,2,3]])).to.throw("Fake error")
        Module.ccall.restore()
    })
})