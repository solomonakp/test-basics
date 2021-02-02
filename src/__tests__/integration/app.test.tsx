import React from 'react'
import { Axios } from '../../helpers/axios'
import {
  render,
  fireEvent,
  act,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import { Provider as StoreProvider } from 'react-redux'
import { build, fake } from '@jackfranklin/test-data-bot'

import App from '../../components/App'
import { createStore } from '../../store'
import { FiltersWrapper } from '../../components/FiltersWrapper'
import { debug } from 'console'

const setUpApp = () =>
  render(
    <StoreProvider store={createStore()}>
      <FiltersWrapper>
        <App />
      </FiltersWrapper>
    </StoreProvider>,
  )
describe('The app ', () => {
  test('it fetches and renders all products on the page', async () => {
    const { findAllByTestId } = setUpApp()
    const product = await findAllByTestId('ProductTile')
    expect(product).not.toHaveLength(0)
  })

  test('it can open and close the filters panel', async () => {
    const { container, queryByTestId } = setUpApp()
    const btn = queryByTestId('FilterButton')
    fireEvent.click(btn)
    expect(queryByTestId('CloseCanvas')).toBeInTheDocument()
    fireEvent.click(container)
    expect(queryByTestId('CloseCanvas')).toBeNull()
  })

  test('❌ it can search products as user types in the search field', async () => {})
})
