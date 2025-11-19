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

export async function fetchNoticias(): Promise<Noticia[]> {
    const res = await fetch('http://localhost:5000/noticias');
    if (!res.ok) throw new Error('Error al obtener noticias');
    return await res.json();
}