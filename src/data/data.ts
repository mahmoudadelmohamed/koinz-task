export interface TaskList {
  id: number;
  title: string;
}

export interface TaskSnapshot {
  name: string;
  currentTaskList: TaskListTypes;
}

export interface Task {
  id: string;
  snapshots: TaskSnapshot[];
  getCurrentValue: () => TaskSnapshot;
  getHistory: () => TaskSnapshot[];
  editName: (newName: string) => void;
  move: (target: TaskListTypes) => void;
}

export const taskFactory = (id: string, name: string): Task => ({
  id,
  snapshots: [{
    name,
    currentTaskList: TaskListTypes.TODO,
  }],
  getCurrentValue() {
    return this.snapshots[this.snapshots.length - 1];
  },
  getHistory() {
    return this.snapshots;
  },
  editName(newName) {
    this.snapshots.push({
      ...this.getCurrentValue(),
      name: newName,
    });
  },
  move(target) {
    this.snapshots.push({
      ...this.getCurrentValue(),
      currentTaskList: target,
    });
  },
});

export const deserializeTask = (id: string, snapshots: TaskSnapshot[]): Task => ({
  id,
  snapshots,
  getCurrentValue() {
    return this.snapshots[this.snapshots.length - 1];
  },
  getHistory() {
    return this.snapshots;
  },
  editName(newName) {
    this.snapshots.push({
      ...this.getCurrentValue(),
      name: newName,
    });
  },
  move(target) {
    this.snapshots.push({
      ...this.getCurrentValue(),
      currentTaskList: target,
    });
  },
});

export const deserializeTasks = (tasksString: string) => {
  return JSON.parse(tasksString).map((task: any) => deserializeTask(task.id, task.snapshots));
}

export const serializeTasks = (tasks: Task[]) => JSON.stringify(tasks);

export enum TaskListTypes {
  TODO,
  PROGRESS,
  DONE,
}

export const TASK_LISTS: Record<TaskListTypes, TaskList> = {
  [TaskListTypes.TODO]: {
    id: 1,
    title: 'ToDo',
  },
  [TaskListTypes.PROGRESS]:{
    id: 2,
    title: 'In Progress',
  },
  [TaskListTypes.DONE]:{
    id: 3,
    title: 'Done',
  },
};

