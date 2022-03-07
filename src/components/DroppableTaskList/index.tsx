import { Droppable } from "react-beautiful-dnd";
import { images } from "../../assets/images/images";
import { TaskListTypes, TaskList } from "../../data/data";
import { DraggableTask } from "../DraggableTask";
import styles from "./styles.module.css";

export interface DroppableTaskListProps {
    taskListType: TaskListTypes;
    taskList: TaskList;
    onAddTask: () => void;
}
const TITLE_BACKGROUND = {
    [TaskListTypes.TODO]: {
      background: 'linear-gradient(0deg, rgba(77, 124, 254, 0.08), rgba(77, 124, 254, 0.08)), #FFFFFF',
    },
    [TaskListTypes.PROGRESS]: {
      background: 'linear-gradient(0deg, rgba(255, 171, 43, 0.08), rgba(255, 171, 43, 0.08)), #FFFFFF',
  
    },
    [TaskListTypes.DONE]: {
      background: 'linear-gradient(0deg, rgba(109, 210, 48, 0.08), rgba(109, 210, 48, 0.08)), #FFFFFF',
    },
  }
export const DroppableTaskList: React.FC<DroppableTaskListProps> = (props) => {
    const {
        taskListType,  
        taskList,  
        onAddTask,
        children,
    } = props;
    return (
        <Droppable
            droppableId={taskListType.toString()}
            key={taskListType}
        >
            {(provided) => (
                <div>
                    <div className={styles.list_title_container} style={TITLE_BACKGROUND[taskListType]}>
                        <div className={styles.task_title_container}>
                            <h5>{taskList.title}</h5>
                        </div>
                        {
                            Number(taskListType) === TaskListTypes.TODO && (
                                <div className={styles.task_title}>
                                    <img src={images.plusIcon}
                                        className={styles.add_icon}
                                    />
                                    <button
                                        onClick={onAddTask}
                                        className={styles.button_style}
                                    >
                                        <h3 className={styles.add_card_title}>
                                            ADD CARD
                                        </h3>
                                    </button>
                                </div>
                            )
                        }
                    </div>
                    <div
                        className={styles.card_container}
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {children}
                        {provided.placeholder}
                    </div>
                </div>
            )}
        </Droppable>
    );
}
