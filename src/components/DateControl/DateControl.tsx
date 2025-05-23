import React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { CalendarPickerView } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import enLocale from "date-fns/locale/en-US";
import { IFieldProps } from "../../common/field";
import { FormUtils, MSGS, ValidationUtil } from "@manojadams/metaforms-core";
import { TextField, TextFieldVariants } from "@mui/material";
import MuiFormUtil from "../../Utils/MuiFormUtil";
import { DEFAULT_DATE_FORMAT } from "../../forms/constants";
import { parse } from "date-fns";

interface IProps extends IFieldProps {
    section: string;
}

function DateControl(props: IProps) {
    const label = MuiFormUtil.getDisplayLabel(props.form);
    const dateString = props.form?.value ? props.form.value + "" : "";
    const value = props.form?.value ? parse(dateString, "yyyy-MM-dd", new Date()) : null;
    const variant = props.variant;
    const min = props.form.validation?.min
        ? new Date(ValidationUtil.getValidationValue(props.form.validation, "min") as string)
        : undefined;
    const max = props.form.validation?.max
        ? new Date(ValidationUtil.getValidationValue(props.form.validation, "max") as string)
        : undefined;
    const openTo: CalendarPickerView | undefined = props.form?.config?.openTo as CalendarPickerView | undefined;
    const inputFormat = (props.form?.config?.inputFormat ?? DEFAULT_DATE_FORMAT) as string;
    const views: [CalendarPickerView] | undefined = props.form?.config?.views as [CalendarPickerView] | undefined;
    const subProps = props || {};
    let localValue;
    const placeholder = props.form.placeholder ?? inputFormat;
    const infoText = (ValidationUtil.getValidationValue(props.form.validation, "info") ?? "") as string;
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enLocale}>
            <DatePicker
                {...subProps}
                closeOnSelect
                disabled={props.form.isDisabled}
                readOnly={props.form.isReadonly}
                label={label}
                value={localValue ?? value}
                views={views}
                openTo={openTo}
                inputFormat={inputFormat}
                minDate={min}
                maxDate={max}
                DialogProps={{
                    className: "meta-form-date-picker"
                }}
                PopperProps={{
                    className: "meta-form-date-picker"
                }}
                onChange={(val: Date | null, inputString: string) => {
                    if (val === null && inputString === undefined) {
                        // input field is cleared
                        props.handleChange(null, "");
                    } else if (inputString === undefined) {
                        // popup is used
                        if (val) {
                            props.handleChange(null, FormUtils.getDateString(val));
                        } else {
                            props.handleChange(null, "");
                        }
                    } else {
                        // input field is used
                        // check input format
                        if (val && inputString && inputString.length === inputFormat.length) {
                            const formattedInpputSting = FormUtils.getLocalDateStringFormat(inputString, inputFormat);
                            const inputDate = Date.parse(formattedInpputSting);
                            if (isNaN(inputDate)) {
                                props.setError(true, MSGS.ERROR_MSG.DATE_INVALID);
                            } else {
                                props.handleChange(null, FormUtils.getDateString(new Date(inputDate)));
                            }
                        } else {
                            localValue = val;
                        }
                    }
                }}
                // eslint-disable-next-line react/jsx-no-bind
                onClose={() => {
                    props.handleValidation();
                    props.context.emit("$field_close", {
                        payload: {
                            section: props.section,
                            field: props.field.name,
                            value
                        }
                    });
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant={variant as TextFieldVariants}
                        className={props.className}
                        helperText={props.error.errorMsg || infoText || undefined}
                        inputProps={{
                            ...params.inputProps,
                            placeholder
                        }}
                        // eslint-disable-next-line react/jsx-no-bind
                        onBlur={props.handleValidation}
                        size={props.size}
                        error={props.error?.hasError ? true : undefined}
                        fullWidth
                    />
                )}
            />
        </LocalizationProvider>
    );
}

export default DateControl;
