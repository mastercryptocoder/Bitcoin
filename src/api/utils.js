
export async function fetchFact(month, day) {
    const data = await fetch(
        `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/all/${month}/${day}`
    ).then((res) => res.json());

    return data;
}