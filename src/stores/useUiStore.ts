// @ts-nocheck
import { create } from 'zustand';

const useUiStore = create((set) => ({
  surveyStep: 1,
  setSurveyStep: (number) => set({ surveyStep: number }),
  userInfo: {
    userGender: '',
    userAge: 0,
  },
  setUserInfo: (object) => set({ userInfo: object }),

  seoulOnlyToastVisible: false,
  setSeoulOnlyToastVisible: (v) => set({ seoulOnlyToastVisible: v }),
  showSeoulOnlyToast: () => set({ seoulOnlyToastVisible: true }),
}));

export default useUiStore;
