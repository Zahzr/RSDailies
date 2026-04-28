import { herbs } from './herbs.js';
import { allotments } from './allotments.js';
import { hops } from './hops.js';
import { trees } from './trees.js';
import { specialty } from './specialty.js';

export { herbs, allotments, hops, trees, specialty };

export const farmingConfig = {
  groups: [herbs, allotments, hops, trees, specialty]
};

export default farmingConfig;
