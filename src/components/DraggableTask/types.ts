import {
  Task,
  TaskListTypes,
} from "../../data/data";

export interface DraggableTaskProps {
  index: number;
  task: Task;
  onEdit: (task: Task) => void;
  onRemove: (task: Task) => void;
  taskListType: TaskListTypes;
}
