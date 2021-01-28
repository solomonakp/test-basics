import React from 'react'
import { axe } from 'jest-axe'
import { render } from '@testing-library/react'
import ProductStream from '../../../components/ProductStream'

describe('The <ProductStream /> component', () => {
  const products = [
    {
      id: 12,
      name: 'Adidas 1',
      image: './image.png',
      price: 'from $12.99',
      brand: 'Adidas',
      createdAt: '2020-02-11 00:00:00',
      isActive: true,
    },
    {
      id: 13,
      name: 'Nike 1',
      image: './image-1.png',
      price: 'from $42.99',
      brand: 'Nike',
      createdAt: '2020-02-11 00:00:00',
      isActive: true,
    },
  ]
  
  it('renders a list of Product tiles for each product passed to it',  () => {
    const { queryAllByTestId} = render( <ProductStream products={products as any}/>) 
    expect(queryAllByTestId('ProductTile')).toHaveLength(products.length)
  
  })

  it('has no accessibility violations', async () => {
    const {container} = render( <ProductStream products={products as any}/>) 
    const result = await axe(container)
    expect(result).toHaveNoViolations()
  })
})
