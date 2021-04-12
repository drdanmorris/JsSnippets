import { Position, Point, DeltaPos } from './'

export interface IRect {
  top: number
  left: number
  bottom: number
  right: number
  height: number
  width: number
}

export interface DragVector {
  dx: number
  dy: number
}

export interface IElement {
  getBoundingClientRect: () => IRect
}

export class Rect {
  private __rect: IRect | undefined
  public element: IElement | undefined
  public id: string | undefined

  constructor(idOrElement: string | IElement) {
    if (typeof idOrElement === 'string') {
      this.id = idOrElement
    } else if (idOrElement !== null || typeof idOrElement !== 'undefined') {
      this.element = idOrElement
      this.id = (this.element as HTMLElement).getAttribute('id') || 'noid'
    }

    if (typeof this.id === 'undefined' && typeof this.element === 'undefined') {
      console.log('No DOM reference provided for Rect')
    }
  }

  public containsPoint(pos: Position) {
    this.init()
    return (
      pos.x >= this.rect.left &&
      pos.x <= this.rect.right &&
      pos.y >= this.rect.top &&
      pos.y <= this.rect.bottom
     )
  }

  public init() {
    this.__rect = this.__rect || this.boundingClientRect
  }

  public reset() {
    this.__rect = undefined
  }

  private rectContainsPoint(pos: Point, rect: IRect) {
    return pos.x >= rect.left &&
      pos.x <= rect.right &&
      pos.y >= rect.top &&
      pos.y <= rect.bottom
  }

  get boundingClientRect() {
    if (!this.element && this.id) {
      this.element = (document.querySelector(`#${this.id}`) || undefined)
    }
    if (this.element) {
      return this.element.getBoundingClientRect()
    }
    throw new Error('No element defined in Rect')
  }

  get rect() {
    if (typeof this.__rect === 'undefined') {
      this.init()
    }
    if (typeof this.__rect === 'undefined') {
      throw new Error('Rect not defined')
    }
    return this.__rect
  }

  get height() {
    return this.rect.height
  }

  get width() {
    return this.rect.width
  }

  get point() {
    return {
      x: this.rect.left,
      y: this.rect.top
    }
  }

  get midBottom() {
    return {
      x: this.rect.left + this.width/2,
      y: this.rect.bottom
     }
  }

  get midTop() {
    return {
      x: this.rect.left + this.width/2,
      y: this.rect.top
     }
  }

  get midLeft() {
    return {
      x: this.rect.left,
      y: this.rect.top + this.height/2
     }
  }

  get midRight() {
    return {
      x: this.rect.right,
      y: this.rect.top + this.height/2
     }
  }

  get center() {
    return {
      x: this.rect.left + this.width/2,
      y: this.rect.top + this.height/2
     }
  }

  deltaTo(pos: Position) {
    const delta: DeltaPos = {
      dx: 0,
      dy: 0
    }
    if (pos.y > this.rect.bottom) {
      delta.dy = pos.y - this.rect.bottom
    } else if (pos.y < this.rect.top) {
      delta.dy = pos.y - this.rect.top
    }

    if (pos.x > this.rect.right) {
      delta.dx = pos.x - this.rect.right
    } else if (pos.x < this.rect.left) {
      delta.dx = pos.x - this.rect.left
    }

    return delta
  }

}
