import styles from './styles.module.css';
import {
  IconButtonProps,
} from "./types";


export const IconButton: React.FC<IconButtonProps> = (props) => {
  const {
    onClick,
    children,
    buttonProps = {},
  } = props;
  return (
    <button
      onClick={onClick}
      className={styles.secondary_button}
      {...buttonProps}
    >
      {children}
    </button>
  );
}