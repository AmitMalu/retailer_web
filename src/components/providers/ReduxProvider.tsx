import { Provider } from "react-redux";
import { store } from "../../Redux/Store";
import { ReduxProviderProps } from "@/Common/interface";

export default function ReduxProvider({ children }: ReduxProviderProps) {
  return <Provider store={store}>{children}</Provider>;
}
