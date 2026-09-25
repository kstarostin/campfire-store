export type CategoryTone = 'primary' | 'secondary' | 'muted'

const TONES: CategoryTone[] = ['primary', 'secondary', 'muted']

function hashOf(key: string): number {
  let hash = 101

  for (let index = 0; index < key.length; index += 1) {
    hash = ((hash * 33) ^ key.charCodeAt(index)) >>> 0
  }

  return hash
}

/**
 * Assigns a card accent to each category, in order.
 *
 * Deliberately not `Math.random()`: the colour has to survive re-renders,
 * expand/collapse and reloads, or the whole section would reshuffle every time
 * state changed. Hashing each code keeps the choice arbitrary-looking but
 * fixed, so a category always wears the same colour.
 *
 * Two neighbours never share a tone. Where the hash would repeat the previous
 * card's colour it is rotated on by one or two places — which of the two is
 * itself taken from the hash, so the correction stays deterministic rather
 * than always landing on the same substitute.
 *
 * Pass the full list and slice afterwards, not the other way round: tones are
 * positional, so assigning them to a truncated list would recolour the first
 * cards the moment the section expands.
 */
export function categoryTones(keys: string[]): CategoryTone[] {
  const tones: CategoryTone[] = []

  for (const key of keys) {
    const hash = hashOf(key)
    let tone = TONES[hash % TONES.length]

    if (tone === tones[tones.length - 1]) {
      const step = 1 + (hash % (TONES.length - 1))
      tone = TONES[(TONES.indexOf(tone) + step) % TONES.length]
    }

    tones.push(tone)
  }

  return tones
}
