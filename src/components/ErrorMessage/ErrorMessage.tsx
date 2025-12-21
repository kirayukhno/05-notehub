import css from './ErrorMessage.module.css';

export function ErrorMessage() {
    return (
        <p className={css.text}>There was an error, please try again...</p>
    );
}

export function ErrorMessageNothingFound() {
    return (
        <p className={css.text}>No note contains the search.</p>
    )
}