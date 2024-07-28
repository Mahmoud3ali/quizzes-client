import { ServerStateConfig, RouterConfig, GlobalStateConfig } from "./config";

function App() {
  return (
    <ServerStateConfig>
      <GlobalStateConfig>
        <RouterConfig />
      </GlobalStateConfig>
    </ServerStateConfig>
  );
}

export default App;
