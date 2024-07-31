class Codec { 

    /// dfs
    getCodes(node, curr_code) {
        /// is leaf node
        if (typeof (node[1]) === "string") {
            // this.codes.node[1] = curr_code;
            /// alternate way
            this.codes[node[1]] = curr_code;
            return;
        }

        /// go left 
        this.getCodes(node[1][0], curr_code + '0');
        /// go right
        this.getCodes(node[1][1], curr_code + '1');
    }

    /// make the humffman tree into a string
    make_string(node) {
        if (typeof (node[1]) === "string") {
            return "'" + node[1];
        }
        return '0' + this.make_string(node[1][0]) + '1' + this.make_string(node[1][1]);
    }
    /// make string into huffman tree
    make_tree(tree_string) {
        let node = [];
        if (tree_string[this.index] === "'") {
            this.index++;
            node.push(tree_string[this.index]);
            this.index++;
            return node;
        }
        this.index++;
        node.push(this.make_tree(tree_string)); // find and push left child
        this.index++;
        node.push(this.make_tree(tree_string)); // find and push right child
        return node;
    }

    encode(data) {
        this.heap = new MinHeap();

        var mp = new Map();
        for (let i = 0; i < data.length; i++) {
            if (mp.has(data[i])) {
                let foo = mp.get(data[i]);
                mp.set(data[i], foo + 1);
            }
            else {
                // mp[data[i]] = 1;
                mp.set(data[i], 1);
            }
        }
        if (mp.size === 0) {
            let final_string = "zer#";
            let output_message = "Compression complete and file sent for download" + '\n' + "Compression Ratio : " + (data.length / final_string.length);
            return [final_string, output_message];
        }
        if (mp.size === 1) {
            let key, value;
            for (let [k, v] of mp) {
                key = k;
                value = v;
            }
            let final_string = "one" + '#' + key + '#' + value.toString();
            let output_message = "Compression complete and file sent for download" + '\n' + "Compression Ratio : " + (data.length / final_string.length);
            return [final_string, output_message];
        }
        for (let [key, value] of mp) {
            this.heap.push([value, key]);
        }

 
        while (this.heap.size() >= 2) {
            let min_node1 = this.heap.top();
            this.heap.pop();
            let min_node2 = this.heap.top();
            this.heap.pop();
            this.heap.push([min_node1[0] + min_node2[0], [min_node1, min_node2]]);
        }
        var huffman_tree = this.heap.top();
        this.heap.pop();
        this.codes = {};
        this.getCodes(huffman_tree, "");

        /// convert data into coded data
        let binary_string = "";
        for (let i = 0; i < data.length; i++) {
            binary_string += this.codes[data[i]];
        }
        let padding_length = (8 - (binary_string.length % 8)) % 8;
        for (let i = 0; i < padding_length; i++) {
            binary_string += '0';
        }
        let encoded_data = "";
        for (let i = 0; i < binary_string.length;) {
            let curr_num = 0;
            for (let j = 0; j < 8; j++, i++) {
                curr_num *= 2;
                curr_num += binary_string[i] - '0';
            }
            encoded_data += String.fromCharCode(curr_num);
        }
        let tree_string = this.make_string(huffman_tree);
        let ts_length = tree_string.length;
        let final_string = ts_length.toString() + '#' + padding_length.toString() + '#' + tree_string + encoded_data;
        let output_message = "Compression complete and file sent for download" + '\n' + "Compression Ratio : " + (data.length / final_string.length);
        return [final_string, output_message];
    }

}

