import { useEffect, useState } from 'react';

import { addDays } from 'date-fns';

import { DateTime } from '@/shared/lib';

const POP_UP_STATE_LOCAL_STORAGE_KEY = 'popUpState';
const POP_UP_DATE_LOCAL_STORAGE_KEY = 'popUpDate';
const POP_UP_DISPLAY = 'display';
const POP_UP_HIDDEN = 'hidden';

const initializePopupStorage = () => {
  localStorage.setItem(POP_UP_STATE_LOCAL_STORAGE_KEY, POP_UP_DISPLAY);
  localStorage.removeItem(POP_UP_DATE_LOCAL_STORAGE_KEY);
};

export default function usePopUp() {
  const [isPopUpOpened, setIsPopUpOpened] = useState();

  useEffect(() => {
    const popUpState = localStorage.getItem(POP_UP_STATE_LOCAL_STORAGE_KEY);
    const popUpDate = localStorage.getItem(POP_UP_DATE_LOCAL_STORAGE_KEY);

    const initialStatus = popUpState === null || popUpDate === null;

    if (initialStatus || DateTime.isDayOver(popUpDate)) {
      initializePopupStorage();
      setIsPopUpOpened(true);
      return;
    }

    if (popUpState === POP_UP_DISPLAY) {
      setIsPopUpOpened(true);
    }
  }, []);

  const closePopUp = ({ popupHideDuration }) => {
    setIsPopUpOpened(false);

    if (popupHideDuration !== undefined) {
      const popupHideUntilDate = addDays(new Date(), popupHideDuration);

      localStorage.setItem(POP_UP_STATE_LOCAL_STORAGE_KEY, POP_UP_HIDDEN);
      localStorage.setItem(POP_UP_DATE_LOCAL_STORAGE_KEY, popupHideUntilDate);
    }
  };

  return { isPopUpOpened, closePopUp };
}
