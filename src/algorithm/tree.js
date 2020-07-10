class Node {
    constructor(data) {
        this.data = data;
        this.children = [];
    }

    add(data) {
        this.children.add(new Node(data));
    }
    remove(data) {
        this.children = this.children.filter(item => item.data !== data);
    }

}

class Tree {
    constructor() {
        this.root = null;
    }

    bfs(fn) {
        const arr = [this.root];
        let count = 0;
        while (arr.length) {
            // 取出一个节点
            const node = arr.shift();
            // 检验该节点
            fn(node, count, this);
            // 将它的子节点放置于与父节点同级的其他节点的后面
            // 也就是说先搜索父级及其同级的节点，再搜索子节点
            arr.push(...node.children);
            count++;
        }
    }

    dfs(fn) {
        const arr = [this.root];
        let count = 0;
        while (arr.length) {
            const node = arr.shift();
            arr.push(...node.children);
            arr.unshift(...node.children)
            count++;
        }
    }
}
