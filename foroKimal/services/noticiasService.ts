export interface Noticia {
    _id: string;
    titulo: string;
    texto: string;
    tipo: 'noticia';
    imagenes: string[];
    fecha: string;
    instalacionId?: string;
    comunaId?: string;
    regionId?: string;
    contentJson: any[];
    autorId?: string;
}

export async function fetchNoticias(apiUrl: string): Promise<Noticia[]> {
    const res = await fetch(`${apiUrl}/noticias`);
    if (!res.ok) throw new Error('Error al obtener noticias');
    return await res.json();
}