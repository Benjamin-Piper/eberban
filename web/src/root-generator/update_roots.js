import get_random_roots from "./logic/generator";
import {
    get_random_three_letter_intransitive_root,
    get_random_four_letter_intransitive_root,
    get_random_five_letter_intransitive_root,
    get_random_six_letter_intransitive_root,
    get_random_three_letter_transitive_root,
    get_random_four_letter_transitive_root,
    get_random_five_letter_transitive_root,
    get_random_six_letter_transitive_root,
} from "./logic/random_root";


/* Transitivity */


const is_intransitive = (s) => s === "intransitive";
const is_transitive = (s) => s === "transitive";
const is_valid = (s) => is_intransitive(s) || is_transitive(s);

function get_transitivity(transitive_string) {
    const tmp = [
        transitive_string,
        "intransitive", // Default to intransitive.
    ];
    for (const transitivity of tmp) {
        if (is_valid(transitivity)) {
            return transitivity;
        }
    }
}


/* Buttons */


function update_buttons(transitivity) {
    const intransitiveButton = document.getElementById("intransitive");
    const transitiveButton = document.getElementById("transitive");
    if (is_transitive(transitivity)) {
        transitiveButton.disabled = true;
        intransitiveButton.disabled = false;
    } else {
        transitiveButton.disabled = false;
        intransitiveButton.disabled = true;
    }
}


/* Raots */


function formatRoot(root) {
    const element = document.createElement("LI");
    element.innerText = root;
    return element;
}

function update_root_list(root_list_id, get_random_root_fn) {
    const root_list = document.getElementById(root_list_id);
    root_list.innerHTML = null;
    root_list.append(...get_random_roots(get_random_root_fn).map(formatRoot))
}


/* ENTRY */


export default function update_roots(transitive_string) {
    const transitivity = get_transitivity(transitive_string);
    update_buttons(transitivity);
    if (is_transitive(transitivity)) {
        update_root_list("short-roots", get_random_three_letter_transitive_root);
        update_root_list("medium-roots", get_random_four_letter_transitive_root);
        update_root_list("long-roots", get_random_five_letter_transitive_root);
        update_root_list("longer-roots", get_random_six_letter_transitive_root);
    } else {
        update_root_list("short-roots", get_random_three_letter_intransitive_root);
        update_root_list("medium-roots", get_random_four_letter_intransitive_root);
        update_root_list("long-roots", get_random_five_letter_intransitive_root);
        update_root_list("longer-roots", get_random_six_letter_intransitive_root);
    }   
}
