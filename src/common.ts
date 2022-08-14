import {CountQueuingStrategy} from 'node:stream/web'

export const QUEUING_STRATEGY = new CountQueuingStrategy({highWaterMark: 4})
