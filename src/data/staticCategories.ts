/** Static category tree matching API seed data — replaced by API in Phase 3. */

export interface StaticCategory {
  id: string
  name: string
  subcategories: { id: string; name: string }[]
}

export const staticCategories: StaticCategory[] = [
  {
    id: 'kayaks',
    name: 'Kayaks',
    subcategories: [
      { id: 'touring', name: 'Touring kayaks' },
      { id: 'whitewater', name: 'Whitewater kayaks' },
      { id: 'inflatable', name: 'Inflatable kayaks' },
    ],
  },
  {
    id: 'bicycles',
    name: 'Bicycles',
    subcategories: [
      { id: 'road', name: 'Road bikes' },
      { id: 'gravel', name: 'Gravel bikes' },
      { id: 'mountain', name: 'Mountain bikes' },
    ],
  },
  {
    id: 'camping',
    name: 'Camping',
    subcategories: [{ id: 'tents', name: 'Tents' }],
  },
  {
    id: 'accessories',
    name: 'Accessories',
    subcategories: [{ id: 'backpacks', name: 'Backpacks' }],
  },
  {
    id: 'clothing',
    name: 'Clothing',
    subcategories: [{ id: 'hiking-pants', name: 'Hiking pants' }],
  },
  {
    id: 'ski',
    name: 'Ski',
    subcategories: [{ id: 'all-mountain', name: 'All mountain' }],
  },
]
