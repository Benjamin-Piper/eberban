import get_random_roots from "../logic/generator";
import {
    get_random_three_letter_intransitive_root,
    get_random_four_letter_intransitive_root,
    get_random_five_letter_intransitive_root,
    get_random_six_letter_intransitive_root,
    get_random_three_letter_transitive_root,
    get_random_four_letter_transitive_root,
    get_random_five_letter_transitive_root,
    get_random_six_letter_transitive_root,
} from "../logic/random_root";


/* Helpers */


const is_intransitive = (s) => s === "intransitive";
const is_transitive = (s) => s === "transitive";
const is_valid = (s) => is_intransitive(s) || is_transitive(s);


/* Root Lists */


class Root_Lists {
    #root_lists;
    #transitivity;

    constructor() {
        this.#initialise_transitivity();
        this.#render_transitivity();
        this.#initialise_root_lists();
        this.#render_roots();
    }


    /* Roots */


    #initialise_root_lists() {
        const cached_root_lists = JSON.parse(localStorage.getItem("root-lists"));
        if (cached_root_lists) {
            this.#root_lists = cached_root_lists;
            return;
        }
        this.#root_lists = [
            {
                id: "short-roots",
                roots: [],
                transitive_fn: get_random_three_letter_transitive_root,
                intransitive_fn: get_random_three_letter_intransitive_root,
            },
            {
                id: "medium-roots",
                roots: [],
                transitive_fn: get_random_four_letter_transitive_root,
                intransitive_fn: get_random_four_letter_intransitive_root,
            },
            {
                id: "long-roots",
                roots: [],
                transitive_fn: get_random_five_letter_transitive_root,
                intransitive_fn: get_random_five_letter_intransitive_root,
            },
            {
                id: "longer-roots",
                roots: [],
                transitive_fn: get_random_six_letter_transitive_root,
                intransitive_fn: get_random_six_letter_intransitive_root,
            },
        ];
        this.#update_roots();
    }

    refresh() {
        this.#update_roots();
        this.#render_roots();
    }

    #render_roots() {
        const format_root = (root) => {
            const element = document.createElement("LI");
            element.innerText = root;
            return element;
        }
        const render_column_element = (root_list_id, roots) => {
            const column_element = document.getElementById(root_list_id);
            column_element.innerHTML = null;
            column_element.append(...roots.map(format_root));
        }
        for (const root_list of this.#root_lists) {
            render_column_element(root_list.id, root_list.roots);
        }
    }
    
    #update_roots() {
        for (const root_list of this.#root_lists) {
            if (is_transitive(this.#transitivity)) {
                root_list.roots = get_random_roots(root_list.transitive_fn);
            } else {
                root_list.roots = get_random_roots(root_list.intransitive_fn);
            }
        }
    }


    /* Transitivity */


    #initialise_transitivity() {
        const transitivity_list = [
            localStorage.getItem("transitivity"),
            "intransitive", // Default to intransitive.
        ];
        for (const transitivity of transitivity_list) {
            if (is_valid(transitivity)) {
                this.#transitivity = transitivity;
                return;
            }
        } 
    }

    #set_transitivity(new_transitivity) {
        this.#transitivity = new_transitivity;
        localStorage.setItem("transitivity", new_transitivity);
    }

    // TODO perhaps rename this??
    switch_transitivity_to(new_transitivity) {
        this.#set_transitivity(new_transitivity);
        this.#render_transitivity();
        this.#render_roots();
    }

    #render_transitivity() {
        const intransitive_button = document.getElementById("intransitive");
        const transitive_button = document.getElementById("transitive");
        intransitive_button.disabled = is_intransitive(this.#transitivity);
        transitive_button.disabled = is_transitive(this.#transitivity);
    }
}


/* ENTRY */
const root_lists = new Root_Lists();
export default root_lists;
