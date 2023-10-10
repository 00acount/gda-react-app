import ContextProvider from "./utilities/context-provider";
import Router from "./utilities/Router";

function App() {

  return (
    <>
      <ContextProvider>
        <Router />
      </ContextProvider>
    </>
  )
}

export default App
