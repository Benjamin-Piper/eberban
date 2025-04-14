// One layer of nesting is needed to represent compound words.

interface Lexeme {
    readonly type: string,
    readonly prefix?: string
    readonly value: string | Nested_Lexeme[],
};

interface Nested_Lexeme {
    readonly type: string
    readonly prefix?: string
    readonly value: string
}

export default function lex(input: string): Lexeme[] {
    return [
        { type: "InvalidType", value: "InvalidValue" },
    ];
}
