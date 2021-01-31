import { useEffect, RefObject } from 'react'
import elementContains from 'document.contains'

const useOutsideClick: <Element>(
  elementRef: RefObject<Element>,
  handleOutsideClick: (event: DocumentEventMap['click']) => void,
) => void = (elementRef, handleOutsideClick) => {
  useEffect(() => {
    // click event handler
    const clickEventListener = (event: DocumentEventMap['click']) => {
      if (!elementContains(elementRef.current, event.target)) {
        handleOutsideClick(event)
      }
    }
    // mounting click to dom
    document.addEventListener('click', clickEventListener, true)
    // remove while unmounting
    return () => document.removeEventListener('click', clickEventListener, true)
  }, [elementRef, handleOutsideClick])
}

export default useOutsideClick
