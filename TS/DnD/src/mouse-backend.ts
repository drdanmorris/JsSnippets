import { Position } from './position'
import { DragAndDropItem } from './drag-drop-item'

export class MouseBackend {

  private clickMouseJitterAllowance = 10
  private clickMouseDownMaxTimeAllowance = 400
  private mouseOutTolerence = 2
  private mousePos: Position | undefined
  private mouseStamp = 0
  private dragInitialised = false

  constructor(private item: DragAndDropItem) {
    this.mouseDown = this.mouseDown.bind(this)
    this.mouseUp = this.mouseUp.bind(this)
    this.mouseMove = this.mouseMove.bind(this)
    this.wirePersistentHandlers()
  }

  public unwire() {
    this.item.element.removeEventListener('mousedown', this.mouseDown)
    this.item.element.removeEventListener('mouseUp', this.mouseUp)
  }

  get now() {
    return new Date().getTime()
  }

  get windowHeight() {
    return window.innerHeight
  }

  get windowWidth() {
    return window.innerWidth
  }

  private wirePersistentHandlers() {
    this.item.element.addEventListener('mousedown', this.mouseDown)
    this.item.element.addEventListener('mouseUp', this.mouseUp)
  }

  private wireDragHandlers() {
    document.addEventListener('mouseup', this.mouseUp)
    document.addEventListener('mousemove', this.mouseMove)
  }

  private unwireDragHandlers() {
    document.removeEventListener('mouseup', this.mouseUp)
    document.removeEventListener('mousemove', this.mouseMove)
  }

  private mouseDown(e: MouseEvent) {
    if (e.button !== 0) return
    if ((e.target as HTMLElement).classList.contains('dnd-ignore')) return
    if (this.item.isEnabled) {
      this.mousePos = this.getMousePosFrom(e)
      this.mouseStamp = this.now
      this.wireDragHandlers()
    }
  }

  private mouseUp(e) {
    const wasAClick = this.wasAClick(e)
    if (wasAClick) {
      this.item.onClick()
    } else {
      this.item.onDragEnd(e)
    }
    this.unwireDragHandlers()
    this.dragInitialised = false
    this.item.cancelDrag()
  }

  private getMousePosFrom(e: MouseEvent) {
    return new Position(e.pageX, e.pageY)
  }

  private mouseMove(e: MouseEvent) {
    if (this.mousePos && !this.dragInitialised) {
      this.dragInitialised = true
      this.item.onDragStart(this.mousePos)
    } else {
      if (e.pageY > 1020) console.log(`mouseMove y=${e.pageY}`)
      this.item.onDragMove(this.getMousePosFrom(e))
    }
  }

  private wasAClick(e: MouseEvent) {
    const pos = this.getMousePosFrom(e)
    const delta = this.now - this.mouseStamp
    const mouseX = this.mousePos ? this.mousePos.x : 0
    const mouseY = this.mousePos ? this.mousePos.y: 0
    const withinXJitterLimits = Math.abs(pos.x - mouseX) < this.clickMouseJitterAllowance
    const withinYJitterLimits = Math.abs(pos.y - mouseY) < this.clickMouseJitterAllowance
    const withinClickTimeLimits = delta < this.clickMouseDownMaxTimeAllowance
    return withinXJitterLimits && withinYJitterLimits && withinClickTimeLimits
  }

  private wasMouseOut(pos: Position) {
    return  pos.x < this.mouseOutTolerence ||
            pos.y < this.mouseOutTolerence ||
            pos.x > (this.windowWidth - this.mouseOutTolerence) ||
            pos.y > (this.windowHeight - this.mouseOutTolerence)
  }

}
