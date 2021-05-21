import React, { useCallback, useRef } from 'react';
import { FiArrowLeft, FiCamera, FiLock } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';

import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import getValidationErros from '../../utils/getValidationErrors';

import Button from '../../components/Button';
import Input from '../../components/Input';

import { Container, Content, AvatarInput } from './styles';

interface ProfileFormDate {
  email: string;
  password: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();
  const history = useHistory();

  const { user } = useAuth();

  // validação de dados, chama a função de signIn passando os campos para realizar auth
  const handleSubmit = useCallback(
    async (data: ProfileFormDate) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          email: Yup.string()
            .required('Email obrigatório')
            .email('Digite um e-mail válido'),
          password: Yup.string().required('Senha obrigatório'),
        });

        // // esse abortEarly retorna todos os erros que ele encontra
        // e nao o primeiro erro que encontar
        await schema.validate(data, { abortEarly: false });

        // history.push('/dashboard');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErros(err);
          formRef.current?.setErrors(errors);

          return;
        }
        // disparar um toast
        addToast({
          type: 'error',
          title: 'Erro na autentificação',
          description: 'Ocorreu um erro ao fazer login, cheque as credenciais',
        });
      }
    },
    [addToast],
  );

  return (
    <Container>
      <header>
        <div>
          <Link to="/dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>
      <Content>
        <Form
          ref={formRef}
          onSubmit={handleSubmit}
          initialData={{
            name: user.name,
            email: user.email,
          }}
        >
          <AvatarInput>
            <img src={user.avatar_url} alt={user.name} />
            <button type="button">
              <FiCamera />
            </button>
          </AvatarInput>

          <h1>Meu perfil</h1>

          <Input name="name" placeholder="name" icon={FiLock} />
          <Input name="email" placeholder="email" icon={FiLock} />
          <Input
            name="old_password"
            type="password"
            placeholder="Senha atual"
            icon={FiLock}
            containerStyle={{ marginTop: 25 }}
          />

          <Input
            name="password"
            type="password"
            placeholder="Nova Senha"
            icon={FiLock}
          />

          <Input
            name="password_confirmation"
            type="password"
            placeholder="Confirma Senha"
            icon={FiLock}
          />

          <Button type="submit">Confirmar mudanças</Button>
        </Form>
      </Content>
    </Container>
  );
};

export default Profile;
