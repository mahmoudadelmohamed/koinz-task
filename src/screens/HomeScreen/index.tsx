import { DraggableTask } from './../../components/DraggableTask/index';
import React, { useEffect, useState } from 'react';
import {
  Task,
  taskFactory,
  TaskList,
  TaskListTypes,
  TASK_LISTS,
  serializeTasks,
  deserializeTasks,
} from '../../data/data';
import { DragDropContext, DraggableLocation } from "react-beautiful-dnd";
import styles from './styles.module.css';
import { DroppableTaskList } from '../../components/DroppableTaskList';
import { Popup, } from '../../components/Popup';
import { PopupState } from '../../components/Popup/types';
import {
  checkDestination,
} from './utils';

const getTasksInColumn = (tasks: Task[], column: TaskListTypes): Task[] => {
  return tasks.filter((task) => task.getCurrentValue().currentTaskList === column);
}

export const HomeScreen: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(deserializeTasks(localStorage.getItem('tasks') || '[]'));
  const [openPopup, setOpenPopup] = useState(PopupState.NONE);
  const [selectedTask, setSelectedTask] = useState('');
  const [value, setValue] = useState('');

  const taskLists = {
    [TaskListTypes.TODO]: getTasksInColumn(tasks, TaskListTypes.TODO),
    [TaskListTypes.PROGRESS]: getTasksInColumn(tasks, TaskListTypes.PROGRESS),
    [TaskListTypes.DONE]: getTasksInColumn(tasks, TaskListTypes.DONE),
  };

  useEffect(() => {
    localStorage.setItem('tasks', serializeTasks(tasks));
  }, [tasks])


  const addTask = () => {
    let updateTasks = tasks.slice(0);
    let id = `${Math.round(Math.random() * Math.pow(10, 4))}-${Date.now()}`;
    const addTask = taskFactory(id, value);
    updateTasks.push(addTask);
    setTasks(updateTasks);
    setValue('');
  }
  const editTask = () => {
    let copyTask = tasks.slice(0);
    let updateTasks = tasks.find((task) => selectedTask === task.id);
    updateTasks?.editName(value);
    setTasks(copyTask);
  }
  const deleteTask = (id: string) => {
    let updateTasks = tasks.filter((task) => id !== task.id);
    setTasks(updateTasks);
  }
  const handleSubmit = () => {
    if (openPopup === PopupState.ADD) {
      addTask();
    }
    if (openPopup === PopupState.EDIT) {
      editTask();
      setOpenPopup(PopupState.NONE)
    }
  }
  const handleChange = (value: string) => {
    setValue(value);
  }
  const getHistory = () => {
    let updateTasks = tasks.find((task) => selectedTask === task.id);
    if (updateTasks) {
      return updateTasks.snapshots;
    }
    return [];
  }
  const handleClose = () => {
    setOpenPopup(PopupState.NONE);
    setValue('');
    setSelectedTask('');
  }
  const onEdit = (task: Task) => {
    setValue(task.getCurrentValue().name);
    setOpenPopup(PopupState.EDIT);
    setSelectedTask(task.id);
  };
  const onRemove = (task: Task) => {
    deleteTask(task.id);
  }
  return (
    <DragDropContext
      onDragEnd={(result) => {
        if (!result.destination) return;
        const {
          source,
          destination,
          draggableId,
        } = result;
        if (!checkDestination(source, destination)) {
          return;
        }
        const tasksCopy = tasks.slice(0);
        const task = tasksCopy.find((task) => task.id.toString() === draggableId);
        if (!task) return;
        const targetTaskListType: TaskListTypes = Number(destination.droppableId);
        task.move(targetTaskListType);
        setTasks(tasksCopy);
      }}
    >
      <div className={styles.container}>
        {
          (Object.entries((TASK_LISTS)) as unknown as [TaskListTypes, TaskList][]).map(([key, item]) => (
            <DroppableTaskList
              taskList={item}
              taskListType={key}
              onAddTask={() => setOpenPopup(PopupState.ADD)}
              key={key}
            >
              <div className={styles.draggable_container} >
                {taskLists[key].map((task, index) => (
                  <DraggableTask task={task} taskListType={key} index={index} onEdit={onEdit} onRemove={onRemove} />
                ))}
              </div>
            </DroppableTaskList>

          ))
        }
        <Popup
          closePopup={handleClose}
          getHistory={getHistory}
          onSubmit={handleSubmit}
          onValueChange={handleChange}
          popupState={openPopup}
          value={value}
        />
      </div>
    </DragDropContext>
  )


}