import { get_random_item } from "../../scripts/utils";

// TODO GET THESE FROM ELSEWHERE

type Min_Root_Length = 3;
type Root_Length = Min_Root_Length | 4 | 5 | 6;
const is_min_length = (l: Root_Length): l is Min_Root_Length => l === 3;

// todo get this from elsewhere
type Transitive = "transitive-equivalence" | "transitive-sharing";
type Transitivity = "intransitive" | Transitive;
const is_transitive = (t: Transitivity): t is Transitive => t !== "intransitive";

type Shyllable_Type = "non-sonorant-shyllable" |
    "initial-pair-shyllable" |
    "medial-pair-shyllable" |
    "sonorant-shyllable" |
    "consonant-triplet-shyllable";


type Vowel = "i" | "e" | "a" | "o" | "u";



// BEGIN OF FILE


type Root_Type = Shyllable_Type | "sonorant";

type Root_Option = {
    type: Root_Type,
    letter_count: number,
};

const create_root_option = (type: Root_Type): Root_Option => {
    switch (type) {
        case "sonorant":
            return { type: "sonorant", letter_count: 1 };
        case "non-sonorant-shyllable":
            return { type: "non-sonorant-shyllable", letter_count: 2 };
        case "sonorant-shyllable":
            return { type: "sonorant-shyllable", letter_count: 2 };
        case "initial-pair-shyllable":
            return { type: "initial-pair-shyllable", letter_count: 3 };
        case "medial-pair-shyllable":
            return { type: "medial-pair-shyllable", letter_count: 3 };
        case "consonant-triplet-shyllable":
            return { type: "consonant-triplet-shyllable", letter_count: 4};
    };
};


const get_min_length_root_sequence = (transitivity: Transitivity) : Root_Option[] => {
    if (!is_transitive(transitivity)) {
        return [
            create_root_option("non-sonorant-shyllable"),
            create_root_option("sonorant"),
        ];
    } else if (transitivity === "transitive-equivalence") {
        return [create_root_option("initial-pair-shyllable")];
    } else {
        return [];
    }
};


const get_random_root_sequence = (length: Root_Length, transitivity: Transitivity): Root_Option[] => {
    const sequence: Root_Option[] = [];
    sequence.push(get_random_item([
        create_root_option("non-sonorant-shyllable"),
        create_root_option("initial-pair-shyllable"),
    ]));

    let available_shyllables: Root_Option[] = [
        create_root_option("sonorant-shyllable"),
        create_root_option("medial-pair-shyllable"),
        create_root_option("consonant-triplet-shyllable"),
    ];
    let remaining_length = length - sequence[0].letter_count;
    if (!is_transitive(transitivity)) { // match V
        remaining_length--;
    }
    while (remaining_length > 0) {
        available_shyllables = available_shyllables.filter((shyllable) => shyllable.letter_count <= remaining_length);
        const need_to_take_available_shyllable = (
            sequence.length === 1 && 
            sequence[0].type === "non-sonorant-shyllable" && 
            is_transitive(transitivity)
        );
        if (need_to_take_available_shyllable && available_shyllables.length === 1) {
            sequence.push(available_shyllables[0]);
            remaining_length -= available_shyllables[0].letter_count;
        } else {
            const chosen = get_random_item([...available_shyllables, null]);
            if (chosen === null) {
                sequence[sequence.length - 1].letter_count++;
                remaining_length--;
            } else {
               sequence.push(chosen);
                remaining_length -= chosen.letter_count;
            }
        }
    }
    if (!is_transitive(transitivity)) { // match ^
        sequence.push(create_root_option("sonorant"));
    }

    return sequence;
}


const get_vowel_ending = (transitivity: Transitivity): Vowel | null => {
    if (transitivity === "transitive-equivalence") {
        return "i";
    } else if (transitivity === "transitive-sharing") {
        return get_random_item(["e", "a", "o", "u"]);
    } else {
        return null;
    }
}


/* ENTRY */


// todo dafuq is this. rename this please
type Root_Gen_Thing = {
    sequence: Root_Option[],
    vowel_ending: Vowel | null,
}

export default function get_random_root_gen_thing(length: Root_Length, transitivity: Transitivity): Root_Gen_Thing {
    if (is_min_length(length)) {
        return {
            sequence: get_min_length_root_sequence(transitivity),
            vowel_ending: null,
        }
    }
    return {
        sequence: get_random_root_sequence(length, transitivity),
        vowel_ending: get_vowel_ending(transitivity),
    }
}
