import { vNode } from '../types/vNode';
import render from './render';

// diff is a function which perform a diff between two trees and return a patch function which takes a node
// and make the changes
const diff = (oldVTree: vNode, newVTree: vNode | undefined): Function => {
  if (typeof newVTree === undefined) {
    // if the new tree is empty, then the node is simply removed
    return (node: HTMLElement | Text): undefined => {
      node.remove();

      return undefined;
    };
  }

  if (typeof oldVTree === 'string' || typeof newVTree === 'string') {
    // they could be both text node, or one is a text node and the other an element
    if (oldVTree !== newVTree) {
      // if they are both string, their contents differs, so new tree is going to replace old tree
      // if their types are different, new tree is going replace old tree
      return (node: HTMLElement | Text): HTMLElement | Text => {
        const newNode = render(newVTree);
        node.replaceWith(newNode);

        return newNode;
      };
    } else {
      // they are both string, and their content match
      return (node: HTMLElement | Text): HTMLElement | Text => node;
    }
  }
  
  // they are both node elements
  if (oldVTree.tagName !== newVTree.tagName) {
    // if they are totally different elements, old tree is replaed by new tree
    return (node: HTMLElement): HTMLElement | Text => {
      const newNode = render(newVTree);
      node.replaceWith(newNode);

      return newNode;
    };
  }
  
  // they are same tag elements
  // they could have different attributes or childs
  const patchAttrs = diffAttrs(oldVTree.attrs, newVTree.attrs);
  const patchChilds = diffChildren(oldVTree.children, newVTree.children);

  return (node) => {
    patchAttrs(node);
    patchChilds(node);

    return node;
  }
};

const diffAttrs = (oldAttrs: Object, newAttrs: Object): Function => {
  const patches = [];

  // setting new attributes
  for (const [key, value] of Object.entries(newAttrs)) {
    patches.push((node: HTMLElement) => {
      node.setAttribute(key, value);

      return node;
    });
  }

  // remove unused attributes
  for (const key in oldAttrs) {
    if (!(key in newAttrs)) {
      patches.push((node: HTMLElement) => {
        node.removeAttribute(key);

        return node;
      });
    }
  }

  return (node: HTMLElement) => {
    for (const patch of patches) {
      patch(node);
    }

    return node;
  };
};

const diffChildren = (oldVChildren, newVChildren) => {
  const childPatches = [];
  oldVChildren.forEach((oldVChild, i) => {
    childPatches.push(diff(oldVChild, newVChildren[i]));
  });

  const additionalPatches = [];
  for (const additionalVChild of newVChildren.slice(oldVChildren.length)) {
    additionalPatches.push(($node) => {
      $node.appendChild(render(newVChildren));
      return $node;
    });
  }

  return ($parent) => {
    // since childPatches are expecting the $child, not $parent,
    // we cannot just loop through them and call patch($parent)
    $parent.childNodes.forEach(($child, i) => {
      childPatches[i]($child);
    });

    for (const patch of additionalPatches) {
      patch($parent);
    }
    return $parent;
  };
};

export default diff;