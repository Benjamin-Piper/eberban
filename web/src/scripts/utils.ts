export const get_random_item = <T>(list: T[]): T => {
    return list[Math.floor(Math.random() * list.length)];
};
