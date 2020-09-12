import { vNode } from "../types/vNode";

export default (tagName: string, { attrs = {}, children = [] }: { attrs?: Object, children?: Array<Object> } = {}): vNode => {
  let element = Object.create(null);

  Object.assign(element, {
    tagName,
    attrs,
    children,
  })

  return element;
};