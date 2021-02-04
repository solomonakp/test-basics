import React from 'react'
import { Axios } from '../../helpers/axios'
import { render, fireEvent, waitFor } from '@testing-library/react'
import { Provider as StoreProvider } from 'react-redux'
import { build, fake } from '@jackfranklin/test-data-bot'

import App from '../../components/App'
import { createStore } from '../../store'
import { FiltersWrapper } from '../../components/FiltersWrapper'
import { notDeepEqual } from 'assert'

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
describe('The app ', () => {
  const products = [buildProduct(), buildProduct(), buildProduct()]

  test('it fetches and renders all products on the page', async () => {
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
    // const {
    //   queryByTestId,
    //   findByPlaceholderText,
    //   findByTestId,
    //   queryAllByTestId,
    // } = setUpApp()
    // const searchValue = 'mexx'
    // fireEvent.click(queryByTestId('FilterButton'))
    // const searchBox = await findByPlaceholderText('largo')
    // fireEvent.change(searchBox, {
    //   target: {
    //     value: searchValue,
    //   },
    // })
    // const viewResult = await findByTestId('ViewResultsButton')
    // fireEvent.click(viewResult)
    // await waitFor(() => {
    //   expect(queryAllByTestId('ProductTile')).toHaveLength(1)
    // })
  })
})
