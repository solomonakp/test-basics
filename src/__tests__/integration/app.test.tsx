import React from 'react'
import { Axios } from '../../helpers/axios'
import { render, fireEvent, act, waitFor } from '@testing-library/react'
import { Provider as StoreProvider } from 'react-redux'
import { build, fake } from '@jackfranklin/test-data-bot'

import App from '../../components/App'
import store, { createStore } from '../../store'
import { FiltersWrapper } from '../../components/FiltersWrapper'

const MyApp = () => {
  return (
    <StoreProvider store={store}>
      <FiltersWrapper>
        <App />
      </FiltersWrapper>
    </StoreProvider>
  )
}

describe('The app ', () => {
  test('❌ it fetches and renders all products on the page', async () => {})

  test('❌ it can open and close the filters panel', async () => {})

  test('❌ it can search products as user types in the search field', async () => {})
})
