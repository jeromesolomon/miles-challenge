export class DragAction {

    operation: string;
    previousContainerIndex: number;
    currentContainerIndex: number;
    previousIndex: number;
    currentIndex: number;

    //
    // Func: Set
    // Desc: Sets the action state information
    Set(operation: string, 
        previousContainer: number,
        currentContainer: number,
        previousIndex: number,
        currentIndex: number
        ) {

        this.operation = operation;
        this.previousContainerIndex = previousContainer;
        this.currentContainerIndex = currentContainer;
        this.previousIndex = previousIndex;
        this.currentIndex = currentIndex;

    }
}