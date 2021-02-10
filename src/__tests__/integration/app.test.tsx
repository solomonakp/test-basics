import React from 'react'
import {
  render,
  fireEvent,
  waitFor,
  act,
  getByTestId,
} from '@testing-library/react'
import { Provider as StoreProvider } from 'react-redux'
import { buildProduct } from '../utils'
import { MemoryRouter } from 'react-router-dom'
import Modal from 'react-modal'

import { Axios } from '../../helpers/axios'
import App from '../../components/App'
import { createStore } from '../../store'
import { FiltersWrapper } from '../../components/FiltersWrapper'

jest.mock('../../helpers/axios')

const mockedAxios = Axios as any

const setUpApp = (
  routerProps = {
    initialEntries: ['/', 'products/:id'],
    initialIndex: 0,
  },
) =>
  render(
    <StoreProvider store={createStore()}>
      <MemoryRouter {...routerProps}>
        <FiltersWrapper>
          <App />
        </FiltersWrapper>
      </MemoryRouter>
    </StoreProvider>,
  )

beforeEach(() => {
  jest.useFakeTimers()
})
afterEach(() => {
  jest.clearAllMocks()
})
describe('The app ', () => {
  test('it fetches and renders all products on the page', async () => {
    const products = [buildProduct(), buildProduct(), buildProduct()]
    mockedAxios.get.mockResolvedValue({ data: products })
    const { findAllByTestId } = setUpApp()
    const product = await findAllByTestId('ProductTile')
    expect(product).toHaveLength(3)
  })

  test('it can open and close the filters panel', async () => {
    const { queryByText } = setUpApp()
    const btn = queryByText(/Filter/i)
    expect(queryByText(/View results/i)).not.toBeInTheDocument()
    fireEvent.click(btn)
    await waitFor(() => {
      expect(queryByText(/View results/i)).toBeInTheDocument()
    })
    fireEvent.click(queryByText(/View results/i))
    await waitFor(() => {
      expect(queryByText(/View results/i)).not.toBeInTheDocument()
    })
  })

  test('it can search products as user types in the search field', async () => {
    mockedAxios.get
      .mockResolvedValueOnce({
        data: [buildProduct(), buildProduct(), buildProduct()],
      })
      .mockResolvedValueOnce({
        data: [buildProduct(), buildProduct(), buildProduct(), buildProduct()],
      })
      .mockResolvedValueOnce({
        data: [buildProduct(), buildProduct()],
      })
    const { findByPlaceholderText, queryAllByTestId, getByText } = setUpApp()
    await waitFor(() => {
      expect(queryAllByTestId('ProductTile')).toHaveLength(4)
    })
    fireEvent.click(getByText(/filter/i))
    const searchBox = await findByPlaceholderText('largo')
    fireEvent.change(searchBox, {
      target: {
        value: 'mexx',
      },
    })
    act(() => {
      jest.runAllTimers()
    })

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledTimes(3)
    })

    fireEvent.click(getByText(/View results/i))
    await waitFor(() => {
      expect(queryAllByTestId('ProductTile')).toHaveLength(2)
    })
  })
  test('it can navigate to the single product page', async () => {
    const product = buildProduct()

    mockedAxios.get.mockImplementation((url) => {
      return new Promise((resolve) => {
        if (url === `products/${product.id}`) {
          return resolve({ data: product })
        }
        return resolve({ data: [product] })
      })
    })
    const { findByTestId, queryByText } = setUpApp()

    fireEvent.click(await findByTestId('ProductTileImage'))

    expect(mockedAxios.get).toHaveBeenCalledTimes(3)

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledTimes(3)
    })

    await waitFor(() => {
      expect(queryByText(product.price as string)).toBeInTheDocument()
    })
  })

  test('it can add a product to cart', async () => {
    const [product1, product2] = [buildProduct(), buildProduct()]
    mockedAxios.get.mockImplementation((url: string) => {
      return new Promise((resolve) => {
        if (url === `products/${product1.id}`) {
          return resolve({
            data: product1,
          })
        } else if (url === 'cart') {
          return resolve({
            data: [],
          })
        }
        return resolve({
          data: [product1, product2],
        })
      })
    })

    mockedAxios.post.mockImplementation(() => {
      return new Promise((resolve) => {
        return resolve({
          data: [product1, product2],
        })
      })
    })

    const { findByTestId, findByText, debug } = setUpApp({
      initialEntries: ['/', `/products/${product1.id}`],
      initialIndex: 1,
    })

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledTimes(2)
    })

    // debug(await findByText(product1.price as any))

    expect(await findByTestId('CartButton')).toHaveTextContent('Cart (0)')

    fireEvent.click(await findByText(/add to cart/i))

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledTimes(1)
    })

    expect(await findByText(/remove from cart/i)).toBeInTheDocument()

    expect(await findByTestId('CartButton')).toHaveTextContent('Cart (1)')
  })

  test('it can remove a product from cart', async () => {
    const [product1, product2] = [buildProduct(), buildProduct()]

    mockedAxios.get.mockImplementation((url: string) => {
      return new Promise((resolve) => {
        if (url === `products/${product1.id}`) {
          return resolve({
            data: product1,
          })
        } else if (url === 'cart') {
          return resolve({
            data: [product1],
          })
        }
        return resolve({
          data: [product1, product2],
        })
      })
    })

    mockedAxios.delete.mockImplementation(() => {
      return new Promise((resolve) => {
        return resolve({
          data: [],
        })
      })
    })

    const { findByTestId, findByText, debug } = setUpApp({
      initialEntries: ['/', `/products/${product1.id}`],
      initialIndex: 1,
    })

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledTimes(2)
    })

    expect(await findByTestId('CartButton')).toHaveTextContent('Cart (1)')

    fireEvent.click(await findByText(/remove from cart/i))

    await waitFor(() => {
      expect(mockedAxios.delete).toHaveBeenCalledTimes(1)
    })

    expect(await findByText(/add to cart/i)).toBeInTheDocument()

    expect(await findByTestId('CartButton')).toHaveTextContent('Cart (0)')
  })

  test.only('it can go through and complete the checkout flow', async () => {
    Modal.setAppElement(document.createElement('div'))

    const [product1, product2] = [
      {
        ...buildProduct(),
        priceUnformatted: 3000,
      },
      {
        ...buildProduct(),
        priceUnformatted: 2000,
      },
    ]

    mockedAxios.get.mockImplementation((url: string) => {
      return new Promise((resolve) => {
        if (url === `products/${product1.id}`) {
          return resolve({
            data: product1,
          })
        } else if (url === 'cart') {
          return resolve({
            data: [product1, product2],
          })
        }
        return resolve({
          data: [product1, product2],
        })
      })
    })

    mockedAxios.post.mockImplementation(() => {
      return new Promise((resolve) => {
        return resolve({
          data: 'success',
        })
      })
    })

    const { findByTestId, debug, getByText, getByTestId } = setUpApp({
      initialEntries: ['/', `/products/${product1.id}`],
      initialIndex: 1,
    })

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledTimes(2)
    })

    expect(await findByTestId('CartButton')).toHaveTextContent('Cart (2)')
    expect(getByText(/remove from cart/i)).toBeInTheDocument()

    const test_stripe_token = 'test_stripe_token'

    const createToken = jest
      .fn()
      .mockResolvedValue({ error: null, token: test_stripe_token })

    window.Stripe = jest.fn().mockReturnValue({
      createToken,
      elements: jest.fn().mockReturnValue({
        create: jest.fn().mockReturnValue({
          on: jest.fn(),
          mount: jest.fn(),
          destroy: jest.fn(),
          update: jest.fn(),
        }),
      }),
    }) as any

    fireEvent.click(getByText('Cart (2)'))

    expect(getByTestId('checkoutButton')).toHaveTextContent('Checkout $50')

    fireEvent.click(await getByTestId('checkoutButton'))

    expect(getByText('Checkout $50')).toBeInTheDocument()

    fireEvent.click(getByText(/place order/i))

    await waitFor(() => {
      expect(createToken).toHaveBeenCalledTimes(1)
    })

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith('checkout', {
        token: test_stripe_token,
      })
    })

    expect(await findByTestId('CartButton')).toHaveTextContent('Cart (0)')

    expect(await findByTestId('FilterButton')).toBeInTheDocument()

    debug()
  })
})
