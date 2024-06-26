import Swal from "sweetalert2";

export default function Alert(
    message,
    type = "info",
    time = 3000,
    position = "top-end"
) {
    return Swal.fire({
        title: message,
        icon: type,
        position: position,
        toast: true,
        showConfirmButton: false,
        timer: time,
        customClass: {
            container: "small-toast-container",
        },
    });
}
