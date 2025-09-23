import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddStudentForm from '../src/components/AddStudentForm';
import api from '../src/api';

// Mock the API module
jest.mock('../src/api');

describe('AddStudentForm', () => {
  const onDoneMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form fields and the submit button', () => {
    render(<AddStudentForm />);
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Course/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Fees Status/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save/i })).toBeInTheDocument();
  });

  it('updates form state on user input', () => {
    render(<AddStudentForm />);
    const nameInput = screen.getByLabelText(/Name/i);
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    expect(nameInput.value).toBe('John Doe');
  });

  it('calls api.post and onDone with correct data on successful submission', async () => {
    api.post.mockResolvedValueOnce({ data: {} });

    render(<AddStudentForm onDone={onDoneMock} />);

    // Fill out all required fields
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/Course/i), { target: { value: 'Computer Science' } });
    fireEvent.change(screen.getByLabelText(/Amount/i), { target: { value: '1500' } });
    fireEvent.change(screen.getByLabelText(/Fees Status/i), { target: { value: 'Paid' } });

    fireEvent.click(screen.getByRole('button', { name: /Save/i }));

    // Wait for success message
    await screen.findByText(/Student added successfully!/i);

    expect(api.post).toHaveBeenCalledTimes(1);
    expect(api.post).toHaveBeenCalledWith('/students', {
      name: 'John Doe',
      email: 'john@example.com',
      course: 'Computer Science',
      amount: 1500,
      feesStatus: 'Paid',
    });
    expect(onDoneMock).toHaveBeenCalledTimes(1);
  });

  it('displays an error message on API failure', async () => {
    const errorMessage = 'Network Error';
    api.post.mockRejectedValueOnce(new Error(errorMessage));

    render(<AddStudentForm />);

    // Fill all required fields
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Course/i), { target: { value: 'Math' } });
    fireEvent.change(screen.getByLabelText(/Amount/i), { target: { value: '1000' } });
    fireEvent.change(screen.getByLabelText(/Fees Status/i), { target: { value: 'Paid' } });

    fireEvent.click(screen.getByRole('button', { name: /Save/i }));

    // Wait for error alert to appear
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(errorMessage);
  });
});
