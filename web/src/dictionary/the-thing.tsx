
import { JSX } from "preact/compat";
import render_to_string from "preact-render-to-string";
import htmr from "htmr";
// // is this file ts or tsx?



// todo types
type Replacer = (whole_string: any, ...captured_strings: any[]) => JSX.Element




type Replacement = {
    begin_index: number,
    end_index: number,
    jsx: JSX.Element,
}

export default function the_thing(input: string | (string | JSX.Element)[], regex_string: string, replacer: Replacer) {
    const string_input = the_thing_0(input);
    // the_thing_1 TODO rename and fix up this comment
    //the_thing_1 uses string.matchAll which requires a global regex.
    // however. using a global regex with regex.test advances lastIndex, thus produces
    // inconsistent behavoiur. To minimise the regex headache, we're using a separate regexp to test whether we need to do replacements
    // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test#using_test_on_a_regex_with_the_global_flag
    // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/matchAll#parameters
    if (!new RegExp(regex_string).test(string_input)) {
        return input;
    }
    const replacements = the_thing_1(string_input, new RegExp(regex_string, "g"), replacer);
    return the_thing2(string_input, replacements);
}

function the_thing_0(input: string | (string | JSX.Element)[]) {
    if (typeof input === "string") {
        return input;
    }
    const stuff = input.map((item)  => {
        if (typeof item === "string") {
            return item;
        }
        return render_to_string(item);
    });
    return stuff.join("");
}

function the_thing_1(input: string, global_regex: RegExp, replacer: Replacer) {
    if (input.length === 0) {
        return [];
    }
    const replacements: Replacement[] = [];
    const matched = input.matchAll(global_regex);
    for (const match_array of matched) {
       
        const whole_string = match_array[0];
        const groups = match_array.slice(1);
        // don't htmr the children if we're using <code> or <pre> tag as parent. this will be an option from each kit.
        const jsx = replacer((whole_string), ...groups.map((s) => (s)));
        replacements.push({
            begin_index: match_array.index,
            end_index: match_array.index + (whole_string.length - 1),
            jsx,
        });        
    }
    return replacements;
}

function the_thing2(input: string, replacements: Replacement[]) {
    const output: (string | JSX.Element)[] = [];
    let last_index = 0;
    for (const replacement of replacements) {
        if (last_index < replacement.begin_index) {
            output.push(htmr(input.slice(last_index, replacement.begin_index)))
        }
        output.push(replacement.jsx);
        last_index = replacement.end_index + 1;
    }
    if (last_index <= (input.length - 1)) {
        output.push(htmr(input.slice(last_index)))
    }
    return output;
}




//usually when you match regex you can have multiple matching groups. group 0 is the whole string, and then you have a string for each matching grou

// regex.test (primitive)
// string.match, matchAll
// string.split

// using matchAll to have all replacements and a global search!!
