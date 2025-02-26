export function get_random_item(list) {
    return list[Math.floor(Math.random() * list.length)];
}

export function is_string(v) {
    return Object.prototype.toString.call(v) === '[object String]';
}

export function remove_spaces(tree) {
    if (tree.length > 0 && among(tree[0], ["spaces", "initial_spaces"])) return null;
    var i = 0;
    while (i < tree.length) {
        if (is_array(tree[i])) {
            tree[i] = remove_spaces(tree[i]);
            if (tree[i] === null) tree.splice(i--, 1);
        }
        i++;
    }
    return tree;
}

/*
 * EXAMPLE OF PARSE TREE PRUNING PROCEDURE
 *
 * remove_morphology(parse_tree)
 *
 * This function takes a parse tree, and joins the expressions of the following
 * nodes:
 * "cmevla", "gismu_2", "lujvo", "fuhivla", "spaces"
 * as well as any selmaho node (e.g. "KOhA").
 *
 */

export function remove_morphology(pt) {
    if (pt.length < 1) return [];
    var i;
    /* Sometimes nodes have no label and have instead an array as their first
       element. */
    if (is_array(pt[0])) i = 0;
    else { // The first element is a label (node name).
        // Let's check if this node is a candidate for our pruning.
        if (is_target_node(pt)) {
            /* We join recursively all the terminal elements (letters) in this
             * node and its child nodes, and put the resulting string in the #1
             * slot of the array; afterwards we delete all the remaining elements
             * (their terminal values have been concatenated into pt[1]). */
            pt[1] = join_expr(pt);
            // If pt[1] contains an empty string, let's delete it as well:
            pt.splice((pt[1] == "") ? 1 : 2);
            return pt;
        }
        i = 1;
    }
    /* If we've reached here, then this node is not a target for pruning, so let's
       do recursion into its child nodes. */
    while (i < pt.length) {
        if (is_array(pt[i])) remove_morphology(pt[i]);
        i++;
    }
    return pt;
}
