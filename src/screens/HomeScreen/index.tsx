import { DraggableTask } from './../../components/DraggableTask/index';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import {
  Task,
  taskFactory,
  TaskList,
  TaskListTypes,
  TASK_LISTS,
  serializeTasks,
  deserializeTasks,
} from '../../data/data';
import { Droppable, Draggable, DragDropContext } from "react-beautiful-dnd";
import styles from './styles.module.css';
import { images } from '../../assets/images/images';
import { IconButton } from '../../components/IconButton';
import { DroppableTaskList } from '../../components/DroppableTaskList';

export enum PopupState {
  NONE,
  EDIT,
  ADD,
}
const MOVEMENT_HISTORY = {
  [TaskListTypes.TODO]: 'ToDo',
  [TaskListTypes.PROGRESS]: 'Progress',
  [TaskListTypes.DONE]: 'DONE',
}


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
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (openPopup === PopupState.ADD) {
      addTask();
    }
    if (openPopup === PopupState.EDIT) {
      editTask();
      setOpenPopup(PopupState.NONE)
    }
    event.preventDefault();
  }
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
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

        if (source.droppableId === TaskListTypes.DONE.toString()) return;
        if (source.droppableId === TaskListTypes.TODO.toString()
          && destination.droppableId !== TaskListTypes.PROGRESS.toString()) return;

        if (source.droppableId === destination.droppableId && source.index === destination.index) return;
        const tasksCopy = tasks.slice(0);
        const task = tasksCopy.find((task) => task.id.toString() === draggableId);
        if (!task) return;
        task.move(Number(destination.droppableId));
        const sourceIndex = tasksCopy.indexOf(task);
        const targetTask = taskLists[destination.droppableId as unknown as TaskListTypes][destination.index];
        tasksCopy.splice(sourceIndex, 1);
        const destIndex = tasksCopy.indexOf(targetTask);
        tasksCopy.splice(sourceIndex > destIndex ? destIndex : destIndex + 1, 0, task);
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
            >
              <div className={styles.draggable_container} >
                {taskLists[key].map((task, index) => (
                  <DraggableTask task={task} taskListType={key} index={index} onEdit={onEdit} onRemove={onRemove} />
                ))}
              </div>
            </DroppableTaskList>

          ))
        }
        {openPopup !== PopupState.NONE && (
          <div className={styles.popup_container}>
            <div className={styles.overlay_container}>
              <div className={styles.overlay_style}>
                <h3 className={styles.add_edit_title}>
                  {openPopup === PopupState.ADD ? 'Add Your Task' : 'Edit Your Task'}
                </h3>
                <form onSubmit={(e) => handleSubmit(e)}>
                  <div className={styles.text_input_container}>
                    <input
                      className={styles.textInputStyle}
                      type="text" value={value} onChange={handleChange} />
                  </div>
                  <input
                    disabled={value.length ? false : true}
                    className={styles.add_edit_title_container}
                    type="submit" value={openPopup === PopupState.ADD ? 'Add Task' : 'Edit Task'} />
                </form>
                <h3>History</h3>
                {

                  getHistory().map((item, index, array) => {
                    let text = '';
                    if (index === 0) {
                      text = `Created With Value ${item.name}`;
                    }
                    else if (item.name !== array[index - 1].name) {
                      text = `Edited From ${array[index - 1].name} to ${item.name}`;
                    }
                    else {
                      text = `Moved From ${MOVEMENT_HISTORY[array[index - 1].currentTaskList]} to ${MOVEMENT_HISTORY[item.currentTaskList]}`;
                    }
                    return (
                      <h3>{text}</h3>
                    )
                  })
                }
              </div>
            </div>
            <IconButton
              onClick={handleClose}
              buttonProps={{
                style: {
                  margin: 16,
                }
              }}
            >
              <img
                src={images.closeIcon}
                className={styles.icon_style}
              />
            </IconButton>
          </div>
        )}
      </div>
    </DragDropContext>
  )


}