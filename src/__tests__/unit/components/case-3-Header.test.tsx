import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { Provider as StoreProvider } from 'react-redux'
import { createStore } from '../../../store'

import Header from '../../../components/Header'
import { FiltersContext } from '../../../context/filters'
import { MemoryRouter } from 'react-router-dom'

describe('The Header component', () => {
  const defaultContext = {
    toggleShowingFilters: jest.fn(),
  }

  const setupHeader = (value = defaultContext) =>
    render(
      <FiltersContext.Provider value={...value as any}>
        <StoreProvider store={createStore()}>
          <MemoryRouter>
            <Header />
          </MemoryRouter>
        </StoreProvider>
      </FiltersContext.Provider>,
    )
  it('renders header correctly', () => {
    const { asFragment } = setupHeader()

    expect(asFragment()).toMatchSnapshot()
  })

  it('toggles the filter open when the Filter button is clicked', () => {
    const { getByText } = setupHeader()

    const filterButton = getByText(/filter/i)

    fireEvent.click(filterButton)

    expect(defaultContext.toggleShowingFilters).toHaveBeenCalled()
  })

  it('❌shows the filter button only on the home page', () => {})
})
