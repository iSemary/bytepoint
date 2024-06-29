const ReactSelectLightMode = {
    control: (provided) => ({
        ...provided,
        backgroundColor: "#fff",
        borderColor: "#ccc",
        color: "#000",
        height: 55,
    }),
    menu: (provided) => ({
        ...provided,
        backgroundColor: "#fff",
    }),
    singleValue: (provided) => ({
        ...provided,
        color: "#007bff",
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? "#e6f7ff" : "#fff",
        color: state.isSelected ? "#007bff" : "#000",
        "&:hover": {
            backgroundColor: "#cceeff",
            color: "#007bff",
        },
    }),
    placeholder: (provided) => ({
        ...provided,
        color: "#999",
    }),
};

export default ReactSelectLightMode;
