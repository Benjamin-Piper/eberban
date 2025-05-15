
import { JSX } from "preact/compat";
import render_to_string from "preact-render-to-string";
import htmr from "htmr";


type JSX_Child = string | JSX.Element;

type Replacer = (whole_string: string, ...captured_strings: string[]) => JSX.Element;

type Replacement = {
    begin_index: number,
    end_index: number,
    jsx: JSX.Element,
};

// string.matchAll() requires a global regex.
type Global_Regex = RegExp;


export default function markup_to_jsx_child(
    input: JSX_Child,
    regex_string: string,
    replacer: Replacer,
    keep_children_as_string: boolean,
) {
    const string_input = jsx_children_to_string(input);

    // We use a separate regex to test whether we need to make_replacements().
    // This is because using regex.test() on a global regex advances its lastIndex
    // and that will produce inconsistent behaviour.
    if (!new RegExp(regex_string).test(string_input)) {
        return input;
    }
    const replacements = make_replacements(
        string_input,
        new RegExp(regex_string, "g"),
        replacer,
        keep_children_as_string
    );
    return replace_string_with_jsx(string_input, replacements);
}

function jsx_children_to_string(input: JSX_Child): string {
    if (typeof input === "string") {
            return input;
        }
    return render_to_string(input);
    // return input.map((child) => {
    //     if (typeof child === "string") {
    //         return child;
    //     }
    //     return render_to_string(child);
    // }).reduce((acc, curr) => acc + curr, "");
}

function make_replacements(
    input: string,
    regex: Global_Regex,
    replacer: Replacer,
    keep_children_as_string: boolean
) {
    if (input.length === 0) {
        return [];
    }
    const replacements: Replacement[] = [];
    const matched = input.matchAll(regex);
    for (const match_array of matched) {
        const whole_string = match_array[0];
        // Not every capture group of the regex will match. We filter out failed
        // captures so that the replacer() only gets the captured strings.
        const captured_strings = match_array.slice(1).filter((x) => x !== undefined);
        const jsx = (() => {
            if (keep_children_as_string) {
                return replacer(whole_string, ...captured_strings);
            }
            return replacer(htmr(whole_string), ...captured_strings.map((s) => htmr(s)));
        })();
        replacements.push({
            begin_index: match_array.index,
            end_index: match_array.index + (whole_string.length - 1),
            jsx,
        });        
    }
    return replacements;
}

function replace_string_with_jsx(input: string, replacements: Replacement[]): JSX_Child {
    // Considered alternative: returning JSX_Child[].
    // React will render this but 
    // This won't work because htmr() trims its string input. So the string 
    // This function relies on htmr() to return JSX.Element. Because htmr()
    // trims its string input, 
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
    
//    let output: JSX_Child[] = [];
//    let last_index = 0;
//     for (const replacement of replacements) {
//         if (last_index < replacement.begin_index) {
//             output.push(input.substring(last_index, replacement.begin_index));
//         }
//         output.push(replacement.jsx);
//         last_index = replacement.end_index + 1;
//     }
//     if (last_index <= (input.length - 1)) {
//         output.push(input.substring(last_index));
//     }
    return output;
}
