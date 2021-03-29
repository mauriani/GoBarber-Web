import React from 'react';

import SignIn from './pages/SignIn';
// import SignUp from './pages/SingUp';
import GlobaStyles from './styles/global';

import { AuthProvider } from './context/AuthContext';

const App: React.FC = () => (
  <>
    <AuthProvider>
      <SignIn />
    </AuthProvider>

    <GlobaStyles />
  </>
);

export default App;
