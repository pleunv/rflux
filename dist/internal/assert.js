"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = assert;
function assert(condition, message) {

  if (!condition) {
    throw new Error(message);
  }
}
//# sourceMappingURL=assert.js.map
