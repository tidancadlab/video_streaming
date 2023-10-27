let ul = document.getElementById('list');
let vdo = document.getElementById('vdo')
const path = require('path');
function loadVideo(e) {
    console.log(e)
    vdo.innerHTML = ''
    let video = document.createElement('video');
    video.controls = true
    video.autoplay = true
    video.poster = path.join(__dirname, '1.png')
    video.src = `${window.location.href}video/${(e.dataset.path).split('/').join('_-_-_')}`
    let heading = document.createElement('h3')
    heading.textContent = e.textContent.split('.')[0]
    vdo.appendChild(video);
    vdo.appendChild(heading)
}
function addFile(data) {
    let li = document.createElement('li');
    li.textContent = data.name;
    li.classList.add('video_list')
    li.setAttribute('data-path', data.path.slice(3))
    li.setAttribute('onClick', `loadVideo(event.target)`)
    ul.appendChild(li)
}
fetch(window.location.href + 'file').then((res) => res.json()).then((data) => {
    for (let i of data) {
        addFile(i)
    }
}).catch((e) => {
    console.log(e)
})