export const isBrowser =
  typeof window !== "undefined" && typeof window.document !== "undefined";

export const isNode = node => node.nodeType === 1;

export const isTextNode = node => node.nodeType === 3;

export const isDirective = attr => attr.indexOf('v-') === 0;

