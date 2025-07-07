document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const firstname = document.getElementById("firstname");
    const lastname = document.getElementById("lastname");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");

    function preventStartingSpace(input) {
        input.addEventListener("input", () => {
            input.value = input.value.replace(/^\s+/, '');//space not allowed
        });
    }
    [lastname, firstname, phone, email].forEach(input => preventStartingSpace(input))

    function inputOnlyLetters(input) {
        input.addEventListener("input", () => {
            input.value = input.value.replace(/[^a-zA-Z]/g, '');//numbers not allowed

        });
    }
    [lastname, firstname].forEach(input => inputOnlyLetters(input))

    function capitalFirstLetter(input) {
        input.addEventListener("input", () => {
            if (input.value.length > 0) {
                input.value = input.value.charAt(0).toUpperCase() + input.value.slice(1);
            }
        });
    }
    capitalFirstLetter(firstname)
    capitalFirstLetter(lastname)

    //==========================================================
    // Live validation for firstname
    firstname.addEventListener("input", () => {
        isEmpty(firstname);
    });
    phone.addEventListener("input", () => {
        isEmpty(phone);
    });


    // Validate if input is empty and show/hide error
    function isEmpty(input) {
        const val = input.value.trim();
        if (val) {
            input.classList.remove("is-invalid");
        } else {
            input.classList.add("is-invalid");
        }
    }



    //validate email
    email.addEventListener("input", () => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailVal = email.value.trim(); // use 'email' instead of 'input'

        if (regex.test(emailVal)) {
            email.classList.remove("is-invalid");
        } else {
            email.classList.add("is-invalid");
        }
    });



    // function allValid() {
    //     const arr = [];
    //     arr.every(fun => {

    //     })
    // }
});

//email ,firstname , lastname, phone