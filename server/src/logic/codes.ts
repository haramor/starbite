// Generate room codes — 4 uppercase letters, easy to read out loud (no I/O/L confusion).

const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ";

export function makeRoomCode(): string {
  let s = "";
  for (let i = 0; i < 4; i++) {
    s += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return s;
}
