/** Bounds shared by the PDP's two purchase controls — the buy panel's stepper
 *  and the mobile bar's, which drive the same piece of state. */
export const MIN_QUANTITY = 1
export const MAX_QUANTITY = 99

export function clampQuantity(value: number) {
  return Math.min(MAX_QUANTITY, Math.max(MIN_QUANTITY, value))
}
