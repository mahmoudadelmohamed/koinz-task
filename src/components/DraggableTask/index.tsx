import React from "react";
import {
  Draggable,
} from "react-beautiful-dnd";
import {
  images,
} from "../../assets/images/images";
import {
  TaskListTypes,
} from "../../data/data";
import {
  IconButton,
} from "../IconButton";
import {
  DraggableTaskProps,
} from "./types";
import styles from "./styles.module.css";

const CARD_BORDER_BOTTOM_STYLE = {
  [TaskListTypes.TODO]: {
    borderBottomColor: '#F2F4F6',
  },
  [TaskListTypes.PROGRESS]: {
    borderBottomColor: '#FFAB2B',
  },
  [TaskListTypes.DONE]: {
    borderBottomColor: '#6DD230',
  },
}

export const DraggableTask: React.FC<DraggableTaskProps> = (props) => {
  const {
    index,
    task,
    onRemove,
    onEdit,
    taskListType,
  } = props;
  return (
    <Draggable draggableId={task.id.toString()} index={index} key={task.id.toString()}>
      {(provided) => (
        <div className={styles.card} ref={provided.innerRef} {...provided.dragHandleProps} {...provided.draggableProps} style={{
          ...provided.draggableProps.style,
          ...CARD_BORDER_BOTTOM_STYLE[taskListType]
        }}>
          <div>
            <h3 style={{
              overflowWrap: 'anywhere'
            }}>{task.getCurrentValue().name}</h3>
          </div>
          <div className={styles.edit_icon_container}>
            <IconButton onClick={() => onEdit(task)}>
              <img src={images.editIcon} />
            </IconButton>
            <IconButton onClick={() => onRemove(task)}>
              <img src={images.deleteIcon} />
            </IconButton>

          </div>
        </div>
      )}
    </Draggable>
  );
}
