import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from './test-utils'

function TestComponent() {
    return <h1>SAVIA testing</h1>
}

describe('renderWithProviders', () => {
    it('renderiza componentes dentro de los providers', () => {
        renderWithProviders(<TestComponent />)

        expect(
            screen.getByRole('heading', { name: 'SAVIA testing' }),
        ).toBeTruthy()
    })
})
