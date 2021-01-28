import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import Header from '../../../components/Header'
import { FiltersContext } from '../../../context/filters'



describe('The Header component', () => {
  const defaultProps = {
    toggleShowingFilters:jest.fn()
  }
 const setUpHeader =(props=defaultProps) => (render(
  <FiltersContext.Provider value={{...props } as any}>
    <Header/>
  </FiltersContext.Provider>))




  it('renders header correctly', () => {
    const { asFragment, debug} = setUpHeader()
    expect(asFragment()).toMatchSnapshot()
  })

  it('toggles the filter open when the Filter button is clicked', () => {
    const {toggleShowingFilters} = defaultProps
    const {getByText} = setUpHeader()
    const btn = getByText('Filter')
    fireEvent.click(btn)
    expect(toggleShowingFilters).toHaveBeenCalled()
  })
})
