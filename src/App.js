import './App.css';
import {  SnackbarProvider, useSnackbar } from 'notistack';
import Home from './Pages/Home'

function App() {
  return (
  <SnackbarProvider>
    <div>
      <Home />
    </div>
    </SnackbarProvider>
  );
}

export default App;
