if (typeof global.structuredClone === "undefined") {
    global.structuredClone = (obj) =>
      structuredClonePolyfill(obj);
  }
  
  function structuredClonePolyfill(obj) {
    if (obj instanceof Map) {
      return new Map(structuredClonePolyfill([...obj]));
    }
    if (obj instanceof Set) {
      return new Set(structuredClonePolyfill([...obj]));
    }
    if (obj instanceof Date) {
      return new Date(obj.getTime());
    }
    if (typeof obj === "object" && obj !== null) {
      return Object.keys(obj).reduce((acc, key) => {
        acc[key] = structuredClonePolyfill(obj[key]);
        return acc;
      }, Array.isArray(obj) ? [] : {});
    }
    return obj;
  }
  