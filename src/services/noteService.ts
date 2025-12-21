import axios from "axios";
import type { Note, NoteTag } from "../types/note";

axios.defaults.baseURL = "https://notehub-public.goit.study/api";
axios.defaults.headers.common["Authorization"] = `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`;

interface FetchNotesResponse{
    notes: Note[];
    totalPages: number,
}

export interface CreateNote {
    title: string;
    content: string;
    tag: NoteTag;
}

export const fetchNotes = async (search: string, page: number, perPage = 12): Promise<FetchNotesResponse> => {
    const response = await axios.get<FetchNotesResponse>(
        "/notes",
        {
            params: {
                search,
                page,
                perPage,
            },
        }
    );
    
    return response.data;
};

export const createNote = async (payload: CreateNote): Promise<Note> => {
    const response = await axios.post<Note>("/notes", payload);
    return response.data;
}

export const deleteNote = async (noteId: Note["id"]): Promise<void> => {
    await axios.delete<Note>(`/notes/${noteId}`);
}