import { DragDelegateBase, Position, MouseBackend, Rect,
IElement, IHTMLElement, DropContainer, DeltaPos } from '.'

let activeDragItem: DragAndDropItem | undefined
let activeDropItem: DragAndDropItem | undefined
let activeDropContainer: DropContainer | undefined

const ALLOW_TIME_FOR_CLICK_MS = 50

/*

There are at least 3 ways to do drag and drop in React:

1) Native
2) React-DnD
3) Custom

Native:
This is the easiest option if you are happy with the out-of-the-box behaviour provided by the browser.  All browsers
will take a translucent screenshot of the element being dragged and use this as the drag preview.  Modern browsers
also let you provide your own drag preview image, however, (i) not IE, and (ii) not in React.  So if you want a
custom drag preview in a React app you can't use the native implementation.

React-DnD:
 This mostly works - apart from in IE - but it is very complicated and requires a tonne of obtuse boilerplate.  There is
 no simple way to adjust the position of the drag preview:  you are stuck with the dimensions and position of the element
 that triggered the drag start operation.  This is an issue for Snapshot, as our drag previews are different to their
 trigger elements.

Custom:
  This option requires you to write a tonne of code (but on balance no more than the boiler plate required by React-DnD),
  and a certain amount of wheel re-invention, but gives you the most flexibility.
  You won't be able to do native file DnD with this approach. Given that we need to use custom drag previews,
  and at the same time support IE, this is really the only option for implementing DnD in Snapshot.

*/

interface Entity { }

export interface DndBackend {
    unwire: () => void
}

const registeredDragAndDropItems: DragAndDropItem[] = []

export class DragAndDropItem {

    public isTouch = false
    public rect: Rect
    public lastPos: Position | undefined
    private backend: DndBackend | undefined

    private constructor(public element: IHTMLElement, public ctx: Entity, private delegate: DragDelegateBase) {
        this.rect = new Rect(this.element)
        const container = delegate.getDefaultContainer()
        container && container.addDndItem(this)
        this.backend = new MouseBackend(this)
    }

    public static create(element: IHTMLElement, ctx, delegate: DragDelegateBase) {
        
        for(let i = 0; i < registeredDragAndDropItems.length; i++) {
            if(registeredDragAndDropItems[i].ctx === ctx) {
                registeredDragAndDropItems[i].dealloc()
                registeredDragAndDropItems.splice(i, 1)
                break;
            }
        }

        const dndItem = new DragAndDropItem(element, ctx, delegate)
        registeredDragAndDropItems.push(dndItem)
        element.classList.add('draggable')
        // console.log('create DnD item', ctx["accountName"])
        return dndItem
    }

    public static reset() {
        registeredDragAndDropItems.forEach(item => item.dealloc())
        registeredDragAndDropItems.length = 0
    }

    public init() {
        this.rect.reset()
    }

    public dealloc() {
        this.backend && this.backend.unwire()
    }

    public cancelDrag() {
        activeDragItem = activeDropItem = undefined
        this.delegate.onDragEnd()
    }

    get isEnabled() {
        return this.delegate.isEnabled()
    }

    get isDraggable() {
        return this.delegate.isDraggable(this.ctx)
    }

    public onDragStart(pos: Position) {

        // console.log('>>>>>>>>>>>>>>>>>>>>>onDragStart<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<', this.ctx["accountName"])

        activeDragItem = this
        setTimeout(() => {
            if (activeDragItem) {
                this.delegate.onDragStart({ pos, activeDragItem })
            }
        }, ALLOW_TIME_FOR_CLICK_MS)
    }

    public onDragEnd(pos: Position) {
        if (this.dragWasAValidDrop()) {
            this.delegate.onDrop({ pos, activeDragItem, activeDropItem })
        }
        if (activeDragItem) {
            this.delegate.onDragEnd({ pos, activeDragItem, activeDropItem })
        }

        activeDragItem = undefined
        this.lastPos = undefined
    }

    public onDragMove(pos: Position) {
        if (activeDragItem) {
            const delta = pos.getDelta(this.lastPos)
            const container = this.delegate.getDropContainer(pos)
            if (container) {
                activeDropItem = container.getDropTargetFor(pos)
            }
            activeDropContainer = container

            // console.log('+ onDragMove +', this.ctx["accountName"], activeDragItem.ctx["accountName"], activeDropItem && activeDropItem.ctx["accountName"])

            this.delegate.onDragMove({pos, activeDragItem, activeDropItem, delta})
        }
        this.lastPos = pos
    }

    public onClick() {
        this.delegate.onClick(activeDragItem);
    }

    public equals(other: DragAndDropItem | undefined) {
        if(!other) {
            return false
        }
        if(other.ctx === this.ctx) {
            return true
        }
        return false
    }

    public compare(other: DragAndDropItem | undefined) {
        if(!other) {
            console.log(`compare: ${this.ctx["accountName"]} is NOT the same as <undefined>`)
            return
        }
        if(other.ctx === this.ctx) {
            console.log(`compare: ${this.ctx["accountName"]} is the same as ${other.ctx["accountName"]}`)
        }
        console.log(`compare: ${this.ctx["accountName"]} is NOT the same as ${other.ctx["accountName"]}`)
    }

    private dragWasAValidDrop() {
        return activeDragItem && activeDropItem
    }

}
