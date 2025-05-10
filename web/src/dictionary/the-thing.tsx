import { JSX } from "preact/compat";
// is this file ts or tsx?


type Replacer = (whole_string: string, ...captured_strings: string[]) => JSX.Element

function the_thing(input: string, regex: RegExp, replacer: Replacer) {
    if (input.length === 0) {
        return [];
    }
    return [];
}


// var res = the_thing(
//     "[E:tce pan] gives [A:tce* pan] to [O:tce pan].",
//     /\[/,
//     (_, place, arg) => <span><span>{`[`}</span></span>
// )

// res;
