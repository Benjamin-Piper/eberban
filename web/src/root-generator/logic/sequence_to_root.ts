import { get_random_item } from "../../scripts/utils";
import { all_vowels } from "../../scripts/eberban_symbols";

function generate_mahul(letter_count: number): string[] {
    const mahul: string[] = [get_random_item(all_vowels)]; // todo make Mahul type
    // Vowels only.
    if (letter_count === 1) {
        return mahul;
    }
    if (letter_count === 2) {
        const second = get_random_item(all_vowels.filter((v) => v !== mahul[0]));
        return mahul.concat(second);
    }
    // Mahul "h" can only be between 2 vowels, so we introduce it now.
    const all_mahul_chars = all_vowels.concat("h");
    let mahul_char_pool = all_mahul_chars.filter((m) => m !== mahul[0])
    for (let count = letter_count - 1; count > 0; count--) {
        if (count === 1) {
            mahul_char_pool = mahul_char_pool.filter((m) => m !== "h");
        }
        const latest = get_random_item(mahul_char_pool);
        mahul.push(latest);
        mahul_char_pool = all_mahul_chars.filter((m) => m !== latest);
    }
    return mahul;
}
