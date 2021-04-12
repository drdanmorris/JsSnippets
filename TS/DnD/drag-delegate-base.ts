import {  DragInfo, Position, DropContainer, DragAndDropItem, SphereOfInfluence, DeltaPos } from '.'

export enum DragEvent {
  preDragStart = 'preDragStart',
  postDragStart = 'postDragStart',
  postDragEnd = 'postDragEnd',
  startHover = 'startHover',
  endHover = 'endHover',
  drop = 'drop',
  appendDragLayer = 'appendDragLayer',
  removeDragLayer = 'removeDragLayer',
  moveDragLayer = 'moveDragLayer'
}

export abstract class DragDelegateBase {

  protected dropContainers: DropContainer[] = []
  protected activeHoverItem: DragAndDropItem | undefined
  protected isDragging = false
  protected activeDropContainer: DropContainer | undefined

  protected abstract getDropContainers() : DropContainer[]
  protected abstract on(event: DragEvent, info?: DragInfo) : void

  public abstract onClick(ctx: any)
  public abstract isEnabled(): boolean
  public abstract isDraggable(ctx: any): boolean

  public onDragStart(info: DragInfo) {
    this.on(DragEvent.preDragStart, info)
    this.resetIsDragging(info)
    
    if (this.isDragging) {
      document.body.classList.add('dnd-dragging')
      this.on(DragEvent.appendDragLayer, info)
      this.dropContainers.forEach((container) => { container.initContainer() })
    }
    this.on(DragEvent.postDragStart, info)
  }

  public onDragMove(info: DragInfo) {
    if (this.isDragging) {
      this.on(DragEvent.moveDragLayer, info)
      if (info.activeDropItem && !info.activeDropItem.equals(this.activeHoverItem)) {
        //info.activeDropItem.compare(this.activeHoverItem)
        this.startHover(info)
      } else if (!info.activeDropItem && this.activeHoverItem) {
        this.endHover(info)
      }
      this.activeHoverItem = info.activeDropItem
    }
  }

  public onDragEnd(info?: DragInfo) {
    this.on(DragEvent.removeDragLayer, info)
    info && this.endHover(info)
    document.body.classList.remove('dnd-dragging')
    this.on(DragEvent.postDragEnd, info)
  }

  public onDrop(info: DragInfo) {
    this.on(DragEvent.drop, info)
  }

  public getDropContainer(pos: Position) {
    // TODO: could have the DropContainer return the amount of x/y freedom to give the current mouse pos
    // to avoid rechecking every single mouse movement.
    if (this.activeDropContainer && this.activeDropContainer.containsPoint(pos)) {
      return this.activeDropContainer
    }
    this.activeDropContainer = this.dropContainers.find((container) => (container.containsPoint(pos)))
    return this.activeDropContainer
  }

  public getDefaultContainer() {
    this.dropContainers = this.getDropContainers()
    return this.dropContainers[0]
  }

  protected startHover(info: DragInfo) {
    this.endHover(info)
    this.on(DragEvent.startHover, info)
    if (this.activeHoverItem) {
      document.body.classList.add('dnd-canDrop')
    }
  }

  protected endHover(info: DragInfo) {
    document.body.classList.remove('dnd-canDrop')
    this.on(DragEvent.endHover, info)
  }

  private resetIsDragging(info: DragInfo) {
      this.isDragging = false
      if (info.activeDragItem) {
          this.isDragging = true
      }
  }

}
