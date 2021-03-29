import react, { createContext, useCallback } from 'react';

// Informação que vou usar em vários lugares

interface AuthContextState {
  name: string;
  signIn(): void;
}

export const AuthContext = createContext<AuthContextState>(
  {} as AuthContextState,
);

export const AuthProvider: React.FC = ({ children }) => {
  const signIn = useCallback(() => {
    console.log('signIn');
  }, []);
  return (
    // eslint-disable-next-line react/react-in-jsx-scope
    <AuthContext.Provider value={{ name: 'Diego', signIn }}>
      {children}
    </AuthContext.Provider>
  );
};
