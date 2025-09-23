import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddStudentForm from '../AddStudentForm';
import api from '../api';

// Mock the API module
jest.mock('../api');

describe('AddStudentForm', () => {
  const onDoneMock = jest.fn();

  beforeEach(() => {
    // Clear all mocks before each test
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
    // Mock a successful API response
    api.post.mockResolvedValueOnce({ data: {} });

    render(<AddStudentForm onDone={onDoneMock} />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/Course/i), { target: { value: 'Computer Science' } });
    fireEvent.change(screen.getByLabelText(/Amount/i), { target: { value: '1500' } });
    fireEvent.change(screen.getByLabelText(/Fees Status/i), { target: { value: 'Paid' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Save/i }));

    // Wait for the asynchronous actions to complete
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledTimes(1);
      expect(api.post).toHaveBeenCalledWith('/students', {
        name: 'John Doe',
        email: 'john@example.com',
        course: 'Computer Science',
        amount: 1500, // Ensure amount is converted to a number
        feesStatus: 'Paid',
      });
      expect(onDoneMock).toHaveBeenCalledTimes(1);
      expect(screen.getByText(/Student added successfully!/i)).toBeInTheDocument();
    });
  });

  it('displays an error message on API failure', async () => {
    const errorMessage = 'Network Error';
    api.post.mockRejectedValueOnce({ response: { data: { message: errorMessage } } });

    render(<AddStudentForm />);
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Test' } });
    fireEvent.click(screen.getByRole('button', { name: /Save/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});