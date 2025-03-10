import store from "store2";

import { mod } from "../../scripts/utils";


/* Column View */


class Column_View {
    #index;
    // The initial value of this variable is purely so that Column_View can update
    // when it is constructed. It will be quickly reassigned afterwards via the
    // #track_offscreen_middle_column_element.
    #offscreen_middle_column_element = { id: "long-roots" };
    // get_href is a function so that #offscreen_middle_column_element always
    // re-resolves.
    #views = [
        { name: "left-most", get_href: () => "short-roots" },
        { name: "middle-two", get_href: () => this.#offscreen_middle_column_element.id },
        { name: "right-most", get_href: () => "longer-roots" },
    ];

    constructor() {
        this.#initialise_index();
        this.#render();
        this.#track_offscreen_middle_column_element();
    }

    /* Index */

    #initialise_index() {
        if (store.has("column-view-index")) {
            this.#index = parseInt(store.get("column-view-index"));
        } else {
            this.#index = 0;
        }
    }

    #set_index(new_index) {
        this.#index = new_index;
        localStorage.setItem("column-view-index", new_index);
    }

    /* Interface */

    directly_to(new_view_name) {
        const new_index = this.#views.findIndex(({ name }) => name === new_view_name);
        if (this.#index !== new_index) {
            this.#set_index(new_index);
            this.#render();
        }
    }

    next() {
        this.#set_index(mod(this.#index + 1, this.#views.length));
        this.#render();
    }
    prev() {
        this.#set_index(mod(this.#index - 1, this.#views.length));
        this.#render();
    }

    /* Render */

    #render() {
        this.#render_view();
        this.#render_carousel_nav_buttons();
    }

    #render_view() {
        // Using location.href as location.hash won't cause a scroll to be
        // triggered when changed by the window.onresize function.
        location.href = "#" + this.#views[this.#index].get_href();
    }

    #render_carousel_nav_buttons() {
        for (const view of this.#views) {
            const carousel_nav_button = document.getElementById(view.name);
            if (view.name === this.#views[this.#index].name) {
                carousel_nav_button.classList.add("here");
            } else {
                carousel_nav_button.classList.remove("here");
            }
        }
    }

    /* Tracking */

    #track_offscreen_middle_column_element() {
        // There are 4 column elements and 3 two-column views.
        // One middle column element will always appear offscreen.
        const update_offscreen_middle_column_element = (entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) {
                    this.#offscreen_middle_column_element = entry.target;
                    return;
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
        window.onresize = () => {
            clearTimeout(onFinishedResizingId);
            onFinishedResizingId = setTimeout(this.render_view(), 100);
        }
    }
}


/* ENTRY */
const column_view = new Column_View();
export default column_view;
