import { build, fake } from '@jackfranklin/test-data-bot'

export const buildProduct = build('Product', {
  fields: {
    id: fake((f) => f.random.number()),
    name: fake((f) => f.lorem.words()),
    image: fake((f) => f.image.imageUrl()),
    price: fake((f) => `from $${f.random.number(100)}`),
    brand: fake((f) => f.lorem.word()),
    createdAt: fake((f) => f.date.recent()),
    isActive: fake((f) => true),
  },
})
