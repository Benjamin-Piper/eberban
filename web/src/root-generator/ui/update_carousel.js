import { mod } from "../../scripts/utils";


/* Column View */


class Column_View {
    #index = 0;
    #views = [
        // get_href is a function to always re-resolve offscreen_middle_column_element.
        { name: "left-most", get_href: () => "short-roots" },
        { name: "middle-two", get_href: () => offscreen_middle_column_element?.id },
        { name: "right-most", get_href: () => "longer-roots" },
    ];

    constructor() {
        this.#update();
    }

    directly_to(new_view_name) {
        const new_index = this.#views.findIndex(({ name }) => name === new_view_name);
        if (this.#index !== new_index) {
            this.#index = new_index;
            this.#update();
        }
    }

    #get_current_view() {
        return this.#views[this.#index];
    }

    go_to_current_view() {
        // Using location.href as location.hash won't cause a scroll to be
        // triggered when changed by the window.onresize function.
        location.href = "#" + this.#get_current_view().get_href();
    }

    next() {
        this.#index = mod(this.#index + 1, this.#views.length);
        this.#update();
    }
    prev() {
        this.#index = mod(this.#index - 1, this.#views.length);
        this.#update();
    }

    #update() {
        this.go_to_current_view();
        for (const view of this.#views) {
            const carousel_nav_button = document.getElementById(view.name);
            if (view.name === this.#get_current_view().name) {
                carousel_nav_button.classList.add("here");
            } else {
                carousel_nav_button.classList.remove("here");
            }
        }
        
    }
}


/* Globals */


let offscreen_middle_column_element = null;

export const column_view = new Column_View();


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
        onFinishedResizingId = setTimeout(column_view.go_to_current_view(), 100);
    }
}
