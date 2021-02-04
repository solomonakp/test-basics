import React from 'react'
import { Axios } from '../../helpers/axios'
import { render, fireEvent, waitFor, act } from '@testing-library/react'
import { Provider as StoreProvider } from 'react-redux'
import { build, fake } from '@jackfranklin/test-data-bot'

import App from '../../components/App'
import { createStore } from '../../store'
import { FiltersWrapper } from '../../components/FiltersWrapper'
jest.mock('../../helpers/axios')

const mockedAxios = Axios as any

const setUpApp = () =>
  render(
    <StoreProvider store={createStore()}>
      <FiltersWrapper>
        <App />
      </FiltersWrapper>
    </StoreProvider>,
  )
const buildProduct = build('Product', {
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
        data: [buildProduct(), buildProduct()],
      })
    const { findByPlaceholderText, queryAllByTestId, getByText } = setUpApp()
    await waitFor(() => {
      expect(queryAllByTestId('ProductTile')).toHaveLength(3)
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
      expect(mockedAxios.get).toHaveBeenCalledTimes(2)
    })

    fireEvent.click(getByText(/View results/i))
    await waitFor(() => {
      expect(queryAllByTestId('ProductTile')).toHaveLength(2)
    })
  })
})
