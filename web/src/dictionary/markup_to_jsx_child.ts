
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
    input: JSX_Child | JSX_Child[],
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

function jsx_children_to_string(children: JSX_Child | JSX_Child[]): string {
    const format = (child: JSX_Child) => {
        if (typeof child === "string") {
            return child;
        }
        return render_to_string(child);      
    };
    if (Array.isArray(children)) {
        return children.map(format).reduce((acc, curr) => acc + curr, "");
    }
    return format(children);
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
        // console.log(match_array.slice(1))
        const captured_strings = match_array.slice(1).filter((x) => x !== undefined);
        const jsx = (() => {
            // console.log(keep_children_as_string)
            // console.log(regex, keep_children_as_string);
            // console.log(whole_string, captured_strings);
            // console.log(replacer(htmr(whole_string), ...captured_strings.map(s => htmr(s))));
            // captured_strings.forEach(console.log)
            console.log(match_array.index)
            console.log(whole_string, whole_string.length, captured_strings, keep_children_as_string)
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

function replace_string_with_jsx(input: string, replacements: Replacement[]): JSX_Child[] {
   let output: JSX_Child[] = [];
   let last_index = 0;
    for (const replacement of replacements) {
        if (last_index < replacement.begin_index) {
            output.push(htmr(input.substring(last_index, replacement.begin_index)));
        }
        output.push(replacement.jsx);
        last_index = replacement.end_index + 1;
    }
    if (last_index <= (input.length - 1)) {
        output.push(htmr(input.substring(last_index)));
    }
    return output;
}

// ah, finally
// OK so why doesn't array work?
// well, since we render everything to string so that regex becomes easier (can't do string.matchAll otherwise), we'll need to hydrate everything back again
// ok, fine. but when we do that, htmr trims. Not good. inconsistent behavoiur
