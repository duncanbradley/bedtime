import { csvParse, autoType } from 'd3-dsv';
export const prerender = true;

export const load = async ({ fetch }) => {
const res = await fetch(`${import.meta.env.BASE_URL}data/sleep.csv`);
    const text = await res.text();
    return {
        sleep: csvParse(text, autoType)
    };
};