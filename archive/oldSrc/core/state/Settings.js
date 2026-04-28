import { readStorage, writeStorage } from '../storage/Storage.js';
export function readSetting(key, fallback) { return readStorage(`settings:${key}`, fallback); }
export function writeSetting(key, value) { return writeStorage(`settings:${key}`, value); }
