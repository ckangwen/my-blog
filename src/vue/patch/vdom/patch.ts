import { generatePatch } from './render';
import modules from './modules'

export const patch = generatePatch([...modules])
