const memory = new WebAssembly.Memory({ initial: 1 });
const table = new WebAssembly.Table({initial: 0, element: "anyfunc"});
const module = WebAssembly.instantiateStreaming(fetch("/wasm"), {
    env: { __linear_memory: memory, __indirect_function_table: table },
});

async function readFile(file) {
    const reader = new FileReader();
    const p = new Promise(res => {
        reader.addEventListener('load', (event) => {
            res(event);
        });
    });
    reader.readAsArrayBuffer(file);

    return p;
}

async function change(input) {
    let file = (await readFile(input.files[0])).target.result;
    file = new Uint8Array(file, 0, file.byteLength >= 50 ? 50 : file.byteLength);
    let memoryBuf = new Uint8Array(memory.buffer, 130, 50);
    for (let i = 0; i < 50; i++) {
        memoryBuf[i] = file[i];
    }

    const wasm = await module;
    const typeOffset = wasm.instance.exports.getType(130);
    memoryBuf = new Uint8Array(memory.buffer, typeOffset, 50);
    const typeBinary = [];
    for (let i = 0; i < 50; i++) {
        if (memoryBuf[i] == 0) {
            break;
        }
        typeBinary.push(memoryBuf[i]);
    }

    const type = new TextDecoder("utf8").decode(new Uint8Array(typeBinary));
    const outputElement = document.getElementsByClassName("output")[0];
    outputElement.textContent = type;
}