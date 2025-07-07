function showMessage(message) {
    const toast = document.getElementById('msg');
    toast.innerText = message;
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}
async function deleteContact(id) {
    if (confirm('Are you sure you want to delete this contact?')) {
        let result = await fetch(`/contact/${id}`, { method: "delete" });
        // let data = await result.json();
        if (result.ok) {
            // alert(data.message)
            // document.getElementById(id).remove()
            showMessage("Contact deleted successfully");
            setTimeout(() => {
                document.getElementById("msg").remove()
                window.location.reload();

            }, 3000);


        } else {
            alert("fail to delete contact!")
        }
    }
}