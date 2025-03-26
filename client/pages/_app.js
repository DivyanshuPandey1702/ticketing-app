import "bootstrap/dist/css/bootstrap.css";
import Headers from "./components/headers";
import { UserProvide } from "../contexts/UserContext";
import { useState } from "react";

const AppComponent = ({ Component, pageProps }) => {
  const [currentUser, setCurrentUser] = useState(pageProps.currentUser);

  const assignUser = (user) => {
    setCurrentUser(user);
  };
  const deleteUser = () => {
    setCurrentUser(undefined);
  };

  return (
    <div>
      <UserProvide value={{ currentUser, assignUser, deleteUser }}>
        <Headers></Headers>
        <Component {...pageProps} />;
      </UserProvide>
    </div>
  );
};

export default AppComponent;
