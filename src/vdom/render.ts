import { vNode } from "../types/vNode";

const renderElement = ({ tagName, attrs, children }: vNode) => {
  const element = document.createElement(tagName);

  for (const [key, value] of Object.entries(attrs)) {
    element.setAttribute(key, value);
  }

  for (const child of children) {
    element.appendChild(render(child));
  }

  return element;
};

const render = (virtualNode: string | vNode): HTMLElement | Text => {
  if (typeof virtualNode === 'string') {
    return document.createTextNode(virtualNode);
  }

  return renderElement(virtualNode);
};

export default render;