import React from 'react'
import { render,fireEvent} from '@testing-library/react'

import { useFilters } from '../../../hooks/useFilters'
import { FiltersContext } from '../../../context/filters'

const result = {} as any 
const TestHook = (params) => {
 result.current = useFilters()
 const {toggleShowingFilters} = result.current
  return null
}
const setUpHook = () => (render(<TestHook/>))

describe('The useFilters hook', () => {
  it('❌ returns the current value of the filters context', () => {
    const {getByText,debug} = setUpHook()
    const {current} = result 
    expect(current.showingFilters).toBe(false)
  })
})
