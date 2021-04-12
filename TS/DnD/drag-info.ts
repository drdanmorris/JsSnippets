import { DragAndDropItem } from './drag-drop-item'
import { Position } from './position'
import { DeltaPos } from './delta-pos'

export interface DragInfo {
  pos: Position
  activeDragItem?: DragAndDropItem
  activeDropItem?: DragAndDropItem
  dragLayer?: HTMLElement
  delta?: DeltaPos
}
