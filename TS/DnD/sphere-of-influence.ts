import { Point, Dimensions } from '.'

export class SphereOfInfluence {
  pos: Point

  constructor(center: Point, public dimensions: Dimensions) {
    this.pos = {
      x: center.x - dimensions.width / 2 + (dimensions.bumpX || 0),
      y: center.y - dimensions.height / 2 + (dimensions.bumpY || 0)
    }
  }

  get width() {
    return this.dimensions.width
  }

  get height() {
    return this.dimensions.height
  }

  get left () {
    return this.pos.x
  }

  get right () {
    return this.pos.x + this.width
  }

  get top () {
    return this.pos.y
  }

  get bottom () {
    return this.pos.y + this.height
  }

  get bottomLeft() {
    return {
      x: this.left,
      y: this.bottom
    }
  }

  get bottomRight() {
    return {
      x: this.right,
      y: this.bottom
    }
  }

  get topLeft() {
    return {
      x: this.left,
      y: this.top
    }
  }

  get topRight() {
    return {
      x: this.right,
      y: this.top
    }
  }

  get centerX() {
    return this.pos.x + this.width/2
  }

  get centerY() {
    return this.pos.y + this.height/2
  }

  get centerBottom() {
    return {
      x: this.centerX,
      y: this.bottom
    }
  }

  get centerTop() {
    return {
      x: this.centerX,
      y: this.top
    }
  }

  get centerLeft() {
    return {
      x: this.left,
      y: this.centerY
    }
  }

  get centerRight() {
    return {
      x: this.right,
      y: this.centerY
    }
  }

}
