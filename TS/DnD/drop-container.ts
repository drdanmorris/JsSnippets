import { Rect } from './client-rect'
import { DragAndDropItem } from './drag-drop-item'
import { Position } from './position'
import { IHTMLElement } from './ihtml-element'

export class DropContainer extends Rect {

	public items: DragAndDropItem[]  = []

	constructor(id: string) {
		super(id)
	}

	public contains(element: IHTMLElement) {
		return this.items.filter((i) => (i.element === element)).length > 0
	}

	public addDndItem(item: DragAndDropItem) {
		for (let i = 0; i < this.items.length; i++) {
			if (this.items[i].ctx === item.ctx || this.items[i].element === item.element) {
				this.items[i] = item
				return
			}
		}
		this.items.push(item)
	}

	public initContainer() {
		this.reset()
		this.items.forEach((item) => {
			item.init()
		})
	}

	public getDropTargetFor(pos: Position) {
		for (const item of this.items) {
			if (item.rect.containsPoint(pos)) {
				return item
			}
		}
	}

}
