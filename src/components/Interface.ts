export interface NavigationProps {
    onNext?: () => void;
    onPrev?: () => void;
  data: any;
  setData?: (data: any) => void;
}