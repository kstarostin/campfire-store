/** Static category tree matching API seed data — for local reference only; UI uses API. */

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
      { id: 'touring-kayaks', name: 'Touring kayaks' },
      { id: 'whitewater-kayaks', name: 'Whitewater kayaks' },
      { id: 'inflatable-kayaks', name: 'Inflatable kayaks' },
      { id: 'kayak-accessories', name: 'Kayak accessories' },
    ],
  },
  {
    id: 'bicycles',
    name: 'Bicycles',
    subcategories: [
      { id: 'road-bikes', name: 'Road bikes' },
      { id: 'gravel-bikes', name: 'Gravel bikes' },
      { id: 'mountain-bikes', name: 'Mountain bikes' },
      { id: 'cycling-accessories', name: 'Cycling accessories' },
    ],
  },
  {
    id: 'camping',
    name: 'Camping',
    subcategories: [
      { id: 'tents', name: 'Tents' },
      { id: 'sleeping-bags', name: 'Sleeping bags' },
      { id: 'sleeping-pads', name: 'Sleeping pads' },
      { id: 'camp-kitchen', name: 'Camp kitchen' },
      { id: 'camping-accessories', name: 'Camping accessories' },
    ],
  },
  {
    id: 'bags-and-gear',
    name: 'Bags & gear',
    subcategories: [
      { id: 'backpacks', name: 'Backpacks' },
      { id: 'lighting-tools', name: 'Lighting & tools' },
    ],
  },
  {
    id: 'clothing',
    name: 'Clothing',
    subcategories: [
      { id: 'hiking-pants', name: 'Hiking pants' },
      { id: 'jackets-shells', name: 'Jackets & shells' },
      { id: 'midlayers-fleece', name: 'Midlayers & fleece' },
      { id: 'shorts-tights', name: 'Shorts & tights' },
    ],
  },
  {
    id: 'footwear',
    name: 'Footwear',
    subcategories: [
      { id: 'hiking-boots', name: 'Hiking boots' },
      { id: 'trail-runners', name: 'Trail runners' },
    ],
  },
  {
    id: 'ski',
    name: 'Ski',
    subcategories: [
      { id: 'all-mountain', name: 'All mountain' },
      { id: 'piste-freeride-skis', name: 'Piste & freeride skis' },
      { id: 'ski-boots', name: 'Ski boots' },
      { id: 'ski-accessories', name: 'Ski accessories' },
    ],
  },
]
