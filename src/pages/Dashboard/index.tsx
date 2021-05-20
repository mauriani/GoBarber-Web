import React, { useCallback, useEffect, useMemo, useState } from 'react';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import { FiClock, FiPower } from 'react-icons/fi';
import {
  Container,
  Header,
  HeaderContainer,
  Profile,
  Content,
  Schedule,
  NextAppointment,
  Section,
  Appointment,
  Calendar,
} from './styles';

import logoImg from '../../assets/logo.svg';
import { useAuth } from '../../hooks/auth';
import api from '../../services/apiClient';

interface MonthAvailabilityItem {
  day: number;
  available: boolean;
}

const Dashboard: React.FC = () => {
  const [selectDate, setSelectDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [monthAvailable, setMonthAvailable] = useState<MonthAvailabilityItem[]>(
    [],
  );

  const { signOut, user } = useAuth();

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    // só muda a seleção do dias entre 1 e 6, ou seja, segunda a sexta.
    if (modifiers.available) {
      setSelectDate(day);
    }
  }, []);

  const handleMonthChange = useCallback((month: Date) => {
    // exibe o mes selecionado
    setCurrentMonth(month);
  }, []);

  // carregas os nossos dias disponíveis e não disponiveis
  useEffect(() => {
    api
      .get(`/providers/${user.id}/mont-availability`, {
        params: {
          year: currentMonth.getFullYear(),
          month: currentMonth.getMonth() + 1,
        },
      })
      .then(response => {
        setMonthAvailable(response.data);
      });
  }, [currentMonth, user.id]);

  const disableDays = useMemo(() => {
    // buscas os availables que seja falsos
    const dates = monthAvailable
      .filter(monthDay => monthDay.available === false)
      .map(monthDay => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        return new Date(year, month, monthDay.day);
      });

    return dates;
  }, [currentMonth, monthAvailable]);

  return (
    <Container>
      <Header>
        <HeaderContainer>
          <img src={logoImg} alt="GoBarber" />

          <Profile>
            <img src={user.avatar_url} alt="GoBarber" />
            <div>
              <span>Bem-vindo</span>
              <strong>{user.name}</strong>
            </div>
          </Profile>

          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContainer>
      </Header>

      <Content>
        <Schedule>
          <h1>Horários agendados</h1>

          <p>
            <span>Hoje</span>
            <span>Dia 6</span>
            <span>Segunda-feira</span>
          </p>

          <NextAppointment>
            <strong>Atendimento a seguir</strong>
            <div>
              <img
                src="https://avatars.githubusercontent.com/u/32397288?s=400&u=b6f0dcfb34bd19ec55f15b81c91fdc15f249c0ae&v=4"
                alt="GoBarber"
              />
              <strong>Mauriani Maciel Lima</strong>
              <span>
                <FiClock />
                08:00
              </span>
            </div>
          </NextAppointment>

          <Section>
            <strong>Manhã</strong>

            <Appointment>
              <span>
                <FiClock />
                08:00
              </span>

              <div>
                <img
                  src="https://avatars.githubusercontent.com/u/32397288?s=400&u=b6f0dcfb34bd19ec55f15b81c91fdc15f249c0ae&v=4"
                  alt="GoBarber"
                />
                <strong>Mauriani Maciel Lima</strong>
              </div>
            </Appointment>

            <Appointment>
              <span>
                <FiClock />
                09:00
              </span>

              <div>
                <img
                  src="https://avatars.githubusercontent.com/u/32397288?s=400&u=b6f0dcfb34bd19ec55f15b81c91fdc15f249c0ae&v=4"
                  alt="GoBarber"
                />
                <strong>Mauriani Maciel Lima</strong>
              </div>
            </Appointment>
          </Section>

          <Section>
            <strong>Tarde</strong>
          </Section>
        </Schedule>

        <Calendar>
          <DayPicker
            weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            fromMonth={new Date()}
            disabledDays={[{ daysOfWeek: [0, 6] }, ...disableDays]}
            modifiers={{
              available: {
                daysOfWeek: [1, 2, 3, 4, 5],
              },
            }}
            selectedDays={selectDate}
            onMonthChange={handleMonthChange}
            onDayClick={handleDateChange}
            months={[
              'Janeiro',
              'Fevereiro',
              'Março',
              'Abril',
              'Maio',
              'Julho',
              'Julho',
              'Agosto',
              'Setembro',
              'Outubro',
              'Novembro',
              'Dezembro',
            ]}
          />
        </Calendar>
      </Content>
    </Container>
  );
};

export default Dashboard;
