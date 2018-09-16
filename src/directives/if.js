/**
 @license
 Copyright (c) 2018 Eyal Avichay <eavichay@gmail.com>

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */
import { Slim } from '../Slim'

Slim.customDirective(
  attr => attr.nodeName === 's:if',
  /**
   *
   * @param {HTMLElement|Object} source
   * @param {HTMLElement|Object} target
   * @param {Object} attribute
   */
  (source, target, attribute) => {
    let expression = attribute.value
    let path = expression
    let isNegative = false
    if (path.charAt(0) === '!') {
      path = path.slice(1)
      isNegative = true
    }
    let oldValue
    const anchor = document.createComment(`{$target.localName} if:${expression}`)
    target.parentNode.insertBefore(anchor, target)
    const fn = () => {
      let value = !!Slim.lookup(source, path, target)
      if (isNegative) {
        value = !value
      }
      if (value === oldValue) return
      if (value) {
        if (target.__isSlim) {
          target.createdCallback()
        }
        anchor.parentNode.insertBefore(target, anchor.nextSibling)
      } else {
        Slim.removeChild(target)
      }
      oldValue = value
    }
    Slim.bind(source, target, path, fn)
  },
  true
)
