/* Globals */


const adjacency_fns = [
    go_to_left_most_columns,
    go_to_middle_two_columns,
    go_to_right_most_columns
]
let adjacency_index = 0;

let offscreen_middle_column_element = null;


/* Tracking */


export function track_offscreen_middle_column_element() {
    // There are 4 column elements and 3 two-column views.
    // One middle column element will always appear offscreen.
    function update_offscreen_middle_column_element(entries) {
        for (const entry of entries) {
            if (!entry.isIntersecting) {
                offscreen_middle_column_element = entry.target;
            }
        }
    }
    const observer = new IntersectionObserver(
        update_offscreen_middle_column_element,
        { 
            root: document.getElementById("carousel-viewport"),
            threshold: 1,
        },
    );
    observer.observe(document.getElementById("medium-roots"));
    observer.observe(document.getElementById("long-roots"));

    // The carousel scrolls on window resize because the column elements are
    // sized by percentage (relative units). Re-scroll to original position when
    // window resize finishes.
    let onFinishedResizingId;
    window.onresize = function() {
        clearTimeout(onFinishedResizingId);
        onFinishedResizingId = setTimeout(adjacency_fns[adjacency_index], 100);
    }
}


/* Adjacency */

// Using location.href as location.hash won't cause a scroll to be triggered
// when changed by the window.onresize function.

function go_to_left_most_columns() {
    location.href = "#short-roots";
}

function go_to_middle_two_columns() {
    location.href = "#" + offscreen_middle_column_element?.id;
}

function go_to_right_most_columns() {
    location.href = "#longer-roots";
}

export function go_to_adjacent(direction) {
    // Credit: https://web.archive.org/web/20090717035140if_/javascript.about.com/od/problemsolving/a/modulobug.htm
    const mod = (n, modulus) => ((n % modulus) + modulus) % modulus;
    if (direction === "left") {
        adjacency_index = mod(adjacency_index - 1, adjacency_fns.length);

    } else if (direction === "right") {
        adjacency_index = mod(adjacency_index + 1, adjacency_fns.length);
    }
    adjacency_fns[adjacency_index]();
}
