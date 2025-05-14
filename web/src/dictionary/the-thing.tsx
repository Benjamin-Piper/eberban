
import { JSX } from "preact/compat";
import render_to_string from "preact-render-to-string";
import htmr from "htmr";
// // is this file ts or tsx?

// todo why am i getting bootstrap errors??


// todo types
type Replacer = (whole_string: string, ...captured_strings: any[]) => JSX.Element




type Replacement = {
    begin_index: number,
    end_index: number,
    jsx: JSX.Element,
}

export default function the_thing(
    input: string | JSX.Element,
    regex_string: string,
    replacer: Replacer,
    keep_children_as_string: boolean,
) {
    const string_input = the_thing_0(input);
    // console.log(string_input)
    // the_thing_1 TODO rename and fix up this comment
    //the_thing_1 uses string.matchAll which requires a global regex.
    // however. using a global regex with regex.test advances lastIndex, thus produces
    // inconsistent behavoiur. To minimise the regex headache, we're using a separate regexp to test whether we need to do replacements
    // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test#using_test_on_a_regex_with_the_global_flag
    // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/matchAll#parameters
    if (!new RegExp(regex_string).test(string_input)) {
        return input;
    }
    const replacements = the_thing_1(string_input, new RegExp(regex_string, "g"), replacer, keep_children_as_string);
    // console.log(replacements)
    return the_thing2(string_input, replacements);
}

function the_thing_0(input: string | JSX.Element) {
    if (typeof input === "string") {
        return input;
    }
    return render_to_string(input);
}

function the_thing_1(input: string, global_regex: RegExp, replacer: Replacer, keep_children_as_string: boolean) {
    if (input.length === 0) {
        return [];
    }
    const replacements: Replacement[] = [];
    const matched = input.matchAll(global_regex);
    for (const match_array of matched) {
        // console.log(match_array)
        const whole_string = match_array[0];
        // todo format this. Not every capture group matches, but replacer expects strings so we filter out undefined. User can try and get capture group not in array from spread operator and this works just fine. TODO check if this works just fine!
        const groups = match_array.slice(1).filter((s) => s !== undefined);
        const jsx = (() => {
            if (keep_children_as_string) {
                return replacer(whole_string, ...groups);
            }
            return replacer(htmr(whole_string), ...groups.map((s) => htmr(s)));
        })();
        replacements.push({
            begin_index: match_array.index,
            end_index: match_array.index + (whole_string.length - 1),
            jsx,
        });        
    }
    return replacements;
}

function the_thing2(input: string, replacements: Replacement[]): JSX.Element {
    // const output: (string | JSX.Element)[] = [];
    // todo explain that since htmr trims, we don't do child by child, but rather the whole damn ting
    let output = "";
    let last_index = 0;
    for (const replacement of replacements) {
        if (last_index < replacement.begin_index) {
            output += input.substring(last_index, replacement.begin_index);
        }
        output += render_to_string(replacement.jsx)
        last_index = replacement.end_index + 1;
    }
    if (last_index <= (input.length - 1)) {
        output += input.substring(last_index);
    }
    return htmr(output);
    // console.log(input, replacements)
    // for (const replacement of replacements) {
    //     if (last_index < replacement.begin_index) {
    //         output.push(htmr(input.slice(last_index, replacement.begin_index)))
    //     }
    //     output.push(replacement.jsx);
    //     last_index = replacement.end_index + 1;
    // }
    // if (last_index <= (input.length - 1)) {
    //     output.push(htmr(input.slice(last_index)))
    // }
    // retrun output
}




//usually when you match regex you can have multiple matching groups. group 0 is the whole string, and then you have a string for each matching grou

// regex.test (primitive)
// string.match, matchAll
// string.split

// using matchAll to have all replacements and a global search!!
