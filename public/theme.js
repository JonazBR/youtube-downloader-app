const theme = localStorage.getItem("theme")
const prefersColorScheme = window.matchMedia('(prefers-color-scheme: dark)');

const switchTheme = (theme)=> {
    document.querySelector("body").style.backgroundColor = theme   
}
if (theme) {
    switchTheme(theme)
} else {
    if (prefersColorScheme.matches) {
        localStorage.setItem("theme", "black")
    } else {
        localStorage.setItem("theme", "white")
    }

}

function changeTheme(event) {
    if (event.matches) {
        localStorage.setItem("theme", "black")
        switchTheme("black")

    } else {
        localStorage.setItem("theme", "white")
        switchTheme("white")
    }
}

prefersColorScheme.addListener(changeTheme);

changeTheme(prefersColorScheme);