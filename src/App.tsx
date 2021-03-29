import React from 'react';

import SignIn from './pages/SignIn';
// import SignUp from './pages/SingUp';
import GlobaStyles from './styles/global';

import AppProvider from './hooks';

const App: React.FC = () => (
  <>
    <AppProvider>
      <SignIn />
    </AppProvider>

    <GlobaStyles />
  </>
);

export default App;
