export const SET_SELECTED_ROUTE = "SET_SELECTED_ROUTE";

interface SetSelectedRouteAction {
  type: typeof SET_SELECTED_ROUTE;
  payload: string;
}

export const setSelectedRoute = (route: string): SetSelectedRouteAction => ({
  type: SET_SELECTED_ROUTE,
  payload: route,
});

export type NavigationAction = SetSelectedRouteAction;
