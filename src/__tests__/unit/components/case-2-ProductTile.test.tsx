import React from 'react'
import { render } from '@testing-library/react'
import ProductTile from '../../../components/ProductTile'
import { MemoryRouter } from 'react-router-dom'
import { axe } from 'jest-axe'

const defaultProduct = {
  id: 12,
  name: 'Example product name',
  image: '/image.png',
  price: 'from $12.99',
  brand: 'Adidas',
  createdAt: '2020-02-11 00:00:00',
  isActive: true,
}
const setUpProduct = (props = defaultProduct) =>
  render(
    <MemoryRouter>
      <ProductTile {...(props as any)} />
    </MemoryRouter>,
  )

describe('The <ProductTile /> component', () => {
  it(' renders a product tile with name, image and price', () => {
    const { name, price } = defaultProduct
    const { getByAltText, getByText } = setUpProduct()
    expect(getByText(name)).toBeInTheDocument()
    expect(getByText(price)).toBeInTheDocument()
    expect(getByAltText(name)).toBeInTheDocument()
  })

  it('renders a product tile with name and price only', () => {
    const { name, price } = defaultProduct
    const { queryByAltText, getByText } = setUpProduct({
      ...defaultProduct,
      image: null,
    })
    expect(getByText(name)).toBeInTheDocument()
    expect(getByText(price)).toBeInTheDocument()
    expect(queryByAltText(name)).toBeNull()
    // debug(queryByAltText(name))
  })

  it('has no accessibility violations', async () => {
    const { container } = setUpProduct()
    const result = await axe(container)
    expect(result).toHaveNoViolations()
  })
})
