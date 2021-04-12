import { Rect, IElement } from './client-rect'

export interface IHTMLElement extends IElement {
  addEventListener: (event:string, handler: (e) => void) => void
  removeEventListener: (event:string, handler: (e) => void) => void
  classList: {
  	add: (cls: string) => void
  	remove: (cls: string) => void
  }
}
