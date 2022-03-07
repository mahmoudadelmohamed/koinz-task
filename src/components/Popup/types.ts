import {
  TaskSnapshot,
} from "../../data/data";
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