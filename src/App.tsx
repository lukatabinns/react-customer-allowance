import React from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import {GlobalStyles, Box } from '@bigcommerce/big-design';
import { theme } from '@bigcommerce/big-design-theme';
import { ThemeProvider } from 'styled-components';
import List from './pages/List';
import AddEditCustomer from "./pages/AddEditCustomer";
import './App.scss';

function App() {
  return (
    <BrowserRouter>
        <Box backgroundColor="secondary20" padding="xxLarge">

        <ThemeProvider theme={theme}>
            <GlobalStyles />
            <Routes>
                <Route path="/" element={ <List/> } />
                <Route path="/allowance/:allowanceId" element={ <AddEditCustomer/> } />
                <Route path="/allowance/add" element={ <AddEditCustomer/> } />
            </Routes>
        </ThemeProvider>
        </Box>
    </BrowserRouter>
);
}

export default App;
