import the_thing from "./the-thing";
import {
    any,
    any_of,
    any_number_of,
    backslash,
    does_not_begin_with,
    fewest_positive_number_of,
    group,
    line_feed,
    non_capturing_group,
    not_in_set,
    one_or_more,
    optional,
    set,
    space,
    word_char,
} from "../scripts/regex";


/* HELPERS */



// function DictLink({ children }) {
//     return <a href={`#${children}`}>{children}</a>;
// }


/* 
    Kit :: () -> { regex_string: string, replacer: string -> JSX, keep_children_as_string: boolean? }

    Kits are how we extend markup syntax. They're written as functions for
    readability.
*/


function break_kit() {
    return {
        regex_string: group(backslash + line_feed),
        replacer: () => <br />,
    };
}

function bold_kit() {
    const bolded = (s) => "__" + s + "__";
    return {
        regex_string: bolded(group(fewest_positive_number_of(not_in_set("_")))),
        replacer: (_, content) => <strong>{content}</strong>,
    };
}

function italics_kit() {
    const in_italics = (s) => "_" + s + "_";
    return {
        regex_string: in_italics(group(fewest_positive_number_of(not_in_set("_")))),
        replacer: (_, content) => <em>{content}</em>,
    };
}

function definition_quote_kit() {
    const in_quote = (s) => "`" + s + "`";
    return {
        keep_children_as_string: true,
        regex_string: in_quote(group(fewest_positive_number_of(any))),
        replacer: (_, content) => <code>{content}</code>,
    };
}

// function eberban_quote_kit() {
//     function whole() {
//         const in_quote = (s) => "{" + s + "}";
//         return {
//             regex: new RegExp(group(in_quote(fewest_positive_number_of(any))), "g"),
//             replacer: (string) => {
//                 const kit = content_kit();
//                 let content = remove_delimiters(string);
//                 content = reactStringReplace(content, kit.regex, kit.replacer);
//                 content = reactStringReplace(content, "!", () => "");
//                 return <span class="ebb-quote">{content}</span>;
//             },
//         };
//     };
//     function content_kit() {
//         const as_one_link = (s) => "<" + s + ">";
//         const simple_word_link = 
//             does_not_begin_with("!" + any_number_of(word_char)) + one_or_more(word_char);
//         const compound_word_link = as_one_link(non_capturing_group(
//             fewest_positive_number_of(
//                 non_capturing_group(one_or_more(word_char) + optional(space)),
//             ),
//         ));
//         return {
//             regex: new RegExp(group(any_of(simple_word_link, compound_word_link)), "g"),
//             replacer: (string) => {
//                 let output = string;
//                 if (new RegExp(compound_word_link).test(output)) {
//                     output = remove_delimiters(output);
//                 }
//                 return <DictLink>{output}</DictLink>;
//             }
//         };
//     };
//     return whole();
// }

// function place_kit() {
//     function whole() {
//         const in_brackets = (s) => "\\[" + s + "\\]";
//         const place = set("E", "A", "O", "U");
//         const arg = non_capturing_group(":" + fewest_positive_number_of(any));
//         return {
//             regex: new RegExp(group(in_brackets(place + optional(arg))), "g"),
//             replacer: (string) => {
//                 const [_, left_bracket, content, right_bracket] = string.match(
//                     new RegExp(group("\\[") + group(one_or_more(any)) + group("\\]"))
//                 );
//                 const kit = content_kit();
//                 return (
//                     <span class="label label-info place">
//                         <span class="hidden">{left_bracket}</span>
//                         {reactStringReplace(content, kit.regex, kit.replacer)}
//                         <span class="hidden">{right_bracket}</span>
//                     </span>
//                 );
//             },
//         };
//     };
//     function content_kit() {
//         return {
//             regex: new RegExp(group(word_char + one_or_more(word_char)), "g"),
//             replacer: (s) => <DictLink>{s}</DictLink>,
//         };
//     };
//     return whole();
// }


/* ENTRY */


export function markup_inline(text) {
    let output = text;
    const markup_kits = [
        break_kit,
        bold_kit, // todo write about this in commit msg. order no matter now :)
        italics_kit,
        definition_quote_kit,
        // eberban_quote_kit,
        // place_kit,
    ];
    for (const kit of markup_kits) {
        const { keep_children_as_string, regex_string, replacer } = kit();
        // console.log(output)
        output = the_thing(output, regex_string, replacer, keep_children_as_string);
    }
    return output;
}

export function markup_block(text) {
    return text
        .split(new RegExp(group(line_feed + line_feed), "g"))
        .map((content) => <p>{markup_inline(content)}</p>);    
}
