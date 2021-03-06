import React from 'react'
import { render, cleanup, fireEvent, wait } from '@testing-library/react'
import { ListsPage } from './ListsPage'
import { AppContext } from '../../contexts/AppContext'
import { createMemoryHistory } from 'history'
import * as api from '../../helpers/api';
import { Router } from 'react-router-dom'
import { act } from 'react-dom/test-utils';

afterEach(cleanup)

jest.mock('../../helpers/api');
const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush
    })
}));

const history = createMemoryHistory();

const renderWithContextAndRouter = (component) => {
    api.doGet.mockResolvedValue(
        [
            { id: 1, name: 'user1' },
            { id: 2, name: 'user2' }
        ]
    );
    const context = { auth: { info: {} } };
    return {
        ...render(
            <AppContext.Provider value={context}>
                <Router history={history}>
                    {component}
                </Router>
            </AppContext.Provider>)
    }
}

it('should match the snapshot', async () => {
    let fragment;
    await act(async () => {
        const { asFragment } = renderWithContextAndRouter(<ListsPage />);
        fragment = asFragment;
    });
    expect(fragment(<ListsPage />)).toMatchSnapshot();
});

it('should add a new list', async () => {
    let container;
    await act(async () => {
        container = renderWithContextAndRouter(<ListsPage />);
    });

    await wait(() => {
        fireEvent.click(container.getByTestId('addNew'));
    })

    expect(mockHistoryPush.mock.calls.length).toBe(1);
    expect(mockHistoryPush.mock.calls[0][0]).toBe('lists/new');
    mockHistoryPush.mockClear();
});

it('should edit the list', async () => {
    let container;
    await act(async () => {
        container = renderWithContextAndRouter(<ListsPage />);
    });

    await wait(() => {
        fireEvent.click(container.getByTestId('editList2'));
    })

    expect(history.location.pathname).toBe('/lists/2/edit');
});

it('should delete the list', async () => {
    let container;
    await act(async () => {
        container = renderWithContextAndRouter(<ListsPage />);
    });

    await wait(() => {
        fireEvent.click(container.getByTestId('deleteList2'));
    })

    expect(history.location.pathname).toBe('/lists/2/delete');
});
