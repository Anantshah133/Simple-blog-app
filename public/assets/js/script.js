function createCookie(name, value, days) {
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }
    document.cookie = (name) + "=" + String(value) + expires + ";path=/ ";

}

function readCookie(name) {
    var nameEQ = (name) + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return (c.substring(nameEQ.length, c.length));
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}

coloredToast = (color, msg) => {
    const toast = window.Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        showCloseButton: true,
        customClass: {
            popup: `color-${color}`
        },
    });
    toast.fire({
        title: msg,
    });
};

function checkCookies(){
    if(readCookie("msg") == "insert"){
        coloredToast("success", 'Record Added Successfully !');
        eraseCookie("msg")
        return;
    }
    if(readCookie("msg") == "update"){
        coloredToast("success", 'Record Updated Successfully !');
        eraseCookie("msg")
        return;
    }
    if(readCookie("msg") == "delete"){
        coloredToast("danger", 'Record Deleted Successfully !');
        eraseCookie("msg")
        return;
    }
}