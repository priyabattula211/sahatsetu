import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { AuthPage } from './AuthPage';

jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    login: jest.fn(),
    signup: jest.fn(),
  }),
}));

jest.mock('../../context/ToastContext', () => ({
  useToast: () => ({
    showToast: jest.fn(),
  }),
}));

describe('AuthPage', () => {
  it('renders login screen copy', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthPage mode="login" />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Login to continue/i)).toBeInTheDocument();
  });
});
