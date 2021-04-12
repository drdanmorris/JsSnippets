import { SphereOfInfluence, Point, Dimensions, DeltaPos } from '.'

export class Position implements Point {
  _x: number = 0
  _y: number = 0

  constructor(xOrPos: number | Point , y?: number) {
    if (typeof xOrPos === 'number' && typeof y !== 'undefined') {
      this.x = xOrPos
      this.y = y
    } else {
      this.x = (xOrPos as Point).x
      this.y = (xOrPos as Point).y
    }
  }

  get pos() {
    return {
      x: this.x,
      y: this.y
    }
  }

  get x() {
    return this._x
  }

  set x(value: number) {
    this._x = value
  }

  get y() {
    return this._y
  }

  set y(value: number) {
    this._y = value
  }

  getDelta(newPos: Position | undefined) {
    const pos2 = newPos || this
    const delta: DeltaPos = {
      dx: this.x - pos2.x,
      dy: this.y - pos2.y
    }
    return delta
  }

}
