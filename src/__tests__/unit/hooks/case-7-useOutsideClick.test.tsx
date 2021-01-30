import React, { useRef, useState } from 'react'
import { render, fireEvent } from '@testing-library/react'

import useOutsideClick from '../../../hooks/useOutsideClick'

describe('The useOutsideClick hook', () => {
  // This test is important if you are going to be creating libraries in future.
  // Very important to make sure the component is used the right way.
  // This test can be migrated in future, if the useOutsideClick
  // hook is moved to an external library at your company.
  const handleClick = jest.fn()
  const Component = () => {
    const buttonRef = useRef(null) as any
    const [buttonText, setButtonText] = useState('click') as any

    useOutsideClick(buttonRef, () => {
      handleClick()
    })

    return (
      <button
        ref={buttonRef}
        onClick={() => setButtonText('button clicked')}
        data-testid="test-btn"
      >
        {buttonText}
      </button>
    )
  }
  const setUpOutsideClick = () => render(<Component />)

  it('❌ calls the outside click handler when an outside click is initiated', () => {
    const { debug, getByTestId, container } = setUpOutsideClick()
    const btn = getByTestId('test-btn')
    debug()
    fireEvent.click(btn)
    expect(btn.textContent).toBe('button clicked')
    fireEvent.click(container)
    expect(handleClick).toHaveBeenCalled()
  })

  it('❌ cleans up the event listeners after component is unmounted', () => {})
})
