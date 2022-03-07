import { DraggableLocation } from "react-beautiful-dnd";
import { TaskListTypes } from "../../data/data";

export const checkDestination = (source: DraggableLocation, destination: DraggableLocation) => {

    if (source.droppableId === TaskListTypes.DONE.toString()) return false;
  
    if (source.droppableId === TaskListTypes.TODO.toString()
      && destination.droppableId !== TaskListTypes.PROGRESS.toString()) return false;
  
    if (source.droppableId === destination.droppableId && 
      source.index === destination.index) return false;
      
    return true;
  }