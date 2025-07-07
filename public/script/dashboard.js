function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('show');

  const mainContent = document.getElementById('mainContent');
  mainContent.classList.toggle('expanded');
}


async function search(val) {
    const box = document.getElementById("suggestionBox");
    if (!val || val.length < 1) {
        box.style.display = "none";
        box.innerHTML = "";
        return;
    }

    const result = await fetch(`/contact/search/${val}`, { method: "get" })
    if (result.ok) {
        const data = await result.json();
        if (data.length > 0) {
            box.innerHTML =
                data.map(c =>
                    `<div onclick="select(${c.id})" style="padding: 3px 5px; cursor: pointer;">${c.first_name} ${c.last_name}</div>`
                ).join('');
            box.style.display = "block";
        } else {
            box.style.display = "none";
        }

    } else {
        box.style.display = "none";
    }
}

async function select(id) {
    const result1 = await fetch(`/contact/${id}`, { method: "get" });
    if (result1.ok) {
        const html = await result1.text()
        document.getElementById('mainContent').innerHTML = html;
        document.getElementById("suggestionBox").style.display = "none";
        document.getElementById("searchInput").value = "";


    } else {
        console.log("Failed to fetch contact");
    }
}
