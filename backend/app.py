from flask import Flask, request, jsonify
from flask_cors import CORS
import easyocr
import base64
import io
import numpy as np
from PIL import Image
import logging

app = Flask(__name__)
CORS(app)

# Set up logging
logging.basicConfig(level=logging.INFO)

reader = easyocr.Reader(['en'])

@app.route('/extract-text', methods=['POST'])
def extract_text():
    app.logger.info("Received request for text extraction")
    image_data = request.json['image']
    image_data = image_data.split(',')[1]
    image = Image.open(io.BytesIO(base64.b64decode(image_data)))
    
    app.logger.info("Performing OCR...")
    result = reader.readtext(np.array(image))
    extracted_text = ' '.join([text[1] for text in result])
    
    app.logger.info(f"Extracted text: {extracted_text}")
    return jsonify({'text': extracted_text})

if __name__ == '__main__':
    app.run(debug=True)