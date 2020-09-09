import { generatePatch } from './render';
import attrs from './modules/attr'
import clz from './modules/class'
import events from './modules/event'
import styles from './modules/style'

export const patch = generatePatch([ attrs, clz, events, styles ])
