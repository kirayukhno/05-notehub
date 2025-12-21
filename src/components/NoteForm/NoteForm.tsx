import css from "./NoteForm.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import type { FormikHelpers } from "formik";
import { useId } from "react";
import * as Yup from "yup";
import type { NoteTag } from "../../types/note";

export interface NoteFormValues{
    title: string,
    content: string,
    tag: NoteTag,
}

const initialValues: NoteFormValues = {
    title: '',
    content: '',
    tag: 'Todo',
}

interface NoteFormProps{
    onSubmit: (values: NoteFormValues) => void;
    onCancel: () => void;
}

const noteFormSchema = Yup.object().shape({
    title: Yup.string()
        .min(3, "Title must be at least 3 characters")
        .max(50, "Title is too long")
        .required("Title is required"),
    content: Yup.string()
        .max(500, "Content is too long"),
    tag: Yup.string()
        .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'])
        .required("Tag is required")
});


export function NoteForm({onSubmit, onCancel}: NoteFormProps) {
    const fieldId = useId();

    const handleSubmit = (
        values: NoteFormValues,
        actions: FormikHelpers<NoteFormValues>
    ) => {
        onSubmit(values);
        actions.resetForm();
    };

    return (
        <Formik initialValues={initialValues} validationSchema={noteFormSchema} onSubmit={handleSubmit}>
            {({ isSubmitting }) => (
                <Form className={css.form}>
                    <fieldset className={css.formGroup}>
                        <label htmlFor={`${fieldId}-title`}>Title</label>
                        <Field id={`${fieldId}-title`} type="text" name="title" className={css.input} />
                        <ErrorMessage component="span" name="title" className={css.error} />
                    </fieldset>

                    <fieldset className={css.formGroup}>
                        <label htmlFor={`${fieldId}-content`}>Content</label>
                        <Field
                            as="textarea"
                            id={`${fieldId}-content`}
                            name="content"
                            rows={8}
                            className={css.textarea}
                        />
                        <ErrorMessage component="span" name="content" className={css.error} />
                    </fieldset>

                    <div className={css.formGroup}>
                        <label htmlFor={`${fieldId}-tag`}>Tag</label>
                        <Field as="select" id={`${fieldId}-tag`} name="tag" className={css.select}>
                            <option value="Todo">Todo</option>
                            <option value="Work">Work</option>
                            <option value="Personal">Personal</option>
                            <option value="Meeting">Meeting</option>
                            <option value="Shopping">Shopping</option>
                        </Field>
                        <ErrorMessage component="span" name="tag" className={css.error} />
                    </div>

                    <div className={css.actions}>
                        <button
                            type="button"
                            className={css.cancelButton}
                            onClick={onCancel}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={css.submitButton}
                            disabled={isSubmitting}
                        >
                            Create note
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    );
}