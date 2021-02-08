import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { Provider as StoreProvider } from 'react-redux'
import { createStore } from '../../../store'

import Header from '../../../components/Header'
import { FiltersContext } from '../../../context/filters'
import { MemoryRouter, Link } from 'react-router-dom'
import { notDeepEqual } from 'assert'

describe('The Header component', () => {
  const defaultProps = {
    toggleShowingFilters: jest.fn(),
  }
  const setUpHeader = (
    props = defaultProps,
    router = {
      initialEntries: ['/', 'products'],
      initialIndex: 0,
    },
  ) =>
    render(
      <FiltersContext.Provider value={{ ...props } as any}>
        <StoreProvider store={createStore()}>
          <MemoryRouter {...router}>
            <Header />
            {/* <Link to="/products" data-testid="link">
              products
            </Link> */}
          </MemoryRouter>
        </StoreProvider>
      </FiltersContext.Provider>,
    )

  it('renders header correctly', () => {
    const { asFragment, debug } = setUpHeader()
    expect(asFragment()).toMatchSnapshot()
  })

  it('toggles the filter open when the Filter button is clicked', () => {
    const { toggleShowingFilters } = defaultProps
    const { getByText } = setUpHeader()
    const btn = getByText('Filter')
    fireEvent.click(btn)
    expect(toggleShowingFilters).toHaveBeenCalled()
  })
  it('❌shows the filter button only on the home page', () => {
    const { queryByText, getByTestId } = setUpHeader(undefined, {
      initialEntries: ['/', 'products'],
      initialIndex: 1,
    })

    expect(queryByText(/filter/i)).not.toBeInTheDocument()
  })
})
