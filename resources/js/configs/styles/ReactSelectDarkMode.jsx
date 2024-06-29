const ReactSelectDarkMode = {
    control: (provided) => ({
        ...provided,
        backgroundColor: "#333",
        borderColor: "#555",
        color: "#fff",
        height: 55,
    }),
    menu: (provided) => ({
        ...provided,
        backgroundColor: "#333",
    }),
    singleValue: (provided) => ({
        ...provided,
        color: "#fff",
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? "#555" : "#333",
        color: state.isSelected ? "#fff" : "#ddd",
        "&:hover": {
            backgroundColor: "#444",
            color: "#fff",
        },
    }),
    placeholder: (provided) => ({
        ...provided,
        color: "#aaa",
    }),
};

export default ReactSelectDarkMode;
