import css from "./App.module.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast, { Toaster } from 'react-hot-toast';
import { createNote, fetchNotes } from "../../services/noteService";
import NoteList from "../NoteList/NoteList";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import { NoteForm } from "../NoteForm/NoteForm";
import Loader from "../Loader/Loader";
import { ErrorMessage, ErrorMessageNothingFound } from "../ErrorMessage/ErrorMessage";

export default function App() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const queryClient = useQueryClient();

    const { data, isLoading, isError } = useQuery({
        queryKey: ["notes", search, page],
        queryFn: () => fetchNotes(search, page),
    });

    const mutation = useMutation({
        mutationFn: createNote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes"] });
            toast.success("Note was created successfully!")
            setIsModalOpen(false);
        },
        onError: () => {
            toast.error("Cannot create a note now. Please try later.");
        }
    });

    const debouncedSearch = useDebouncedCallback(
        (value: string) => {
            setSearch(value);
            setPage(1);
        },
        300
    );

    return (
        <div className={css.app}>
            <header className={css.toolbar}>
                <SearchBox onChange={debouncedSearch} />
                {data && (
                    <Pagination
                        totalPages={data.totalPages}
                        page={page}
                        onPageChange={setPage}
                    />
                )}
                <button className={css.button} onClick={() => setIsModalOpen(true)}>Create note +</button>
            </header>
            <Toaster/>
            {isLoading && <Loader/>}
            {isError && <ErrorMessage/>}
            {data?.notes && data.notes.length > 0 && <NoteList notes={data.notes} />}
            {data?.notes && data.notes.length === 0 && <ErrorMessageNothingFound/>}
            {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)}>
                    <NoteForm
                        onSubmit={mutation.mutate}
                        onCancel={() => setIsModalOpen(false)} />
                </Modal>
            )}
        </div>
    );
}