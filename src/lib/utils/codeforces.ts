export async function getUserRating(handle: string) {
  const res = await fetch(
    `https://codeforces.com/api/user.info?handles=${handle}`
  );
  const data = await res.json();
  if (data.status !== "OK") throw new Error("Invalid Codeforces handle");
  return data.result[0].rating; // returns rating as number
}
