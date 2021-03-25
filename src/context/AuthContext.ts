import { createContext } from 'react';

// Informação que vou usar em vários lugares

interface AuthContextState {
  name: string;
}

const AuthContext = createContext<AuthContextState>({} as AuthContextState);

export default AuthContext;
