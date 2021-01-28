import React,{useContext} from 'react'
import { render, fireEvent } from '@testing-library/react'

import useFilters from '../../../hooks/useFilters'

import { FiltersContext } from '../../../context/filters'
import { FiltersWrapper } from '../../../components/FiltersWrapper'

const withConsumer = ()=> render (<FiltersWrapper>
                                    <FiltersContext.Consumer>
                                      {
                                        ({showingFilters,toggleShowingFilters}) => {
                                          return (
                                            <button onClick= {toggleShowingFilters} data-testid="button">
                                              {showingFilters.toString()}
                                            </button>
                                          )
                                        }
                                      }
                                    </FiltersContext.Consumer>

                                  </FiltersWrapper>)


describe('The <FiltersWrapper /> component', () => {
  const wrapper = 
  it('should render all children passed to it', () => {
    const {getByTestId} = withConsumer()
    // debug(getByText('I am a child'))
    expect(getByTestId('button')).toBeInTheDocument()

  })

  it('should update the filters context with correct state values', () => {
    const {getByTestId} = withConsumer()
    const button = (getByTestId('button'))
    expect(button.textContent).toBe('false')
    
  })

  it('should update the body style to prevent scrolling when filter is toggled', () => {
    const {debug,getByTestId,container} = withConsumer()
    const button = (getByTestId('button'))
    fireEvent.click(button)
    expect(document.body.style.overflow).toBe('hidden')
    fireEvent.click(button)
    expect(document.body.style.overflow).toBe('scroll')
  })
})
