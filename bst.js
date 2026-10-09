class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(array) {
    this.root = this.buildTree(array);
  }

  buildTree(array) {
    // removes duplicates and sorts in ascending order
    const sorted = [...new Set(array)].sort((a, b) => a - b);

    return this.#build(sorted, 0, sorted.length - 1);
  }

  #build(sorted, start, end) {
    if (start > end) return null;

    const mid = Math.floor((start + end) / 2);
    const node = new Node(sorted[mid]);

    node.left = this.#build(sorted, start, mid - 1);
    node.right = this.#build(sorted, mid + 1, end);

    return node;
  }

  includes(value, node = this.root) {
    if (node === null) return false;
    if (node.data === value) return true;

    return value < node.data
      ? this.includes(value, node.left)
      : this.includes(value, node.right);
  }

  insert(value, node = this.root) {
    if (this.root === null) {
      this.root = new Node(value);
      return;
    }

    if (node === null) return new Node(value);

    if (value === node.data) return node;

    if (value < node.data) node.left = this.insert(value, node.left);
    else node.right = this.insert(value, node.right);

    return node;
  }

  deleteItem(value, node = this.root) {
    if (node === null) return null;

    if (value < node.data) {
      node.left = this.deleteItem(value, node.left);
      return node;
    } else if (value > node.data) {
      node.right = this.deleteItem(value, node.right);
      return node;
    }

    if (node.left === null) return node.right;
    if (node.right === null) return node.left;

    let succParent = node;
    let succ = node.right;

    while (succ.left !== null) {
      succParent = succ;
      succ = succ.left;
    }

    node.data = succ.data;

    if (succParent !== node) {
      succParent.left = succ.right;
    } else {
      succParent.right = succ.right;
    }

    return node;
  }

  levelOrderForEach(callback) {
    if (typeof callback !== "function") throw new Error("Callback is required");
    if (!this.root) return;

    const queue = [this.root];
    while (queue.length > 0) {
      const current = queue.shift();
      callback(current.data);
      if (current.left) queue.push(current.left);
      if (current.right) queue.push(current.right);
    }
  }

  inOrderForEach(callback, node = this.root) {
    if (typeof callback !== "function") throw new Error("Callback is required");
    if (node === null) return;

    this.inOrderForEach(callback, node.left);
    callback(node.data);
    this.inOrderForEach(callback, node.right);
  }

  preOrderForEach(callback, node = this.root) {
    if (typeof callback !== "function") throw new Error("Callback is required");
    if (node === null) return;

    callback(node.data);
    this.preOrderForEach(callback, node.left);
    this.preOrderForEach(callback, node.right);
  }

  postOrderForEach(callback, node = this.root) {
    if (typeof callback !== "function") throw new Error("Callback is required");
    if (node === null) return;

    this.postOrderForEach(callback, node.left);
    this.postOrderForEach(callback, node.right);
    callback(node.data);
  }

  findNode(value, node = this.root) {
    if (node === null || node.data === value) return node;
    return value < node.data
      ? this.findNode(value, node.left)
      : this.findNode(value, node.right);
  }

  height(value) {
    const targetNode = this.findNode(value);
    if (!targetNode) return undefined;

    const getHeight = (node) => {
      if (node === null) return -1;
      return 1 + Math.max(getHeight(node.left), getHeight(node.right));
    };

    return getHeight(targetNode);
  }

  depth(value, node = this.root, currentDepth = 0) {
    if (node === null) return undefined;
    if (node.data === value) return currentDepth;

    if (value < node.data) {
      return this.depth(value, node.left, currentDepth + 1);
    }
    return this.depth(value, node.right, currentDepth + 1);
  }

  isBalanced(node = this.root) {
    const checkBalance = (currNode) => {
      if (currNode === null) return 0;

      const leftHeight = checkBalance(currNode.left);
      if (leftHeight === -1) return -1;

      const rightHeight = checkBalance(currNode.right);
      if (rightHeight === -1) return -1;

      if (Math.abs(leftHeight - rightHeight) > 1) return -1;

      return 1 + Math.max(leftHeight, rightHeight);
    };

    return checkBalance(node) !== -1;
  }

  rebalance() {
    const values = [];
    this.inOrderForEach((val) => values.push(val));
    this.root = this.buildTree(values);
  }

  prettyPrint(node, prefix = "", isLeft = true) {
    if (node === null || node === undefined) {
      return;
    }

    this.prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
    this.prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
}

// Visualization helper provided by Odin
const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null || node === undefined) return;
  prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
  prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
};

// 1. Create a tree from random numbers < 100
const getRandomNumbers = (count) =>
  Array.from({ length: count }, () => Math.floor(Math.random() * 100));

const tree = new Tree(getRandomNumbers(15));

console.log("=== Initial Tree ===");
prettyPrint(tree.root);
console.log("Is Balanced?", tree.isBalanced()); // true

// 2. Print elements in all orders
const printOrders = () => {
  const level = [],
    inOrd = [],
    pre = [],
    post = [];
  tree.levelOrderForEach((v) => level.push(v));
  tree.inOrderForEach((v) => inOrd.push(v));
  tree.preOrderForEach((v) => pre.push(v));
  tree.postOrderForEach((v) => post.push(v));

  console.log("Level Order:", level);
  console.log("Pre Order:  ", pre);
  console.log("In Order:   ", inOrd);
  console.log("Post Order: ", post);
};

printOrders();

// 3. Unbalance the tree
console.log("\nUnbalancing tree by adding values > 100...");
[101, 105, 110, 120, 130].forEach((v) => tree.insert(v));
prettyPrint(tree.root);
console.log("Is Balanced?", tree.isBalanced()); // false

// 4. Rebalance the tree
console.log("\nRebalancing tree...");
tree.rebalance();
prettyPrint(tree.root);
console.log("Is Balanced?", tree.isBalanced()); // true

printOrders();
