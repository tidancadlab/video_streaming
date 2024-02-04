let fileArrayBuffer = []
const arrayList = document.querySelector("#list")
const list = (item) => {
    let li = `
    <li>${item}</li>
    `
    arrayList.innerHTML += li
}
const file = async (data, cb) => {
    const arrayBuffer = await data.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    return Array.from(uint8Array)
};
let count = 0
const sendFile = async (file) => {
    // Split the file into chunks (adjust chunk size as needed)
    const chunkSize = 1024 * 1024 * 1; // 4 MB chunks
    const chunks = [];
    let offset = 0;
    while (offset < file.size) {
        const chunk = file.slice(offset, offset + chunkSize);
        chunks.push(chunk);
        offset += chunkSize;
    }

    // Upload each chunk sequentially
    let uploaded = 0

    for (const chunk of chunks) {
        const formData = new FormData();
        formData.append('videoChunk', chunk);
        formData.append('name', file.name)
        arrayList.innerHTML = ''
        chunks.map((v, index) => {
            list(index)
        })
        try {
            const response = await fetch('http://localhost:5500/api/test/upload', {
                method: 'POST',
                body: formData,
            });
            const result = await response.json()
            if (response.status === 200) {
                uploaded += result.len
                console.log(uploaded)
                console.log((uploaded / file.size) * 100);
            }
        } catch (error) {
            console.error('Error uploading chunk:', error);
            return;
        }
    }

    console.log('Video upload complete!');
};

const onUpload = async (e) => {
    await sendFile(e.target.files[0])
};

module.exports = onUpload;
