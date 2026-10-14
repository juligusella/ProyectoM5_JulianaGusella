
import { afterEach, describe, expect, it, vi } from 'vitest'
import { uploadImage } from '../services/storage/upload.service'

describe('uploadImage', () => {
    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('obtiene una URL firmada, sube la imagen y devuelve la URL pública', async () => {
        const fetchMock = vi
            .spyOn(globalThis, 'fetch')
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    url: 'https://s3.example.com/signed-upload',
                    publicUrl: 'https://cdn.example.com/plant.jpg',
                }),
            } as Response)
            .mockResolvedValueOnce({
                ok: true,
            } as Response)

        const file = new File(['imagen de prueba'], 'plant.jpg', {
            type: 'image/jpeg',
        })

        const result = await uploadImage(file)

        expect(result).toBe('https://cdn.example.com/plant.jpg')
        expect(fetchMock).toHaveBeenCalledTimes(2)
        expect(fetchMock).toHaveBeenNthCalledWith(
            1,
            '/api/presign',
            expect.objectContaining({
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    filename: 'plant.jpg',
                    contentType: 'image/jpeg',
                }),
            }),
        )
        expect(fetchMock).toHaveBeenNthCalledWith(
            2,
            'https://s3.example.com/signed-upload',
            expect.objectContaining({
                method: 'PUT',
                headers: { 'Content-Type': 'image/jpeg' },
                body: file,
            }),
        )
    })

    it('lanza un error si no puede obtener la URL firmada', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
            ok: false,
        } as Response)

        const file = new File(['imagen'], 'plant.jpg', {
            type: 'image/jpeg',
        })

        await expect(uploadImage(file)).rejects.toThrow(
            'No se pudo obtener la URL firmada',
        )
    })

    it('lanza un error si falla la subida a S3', async () => {
        vi.spyOn(globalThis, 'fetch')
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    url: 'https://s3.example.com/signed-upload',
                    publicUrl: 'https://cdn.example.com/plant.jpg',
                }),
            } as Response)
            .mockResolvedValueOnce({
                ok: false,
            } as Response)

        const file = new File(['imagen'], 'plant.jpg', {
            type: 'image/jpeg',
        })

        await expect(uploadImage(file)).rejects.toThrow(
            'No se pudo subir la imagen a S3',
        )
    })
})
