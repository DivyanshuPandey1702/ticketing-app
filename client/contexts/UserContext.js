import { createContext, useContext } from "react";

export const UserContext = createContext({
  currentUser: {},
  assignUser: (user) => {},
  deleteUser: () => {},
});

export const UserProvide = UserContext.Provider;
export default function useUser() {
  return useContext(UserContext);
}
