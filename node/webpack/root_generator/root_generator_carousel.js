// TODO move this all into another JS file rip

let offScreenElement = null;

export function initStuff() {
    console.log(document.getElementById("carousel-viewport"))
    function assignOffscreenElement(entries) {
        for (const entry of entries) {
            if (!entry.isIntersecting) {
                offScreenElement = entry.target;
            }
        }
    }
    const observer = new IntersectionObserver(
        assignOffscreenElement,
        { 
            root: document.getElementById("carousel-viewport"),
            threshold: 1,
        },
    );
    observer.observe(document.getElementById("medium-roots"));
    observer.observe(document.getElementById("long-roots"));

    let onFinishedResizingId;
    window.onresize = function() {
        clearTimeout(onFinishedResizingId);
        onFinishedResizingId = setTimeout(tmpName[tmpIndex], 100);
    }
}



// spaghetti code alert!! TODO clean this up. will be easier
// to reason about this when i'm in another file
// might need a diagram

export function goToMiddleTwoColumns() {
    location.href = `#${offScreenElement?.id}`;
}

export function goToLeftMostColumns() {
    location.href = "#short-roots";
    tmpIndex = 0;
}

export function goToRightMostColumns() {
    location.href = "#longer-roots";
    tmpIndex = 2;
}

// todo fix all the names
const tmpName = [
    goToLeftMostColumns,
    goToMiddleTwoColumns,
    goToRightMostColumns
]
let tmpIndex = 0;
export function goAdjacent(direction) {
    // credit: https://web.archive.org/web/20090717035140if_/javascript.about.com/od/problemsolving/a/modulobug.htm
    const mod = (n, modulus) => ((n % modulus) + modulus) % modulus;
    if (direction === "left") {
        tmpIndex = mod(tmpIndex - 1, tmpName.length);

    } else if (direction === "right") {
        tmpIndex = mod(tmpIndex + 1, tmpName.length);
    }
    tmpName[tmpIndex]();
}




// todo cache columns
