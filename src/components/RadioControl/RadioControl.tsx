import React from "react";
import { IFieldProps } from "../../common/field";
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import MandatoryLabel from "../../common/MandatoryLabel";
import { TLabelPlacement } from "../../forms/constants";

function RadioControl(props: IFieldProps) {
    const isRow = props.form?.displayProps?.optionsLayout === "row" ? true : undefined;
    const fieldLabelClassname = "field-label d-md-flex align-items-md-center";
    const config = props.form.config as Record<string, TLabelPlacement>;
    const labelPlacement = config?.labelPlacement;
    return (
        <FormControl size={props.size} fullWidth className={props.className}>
            <FormLabel className={fieldLabelClassname}>
                {props.form.displayName}
                {props.form?.validation?.required && <MandatoryLabel />}
            </FormLabel>
            <RadioGroup
                row={isRow}
                value={props.form?.value}
                onChange={(e) => {
                    const parentLabel = e.target.closest("label");
                    const datatype = parentLabel ? parentLabel.getAttribute("datatype") : "";
                    if (datatype) {
                        switch (datatype) {
                            case "boolean":
                                {
                                    const val = e.target.value === "true";
                                    props.handleChange(e, val);
                                }
                                break;
                            default:
                                props.handleChange(e);
                        }
                    } else {
                        props.handleChange(e);
                    }
                }}
            >
                {props.form.options &&
                    props.form.options.map((option, idx) => {
                        const datatype = typeof option.value;
                        return (
                            <FormControlLabel
                                datatype={datatype}
                                labelPlacement={labelPlacement}
                                key={idx}
                                value={option.value}
                                control={<Radio disabled={props.form.isDisabled} size={props.size} />}
                                label={option.label}
                            />
                        );
                    })}
            </RadioGroup>
        </FormControl>
    );
}

export default RadioControl;
