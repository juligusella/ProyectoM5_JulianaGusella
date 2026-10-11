export const uploadImage = async (file: File): Promise<string> => {

    const presignResponse = await fetch('/api/presign', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            filename: file.name,
            contentType: file.type,
        }),
    })

    if (!presignResponse.ok) {
        throw new Error('No se pudo obtener la URL firmada')
    }

    const { url, publicUrl } = await presignResponse.json()

    const uploadResponse = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': file.type,
        },
        body: file,
    })

    if (!uploadResponse.ok) {
        throw new Error('No se pudo subir la imagen a S3')
    }

    return publicUrl
}