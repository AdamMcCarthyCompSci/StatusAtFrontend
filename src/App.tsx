import "./App.css";
import {MantineProvider} from "@mantine/core";
import {useContext} from "react";
import {Notifications} from "@mantine/notifications";

import Shell from "./components/Shell";
import Theme from "./theme";
import {UserContext} from "./Context/User.tsx";
import "@mantine/notifications/styles.css";

function App() {
  const { user } = useContext(UserContext);

  return (
    <MantineProvider
      theme={Theme}
      classNamesPrefix="crochet"
      defaultColorScheme={user?.color_scheme || "light"}
    >
      <Notifications />
      <div className="App">
        {/*<PinpointTracker />*/}
        <Shell />
      </div>
    </MantineProvider>
  );
}

export default App;
