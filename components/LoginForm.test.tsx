import { fireEvent, render, screen } from "@testing-library/react"
import { Provider } from "../context/userContext"
import LoginForm from "./LoginForm"

describe('LoginForm', () => {
    it('must trigger an action with the payload "Jochen", when form is submitted with the value "Jochen"', async () => {
        const dispatch = jest.fn();
        render(
            <Provider value={{dispatch, state: {name: ''}}}>
                <LoginForm success={jest.fn()}/>
            </Provider>
        );

        const inputField = await screen.findByPlaceholderText("Benutzername");
        fireEvent.change(inputField, { target: { value: 'Jochen' }} )
        const submitButton = await screen.findByText('Anmelden');
        fireEvent.click(submitButton)

        expect(dispatch).toBeCalledWith(
            expect.objectContaining({payload: 'Jochen'})
        )
    })

    it('must call the success callback when the form is submitted successfully', async () => {
        const successCallback = jest.fn();
        render(
            <Provider value={{dispatch: jest.fn, state: {name: ''}}}>
                <LoginForm success={successCallback}/>
            </Provider>
        );

        const inputField = await screen.findByPlaceholderText("Benutzername");
        fireEvent.change(inputField, { target: { value: 'Jochen' }} )
        const submitButton = await screen.findByText('Anmelden');
        fireEvent.click(submitButton)

        expect(successCallback).toBeCalledTimes(1);
    })
})