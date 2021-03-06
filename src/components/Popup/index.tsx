import {
  images,
} from "../../assets/images/images";
import {
  TaskListTypes,
} from "../../data/data";
import {
  IconButton,
} from "../IconButton";
import styles from './styles.module.css';
import {
  PopupProps,
  PopupState,
} from "./types";

const MOVEMENT_HISTORY = {
  [TaskListTypes.TODO]: 'ToDo',
  [TaskListTypes.PROGRESS]: 'Progress',
  [TaskListTypes.DONE]: 'DONE',
};

export const Popup: React.FC<PopupProps> = (props) => {
  const {
    popupState,
    closePopup,
    value,
    onValueChange,
    onSubmit,
    getHistory,
  } = props;

  if (popupState === PopupState.NONE) return null;
  return (
    <div data-testid="edit-popup" className={styles.popup_container}>
      <div className={styles.overlay_container}>
        <div className={styles.overlay_style}>
          <h3 className={styles.add_edit_title}>
            {popupState === PopupState.ADD ? 'Add Your Task' : 'Edit Your Task'}
          </h3>
          <form onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}>
            <div className={styles.text_input_container}>
              <input
                data-testid="value-input"
                className={styles.textInputStyle}
                type="text" value={value} onChange={(e) => onValueChange(e.target.value)} />
            </div>
            <input
              data-testid="form-submit"
              disabled={value.length ? false : true}
              className={styles.add_edit_title_container}
              type="submit" value={popupState === PopupState.ADD ? 'Add Task' : 'Edit Task'} />
          </form>
          <div className={styles.historyContainer}>
            {!!getHistory().length && (
              <h3>History</h3>
            )}
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
      </div>
      <IconButton
        data-testid="close-popup"
        onClick={closePopup}
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
  );
}