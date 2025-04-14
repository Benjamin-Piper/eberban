import { describe, expect, test } from "vitest";
import lex from "./index";


describe.skip(`A string is not lexed`, () => {
    test(`if it is empty`, () => {
        expect(lex(``)).toStrictEqual([]);
    });
    describe(`if it comprises a single eberban space`, () => {
        // Note that `[` `]` `-` are not spaces
        test.for([
            `q`, `w`, `x`, `y`,
            ` `, `​`, `👀`, 
            `~`, `!`, `@`, `#`, `$`, `%`, `^`, `&`, `*`, `_`, `+`, `=`, `|`, 
            `(`, `)`,  `{`, `}`, `<`, `>`, `\\`, `/`,
            `'`, `"`, `\``,
            `:`, `;`, `,`, `.`, `?`,
        ])(`%s`, (input) => {
            expect(lex(input)).toStrictEqual([]);
        });
    });
    describe(`if it comprises a single repeated eberban space`, () => {
        test.for([
            `qq`, `   `, `​​`, `👀👀👀👀👀`, `||||||`,
            `>>>>>>>`, `''''''''`, `:::::::::`,
        ])(`%s`, (input) => {
            expect(lex(input)).toStrictEqual([]);
        });
    });
    describe(`if it comprises a multitude of eberban spaces`, () => {
        test.for([
            `qwwwwqqyyyxxx`, ` q q q q `, `~!@&^#%`, `(*&www👀*)`,
        ])(`%s`, (input) => {
            expect(lex(input)).toStrictEqual([]);
        });
    });
});


describe.skip(`An eberban particle is lexed`, () => {
    describe(`
        if it begins with one non-sonorant consonant and is followed by at least
        one vhowel
        `,
        () => {
            test.for([`zi`, `mio`, `tiho`])(`%s`, (input) => {
                expect(lex(input)).toStrictEqual([{ type: `Particle`, value: input }]);
            });
        },
    );
    describe(`
        if it begins with at least one vhowel and is followed by any number of
        sonorant-vunits
        `,
        () => {
            test.for([`a`, `ahu`, `al`, `anu`, `oie`, `oiu`])(`%s`, (input) => {
                expect(lex(input)).toStrictEqual([{ type: `Particle`, value: input }]);
            });
        },
    );
    describe(`if it comprises one or more sonorant-vunits`, () => {
        test.for([`ni`, `ra`, `lu`])(`%s`, (input) => {
            expect(lex(input)).toStrictEqual([{ type: `Particle`, value: input }]);
        });
    });
});


describe.skip(`An eberban root is lexed`, () => {
   // describe(`if it begins with one non-sonorant-vunit and is followed by
   // any number of sonorant-vunits medial-pair-vunits consonant-triplet-vunits.
   // If it was followed by none of these, it must end in a sonorant.`)
});
// describe.skip(`An eberban word`, () => {

//     // todo actually describe the morphology!!
//     describe(`Root`, () => {
//         test.for([
//             `ber`, `ste`, `mana`, `pcien`, `zguhi`, `kagvini`,
//             `psuoua`, `jetmna`, // not in dictionary as of 2025-04-14
//         ])(`%s`, (input) => {
//             expect(lex(input)).toStrictEqual([ { type: `Root`, value: input }]);
//         })
//     });
//     // todo actually describe the morphology!!
//     // todo merge borrowing and freeform together
//     describe(`Borrowing", () => {
//         test.for([
//             { 
//                 input: ".uspot.",
//                 output: { type: "Borrowing", prefix: "u", value: "spot" },
//             },
//             { 
//                 input: ".upidza.",
//                 output: { type: "Borrowing", prefix: "u", value: "pidza" },
//             },
//             { 
//                 input: ".ukantri.",
//                 output: { type: "Borrowing", prefix: "u", value: "kantri" },
//             },
//             { 
//                 input: ".ukultur.",
//                 output: { type: "Borrowing", prefix: "u", value: "kultur" },
//             },
//             { 
//                 input: ".uaktcuali.",
//                 output: { type: "Borrowing", prefix: "u", value: "aktcuali" },
//             },
//             { 
//                 input: ".uaisukrim.",
//                 output: { type: "Borrowing", prefix: "u", value: "aisukrim" },
//             },
//             { 
//                 input: ".u.unisaikel.",
//                 output: { type: "Borrowing", prefix: "u", value: "unisaikel" },
//             },
//             { 
//                 input: "u.pterodactil.",
//                 output: { type: "Borrowing", prefix: "u", value: "pterodactil" },
//             },

//         ])("$input -> Borrowing($output.value)", ({ input, output }) => {
//             expect(lex(input)).toStrictEqual([output]);
//         })

//     });

//         // Pi Pm CmCmCi  Son NonSonCon  Son Pi h V C
//         // pfefernusa
//         // dodjabol
//         // harduhat
//         // meilarum
//     describe("Compound", () => {

//     });
// });

// // TODO make sure typescript works
// // TODO make sure CI works
