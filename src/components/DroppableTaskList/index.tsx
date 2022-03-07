import {
  Droppable,
} from "react-beautiful-dnd";
import {
  TaskListTypes,
} from "../../data/data";
import styles from "./styles.module.css";
import {
  DroppableTaskListProps,
} from "./types";

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
                  <button
                    data-testid="add-task-btn"
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
