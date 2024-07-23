




const blockSpoilers=[...document.querySelectorAll("[data-spoiler]")];blockSpoilers.forEach((e=>{const s=e.getElementsByTagName("BUTTON")[0],t=()=>{e.classList.remove("hidden"),e.classList.add("not-hidden"),s.removeEventListener("click",t)};s.addEventListener("click",t)}));