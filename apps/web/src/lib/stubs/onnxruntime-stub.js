// Enhanced stub for onnxruntime-web to prevent property access crashes
module.exports = {
  env: {
    wasm: {
      proxy: false,
      numThreads: 1,
      initTimeout: 0,
    }
  }
};
