import { images } from "../../assets/images/images";
import { TaskListTypes, TaskSnapshot } from "../../data/data";
import { IconButton } from "../IconButton";
import styles from './styles.module.css';

export enum PopupState {
    NONE,
    EDIT,
    ADD,
}

export interface PopupProps {
    popupState: PopupState;
    closePopup: () => void;
    value: string;
    onValueChange: (value: string) => void;
    onSubmit: () => void;
    getHistory: () => TaskSnapshot[];
}

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
        <div className={styles.popup_container}>
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
                                className={styles.textInputStyle}
                                type="text" value={value} onChange={(e) => onValueChange(e.target.value)} />
                        </div>
                        <input
                            disabled={value.length ? false : true}
                            className={styles.add_edit_title_container}
                            type="submit" value={popupState === PopupState.ADD ? 'Add Task' : 'Edit Task'} />
                    </form>
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
            <IconButton
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