class Node {
    constructor(val) {
        this.val = val;
        this.left = null;
        this.right = null;
    }
}

// https://leetcode-cn.com/problems/check-balance-lcci/
class BinarySearchTree {
    root = null

    insert(val) {
        const newNode = new Node(val);
        if (this.root === null) {
            this.root = newNode
        } else {
            insertNode(this.root, newNode)
        }
    }

}

function insertNode(node, newNode) {

}
