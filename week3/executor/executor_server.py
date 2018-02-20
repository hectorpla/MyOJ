import json

from flask import Flask
from flask import jsonify
from flask import request

import executor_utils as eu

app = Flask(__name__)

@app.route('/build-and-run', methods=['POST'])
def build_and_run():
    '''
        expect the data having code and language section
    '''
    data = request.get_json()
    if 'code' not in data or 'lang' not in data:
        return "Flask: code or language not included"

    code, lang = data['code'], data['lang']

    print('lang: {}\ncode:{}'.format(lang, code))

    result = eu.build_and_run(code, lang)
    return jsonify(result)

if __name__ == '__main__':
    eu.load_image()
    app.run(host="0.0.0.0")
