document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search)
    const msg = params.get('error')
    
    const error = document.getElementById("error")
    error.textContent = msg
})