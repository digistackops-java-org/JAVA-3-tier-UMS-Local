import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import StudentsList from '../StudentsList';
import api from '../api';

// Mock the API module
jest.mock('../api');

const mockStudents = [
  { id: 1, name: 'Alice', email: 'alice@example.com', course: 'Math', amount: 1200, feesStatus: 'Paid' },
  { id: 2, name: 'Bob', email: 'bob@example.com', course: 'Physics', amount: 800, feesStatus: 'Unpaid' },
];

describe('StudentsList', () => {
  beforeEach(() => {
    // Clear mocks and set up a default successful GET mock
    jest.clearAllMocks();
    api.get.mockResolvedValue({ data: mockStudents });
    // Mock the confirm function to prevent the prompt from blocking tests
    global.confirm = () => true;
  });

  it('displays a loading message initially and then the list of students', async () => {
    render(<StudentsList />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
      expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
    });
  });

  it('displays an error message on API failure', async () => {
    const errorMessage = 'Failed to fetch students';
    api.get.mockRejectedValueOnce({ response: { data: { message: errorMessage } } });

    render(<StudentsList />);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('allows editing a student and saves changes', async () => {
    render(<StudentsList />);
    await waitFor(() => expect(screen.getByText('Alice')).toBeInTheDocument());

    const editButton = screen.getAllByRole('button', { name: /Edit/i })[0];
    fireEvent.click(editButton);

    const nameInput = screen.getByDisplayValue('Alice');
    fireEvent.change(nameInput, { target: { value: 'Alice Smith' } });

    const saveButton = screen.getByRole('button', { name: /Save/i });
    api.put.mockResolvedValueOnce({ data: {} });

    fireEvent.click(saveButton);

    await waitFor(() => {
      // Expect API call to be made with updated data
      expect(api.put).toHaveBeenCalledWith('/students/1', {
        id: 1,
        name: 'Alice Smith',
        email: 'alice@example.com',
        course: 'Math',
        amount: 1200,
        feesStatus: 'Paid'
      });
      // Expect list to re-render, so the get API should be called again
      expect(api.get).toHaveBeenCalledTimes(2);
    });
  });

  it('allows deleting a student', async () => {
    render(<StudentsList />);
    await waitFor(() => expect(screen.getByText('Alice')).toBeInTheDocument());

    const deleteButton = screen.getAllByRole('button', { name: /Delete/i })[0];
    api.delete.mockResolvedValueOnce({ data: {} });

    fireEvent.click(deleteButton);

    await waitFor(() => {
      // Expect API call to be made for deletion
      expect(api.delete).toHaveBeenCalledWith('/students/1');
      // Expect list to re-render, so the get API should be called again
      expect(api.get).toHaveBeenCalledTimes(2);
    });
  });
});