// index.js
import { Buffer } from 'buffer';

// Essential polyfills only
if (typeof global.Buffer === 'undefined') {
  global.Buffer = Buffer;
}

// Simple toString fix for Hermes
if (typeof global._toString === 'undefined') {
  global._toString = function(obj) {
    return Object.prototype.toString.call(obj);
  };
}

import 'expo-router/entry';