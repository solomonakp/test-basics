import React from 'react'
import { Axios } from '../../helpers/axios'
import {
  render,
  fireEvent,
  screen,
  act,
  waitForElementToBeRemoved,
  waitFor,
  getByTestId,
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
    const { queryByTestId } = setUpApp()
    const btn = queryByTestId('FilterButton')
    fireEvent.click(btn)
    await waitFor(() => {
      expect(queryByTestId('CloseCanvas')).toBeInTheDocument()
    })
    expect(queryByTestId('CloseCanvas')).toBeInTheDocument()
    fireEvent.click(queryByTestId('CloseCanvas'))
    await waitFor(() => {
      expect(queryByTestId('CloseCanvas')).not.toBeInTheDocument()
    })
  })

  test('it can search products as user types in the search field', async () => {
    // set up app
    const {
      queryByTestId,
      findByPlaceholderText,
      queryByPlaceholderText,
      findByTestId,
    } = setUpApp()
    const searchValue = 'mexx'
    fireEvent.click(queryByTestId('FilterButton'))
    const searchBox = await findByPlaceholderText('largo')
    fireEvent.change(searchBox, {
      target: {
        value: searchValue,
      },
    })
    const viewResult = await findByTestId('ViewResultsButton')
    fireEvent.click(viewResult)
    // await waitFor(() => {
    //   debug(queryByPlaceholderText('largo'))
    // })
    // click button
    // find textbox
    // type value
    // assert that value typed is the value of the textbox
    // click on view result
    // expect product to be the product you typed
    // if wrong product expect to get empty product
  })
})
