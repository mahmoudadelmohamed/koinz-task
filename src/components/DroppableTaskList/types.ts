import { TaskListTypes, TaskList } from "../../data/data";
export interface DroppableTaskListProps {
  taskListType: TaskListTypes;
  taskList: TaskList;
  onAddTask: () => void;
}