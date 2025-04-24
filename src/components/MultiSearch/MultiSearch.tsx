import { Autocomplete, Box, LinearProgress, TextField } from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import { FormUtils, IConfig, IError, IFormField, IOption, MetaForm } from "@manojadams/metaforms-core";
import { TVariant } from "../../forms/constants";
import { TValue } from "@manojadams/metaforms-core/dist/constants/types";

interface IProps {
    className: string;
    name: string;
    form: IFormField;
    variant: TVariant;
    config: IConfig;
    label: string;
    loading: boolean;
    context: MetaForm;
    section: string;
    size?: "small" | "medium";
    error: IError;
    handleChange: (e: React.SyntheticEvent, val1: TValue | TValue[], val2: IOption | undefined) => void;
    handleValidation: () => void;
}

export default function MultiSearch(props: IProps) {
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState(props.form.options ?? []);
    const [value, setValue] = useState<IOption[]>([]);

    useEffect(() => {
        if (props.form.options && props.form.options.length > 0) {
            const fieldValues = props.form?.value || [];
            const values = fieldValues
                // @ts-expect-error mateform-core expect value to be string (despite having multiselect which use array as value)
                .map((value: IOption) => FormUtils.getSearchValue(props.form.options, value) || undefined)
                .filter(Boolean) as IOption[];
            setOptions(props.form.options);
            setValue(values);
        }
    }, [props.form.options]);

    useEffect(() => {
        setLoading(props.loading);
    }, [props.loading]);

    return (
        <Fragment>
            <Autocomplete
                className={props.className}
                value={value}
                multiple
                options={options}
                loading={loading}
                size={props.size}
                isOptionEqualToValue={(option, value) => value && value.value === option.value}
                onChange={(e, values) => {
                    const currentValues = value.map((v) => v.value);
                    const ref = values.find((r) => !currentValues.includes(r.value));
                    const newValues = values.map((o) => o.value);
                    setValue(values);
                    props.handleChange(e, newValues, ref);
                    props.handleValidation();
                }}
                onBlur={() => props.handleValidation()}
                onInputChange={(e, val: string) => {
                    const config = props.form.events?.input ?? props.form.config;
                    if (config) {
                        setLoading(true);
                        props.context
                            .getData(config, val, props.section, "$input")
                            .then((results: Array<IOption>) => {
                                setOptions(results);
                                setLoading(false);
                            })
                            .catch((error) => {
                                setOptions([]);
                                setLoading(false);
                                props.context.handleError(error, props.section, props.name);
                            });
                    }
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={props.label}
                        variant={props.variant}
                        error={props.error.hasError}
                        helperText={props.error.errorMsg}
                        size={props.size}
                    />
                )}
            />
            {props.loading && (
                <Box sx={{ width: "100%" }}>
                    <LinearProgress />
                </Box>
            )}
        </Fragment>
    );
}
