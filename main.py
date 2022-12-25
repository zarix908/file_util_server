from flask import Flask, send_file

app = Flask(__name__)


@app.get('/')
def index():
    return send_file('./static/index.html')


@app.get('/script')
def script():
    return send_file('./static/index.js')


@app.get('/wasm')
def wasm():
    return send_file('./static/sign.wasm')


@app.get('/style')
def style():
    return send_file('./static/index.css')


@app.get('/icon')
def icon():
    return send_file('./static/icon.png')


def main():
    app.run('', 8080)


if __name__ == '__main__':
    main()
