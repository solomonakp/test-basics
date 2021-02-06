import React from 'react'
import { axe } from 'jest-axe'
import { render, fireEvent } from '@testing-library/react'
import Checkbox from '../../../components/Checkbox'
// import { cleanup } from '@testing-library/react-hooks';

/**
 * This checkbox component renders a checkbox with a label.
 * Since we customized the default checkbox, we want to
 * make sure it still works as a regular checkbox
 * should.
 */

const defaultCheckboxProps = {
  label: 'TEST_CHECKBOX_LABEL',
  id: 'TEST_CHECKBOX_ID',
  background: '#000',
  checkMarkBackground: '#fff',
  onChange: jest.fn(),
  checked: false,
}
const setUpCheckbox = (props = defaultCheckboxProps) =>
  render(<Checkbox {...props} />)

describe('The <Checkbox /> component', () => {
  it('Should render the label and checkbox the user will see', () => {
    const { asFragment } = setUpCheckbox()
    expect(asFragment()).toMatchSnapshot()
  })

  it('Should make the checkbox accessible by setting the id and htmlFor attributes on label and checkbox', () => {
    const { getByLabelText } = setUpCheckbox()
    expect(getByLabelText('TEST_CHECKBOX_LABEL')).toBeInTheDocument()
  })

  it('Should call the onChange handler when it is provided', () => {
    // get checkbox props
    const { onChange, label } = defaultCheckboxProps
    // render component
    const { getByLabelText } = setUpCheckbox()
    //  get checkbox
    const checkbox = getByLabelText(label)
    //  fire click event on checkbox
    fireEvent.click(checkbox)
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it(' Should change state correctly when clicked (checked and unchecked)', () => {
    const { label } = defaultCheckboxProps
    const { getByLabelText } = setUpCheckbox({
      ...defaultCheckboxProps,
      checked: true,
    })
    const checkbox = getByLabelText(label)
    expect(checkbox).toBeChecked()
  })

  it(' should not fail any accessibility tests', async () => {
    const { container } = setUpCheckbox()
    const result = await axe(container)

    expect(result).toHaveNoViolations()
  })
})
