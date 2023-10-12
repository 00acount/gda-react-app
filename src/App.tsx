import ContextProvider from "./components/common/context-provider";
import Router from "./components/common/Router";

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
