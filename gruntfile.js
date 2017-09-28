module.exports = function(grunt){
    grunt.initConfig({

        uglify: {
            my_target: {
                files: {
                    "dist/wasm-arrays.min.js" : ["dev/wasm-arrays.js"]
                }
            }
        },

        exec: {
            // You'll need to change this if modifying the demo c++
            build: "C:/Users/Dan/emsdk/emsdk_env.bat & echo Building... & emcc -o ./demo.js ./dev/emscripten.cpp -O3 -s ALLOW_MEMORY_GROWTH=1 -s WASM=1 -s NO_EXIT_RUNTIME=1 -std=c++1z",
        },

        watch: {
            cpp: {
                files: ["dev/*.cpp"],
                tasks: ["exec:build"]
            },
            js: {
                files: ["dev/*.js"],
                tasks: ["uglify"]
            }
        }
    })

    grunt.loadNpmTasks("grunt-contrib-watch")
    grunt.loadNpmTasks('grunt-contrib-uglify')
    grunt.loadNpmTasks("grunt-exec")

    grunt.registerTask("default", ["watch"])
}