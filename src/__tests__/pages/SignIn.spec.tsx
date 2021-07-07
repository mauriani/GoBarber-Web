import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import SignIn from '../../pages/SignIn';

const mockedHistoryPush = jest.fn();
const mockedSignIn = jest.fn();
const mockedAddToast = jest.fn();

// mocando o modulo react-router-dom
jest.mock('react-router-dom', () => {
  // o que eu quero retornar
  // ReactNode - qualquer conteudo que o react pode receber (html, string etc)
  return {
    useHistory: () => ({
      // retorna um funcao vazia com o metodo push
      push: mockedHistoryPush,
    }),
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

// com isso ele passa pela funcao de signIn e nao faz nada
jest.mock('../../hooks/auth', () => {
  return {
    useAuth: () => ({
      signIn: mockedSignIn,
    }),
  };
});

jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  };
});

describe('SignIn Page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
  });

  it('should be able to sign in', async () => {
    // toda vez que executar muda o valor de ?

    // testin
    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Entrar');

    // simulando o evento do usuario
    fireEvent.change(emailField, { target: { value: 'johndoe@example.com' } });
    fireEvent.change(passwordField, { target: { value: '123456' } });

    // dispara o click
    fireEvent.click(buttonElement);

    await waitFor(() => {
      // eu espero que ele visualmente navegue para o nosso Dashbord
      expect(mockedHistoryPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should not be able to sign in with invalid credentials', async () => {
    // toda vez que executar muda o valor de ?

    // testin
    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Entrar');

    // simulando o evento do usuario
    fireEvent.change(emailField, { target: { value: 'not-valid-email' } });
    fireEvent.change(passwordField, { target: { value: '123456' } });

    // dispara o click
    fireEvent.click(buttonElement);

    await waitFor(() => {
      // eu espero que ele visualmente NÃO navegue para o nosso Dashbord
      expect(mockedHistoryPush).not.toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should display an error if login fails', async () => {
    // com isso ele passa pela funcao de signIn e nao faz nada
    mockedSignIn.mockImplementation(() => {
      throw new Error();
    });

    // testin
    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Entrar');

    // simulando o evento do usuario
    fireEvent.change(emailField, { target: { value: 'johndoe@example.com' } });
    fireEvent.change(passwordField, { target: { value: '123456' } });

    // dispara o click
    fireEvent.click(buttonElement);

    await waitFor(() => {
      // eu espero que ele visualmente NÃO navegue para o nosso Dashbord
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      );
    });
  });
}); // qual a categoria do teste
