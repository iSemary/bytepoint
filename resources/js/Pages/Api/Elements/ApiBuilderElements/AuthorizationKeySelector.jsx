import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import ReactSelectDarkMode from "../../../../configs/styles/ReactSelectDarkMode";
import axiosConfig from "../../../../configs/AxiosConfig";

export default function AuthorizationKeySelector({
    disabled,
    index,
    header,
    handleHeaderKeyChange
}) {
    const [keys, setKeys] = useState([]);

    useEffect(() => {
        axiosConfig
            .get("keys/all")
            .then((response) => {
                setKeys(response.data.data.keys);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const options = keys.map((key) => ({
        value: key.id,
        label: key.title,
    }));

    return (
        <CreatableSelect
            value={options.find(
                (option) => option.value === header?.authorization_id
            )}
            onChange={(newValue, actionMeta) =>
                handleHeaderKeyChange(index, header?.key, newValue, actionMeta)
            }
            isDisabled={disabled}
            options={options}
            required
            placeholder="Key"
            isClearable
            styles={ReactSelectDarkMode}
        />
    );
}
