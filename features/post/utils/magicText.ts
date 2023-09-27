export async function getMagicText(
  bearer: string,
  text: string,
  type: 'pirate' | 'medieval' | 'formal',
) {
  const options = {
    method: 'POST',
    headers: {
      location: 'https://current.fyi/v2/aipost',
      Authorization: `Bearer ${bearer}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: text,
      type: type,
    }),
  };
  const res = await fetch('https://current.fyi/v2/aipost', options);
  const data = await res.json();
  if (!data.response) {
    console.log(data);
    throw new Error('Something went wrong');
  }
  return data.response;
}
