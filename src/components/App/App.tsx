import css from "./App.module.css";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Toaster } from 'react-hot-toast';
import { fetchNotes } from "../../services/noteService";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

import NoteList from "../NoteList/NoteList";
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

    const { data, isLoading, isError } = useQuery({
        queryKey: ["notes", search, page],
        queryFn: () => fetchNotes(search, page),
        placeholderData: keepPreviousData,
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
                        onCancel={() => setIsModalOpen(false)} />
                </Modal>
            )}
        </div>
    );
}