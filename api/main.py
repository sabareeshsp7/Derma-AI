from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import tensorflow as tf
import cv2
import io
import base64
from PIL import Image, ImageStat
import uvicorn
import os
from typing import Dict, Any, List, Tuple
import pytesseract
import re

app = FastAPI(title="Carcino AI API", description="API for carcinoma cell detection")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://your-production-domain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = None

def load_model():
    global model, expected_input_shape
    model_path = "model/carcinoma_model.h5"
    if os.path.exists(model_path):
        model = tf.keras.models.load_model(model_path)
        print("Model loaded successfully!")
        model.summary()
        expected_input_shape = model.input_shape[1:3]  # (height, width)
    else:
        expected_input_shape = (224, 224)
        model = tf.keras.Sequential([
            tf.keras.layers.InputLayer(input_shape=(224, 224, 3)),
            tf.keras.layers.Conv2D(16, 3, activation='relu'),
            tf.keras.layers.Flatten(),
            tf.keras.layers.Dense(2, activation='softmax')
        ])
        print("Warning: Using placeholder model for testing")

class_names = ["akiec", "bcc", "bkl", "df", "mel", "nv", "vasc"]

class_details = {
    "akiec": {"name": "Actinic Keratoses", "risk": "High", "emoji": "🚫", "info": "Precancerous; can become squamous cell carcinoma.", "action": "Consult a dermatologist soon."},
    "bcc":   {"name": "Basal Cell Carcinoma", "risk": "High", "emoji": "⚠️", "info": "Common skin cancer; requires medical treatment.", "action": "Seek medical advice."},
    "bkl":   {"name": "Benign Keratosis", "risk": "Low", "emoji": "✅", "info": "Non-cancerous growth; often harmless.", "action": "Monitor if changes occur."},
    "df":    {"name": "Dermatofibroma", "risk": "Low", "emoji": "🌿", "info": "Benign skin lesion; usually not serious.", "action": "No urgent action needed."},
    "mel":   {"name": "Melanoma", "risk": "Very High", "emoji": "🚑", "info": "Most dangerous form of skin cancer.", "action": "Immediate medical consultation required."},
    "nv":    {"name": "Melanocytic Nevus", "risk": "Low", "emoji": "💚", "info": "Common mole; generally benign.", "action": "Routine monitoring is fine."},
    "vasc":  {"name": "Vascular Lesion", "risk": "Medium", "emoji": "🩸", "info": "Blood vessel-related lesion; usually harmless.", "action": "Dermatologist check-up recommended."},
}

class PredictionResult(BaseModel):
    prediction: str
    confidence: float
    class_probabilities: Dict[str, float]
    heatmap_image: str

@app.on_event("startup")
async def startup_event():
    load_model()

@app.get("/")
def read_root():
    return {"message": "Carcino AI API is running", "status": "healthy"}

def validate_skin_image(image_bytes) -> Tuple[bool, str]:
    """
    Validate if the uploaded image is likely a skin lesion image.
    Returns (is_valid, error_message)
    """
    try:
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        image_array = np.array(image)
        
        # 1. Check image size - too small images are suspicious
        if image.size[0] < 50 or image.size[1] < 50:
            return False, "Image is too small. Please upload a clear image of at least 50x50 pixels."
        
        # 2. Detect text in image using OCR
        try:
            # Try to detect text using pytesseract
            # Note: Requires Tesseract OCR to be installed on system
            text = pytesseract.image_to_string(image)
            # Remove whitespace and check if significant text exists
            clean_text = re.sub(r'\s+', '', text)
            if len(clean_text) > 20:  # More than 20 characters of text
                return False, "Image appears to contain text or documents. Please upload a clear photo of a skin lesion only."
        except pytesseract.TesseractNotFoundError:
            # Tesseract not installed - skip text detection but continue with other validations
            print("Tesseract OCR not installed - text detection skipped")
        except Exception as ocr_error:
            # If OCR fails, continue with other validations
            print(f"OCR check skipped: {ocr_error}")
        
        # 3. Check for skin-like color distribution
        # Skin tones typically have specific RGB ranges
        hsv_image = cv2.cvtColor(image_array, cv2.COLOR_RGB2HSV)
        
        # Define skin color range in HSV
        lower_skin = np.array([0, 20, 70], dtype=np.uint8)
        upper_skin = np.array([20, 255, 255], dtype=np.uint8)
        
        skin_mask = cv2.inRange(hsv_image, lower_skin, upper_skin)
        skin_pixel_percentage = (np.sum(skin_mask > 0) / (image_array.shape[0] * image_array.shape[1])) * 100
        
        # At least 10% of image should have skin-like colors
        if skin_pixel_percentage < 10:
            return False, "Image does not appear to be a skin lesion. Please upload a clear photo of skin."
        
        # 4. Check image variance (detect blank or uniform images)
        stat = ImageStat.Stat(image)
        variance = sum(stat.var) / len(stat.var)
        if variance < 100:  # Very low variance indicates blank/uniform image
            return False, "Image appears to be blank or too uniform. Please upload a clear skin lesion photo."
        
        # 5. Edge detection - medical images should have some detail
        gray = cv2.cvtColor(image_array, cv2.COLOR_RGB2GRAY)
        edges = cv2.Canny(gray, 50, 150)
        edge_percentage = (np.sum(edges > 0) / edges.size) * 100
        
        if edge_percentage < 1:  # Too few edges
            return False, "Image lacks sufficient detail. Please upload a clearer photo of the skin lesion."
        
        # 6. Check for unnatural patterns (like screenshots with UI elements)
        # Detect sharp horizontal/vertical lines that might indicate screenshots
        sobelx = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=3)
        sobely = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=3)
        
        horizontal_edges = np.sum(np.abs(sobely) > 100)
        vertical_edges = np.sum(np.abs(sobelx) > 100)
        total_pixels = gray.size
        
        # If more than 30% of pixels have strong horizontal or vertical edges, likely a screenshot
        if (horizontal_edges / total_pixels) > 0.3 or (vertical_edges / total_pixels) > 0.3:
            return False, "Image appears to be a screenshot or contains UI elements. Please upload a direct photo of skin."
        
        return True, "Image validation passed"
        
    except Exception as e:
        print(f"Validation error: {str(e)}")
        return False, f"Error validating image: {str(e)}"


def preprocess_image(image_bytes):
    try:
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

        # ✅ Match training input size
        expected_input_size = (64, 64)
        image = image.resize(expected_input_size, Image.LANCZOS)

        image_array = np.array(image)
        if image_array.shape != (64, 64, 3):
            raise ValueError(f"Unexpected image shape after resizing: {image_array.shape}")

        image_array = image_array.astype(np.float32) / 255.0
        image_array = np.expand_dims(image_array, axis=0)

        print(f"Preprocessed image shape: {image_array.shape}")
        return image_array
    except Exception as e:
        print(f"Error in preprocessing: {str(e)}")
        raise


def generate_heatmap(image_array, predictions):
    try:
        conv_layers = [layer.name for layer in model.layers if 'conv' in layer.name.lower()]
        if not conv_layers:
            raise Exception("No convolutional layers found for heatmap.")

        last_conv_layer = conv_layers[-1]
        grad_model = tf.keras.models.Model(
            inputs=[model.inputs],
            outputs=[model.output, model.get_layer(last_conv_layer).output]
        )

        with tf.GradientTape() as tape:
            preds, conv_outputs = grad_model(image_array)
            top_pred_index = tf.argmax(preds[0])
            top_class_channel = preds[:, top_pred_index]

        grads = tape.gradient(top_class_channel, conv_outputs)
        pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
        conv_outputs = conv_outputs[0]
        heatmap = tf.reduce_sum(tf.multiply(pooled_grads, conv_outputs), axis=-1)

        heatmap = tf.maximum(heatmap, 0) / tf.math.reduce_max(heatmap)
        heatmap = cv2.resize(heatmap.numpy(), (64, 64))  # match input shape
        heatmap = np.uint8(255 * heatmap)
        heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)

        original_img = (image_array[0] * 255).astype(np.uint8)
        superimposed_img = cv2.addWeighted(original_img, 0.6, heatmap, 0.4, 0)
        _, buffer = cv2.imencode('.png', superimposed_img)
        heatmap_base64 = base64.b64encode(buffer).decode('utf-8')
        return heatmap_base64

    except Exception as e:
        print(f"[Heatmap] {str(e)}")
        blank = np.zeros((64, 64, 3), dtype=np.uint8)
        _, buffer = cv2.imencode('.png', blank)
        return base64.b64encode(buffer).decode('utf-8')


@app.post("/predict", response_model=PredictionResult)
async def predict(file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=400, detail="No file provided")
    valid_extensions = ['.jpg', '.jpeg', '.png']
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in valid_extensions:
        raise HTTPException(status_code=400, detail=f"Invalid file type. Supported types: {', '.join(valid_extensions)}")
    contents = await file.read()
    
    # Validate if image is actually a skin lesion
    is_valid, validation_message = validate_skin_image(contents)
    if not is_valid:
        raise HTTPException(status_code=400, detail=validation_message)
    
    try:
        image_array = preprocess_image(contents)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing image: {str(e)}")
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    try:
        print(f"Input shape before prediction: {image_array.shape}")
        predictions = model.predict(image_array)
        print(f"Prediction output shape: {predictions.shape}")
        predicted_class_index = np.argmax(predictions[0])
        predicted_class = class_names[predicted_class_index]
        confidence = float(predictions[0][predicted_class_index])
        
        # Additional confidence check - reject if model is too uncertain
        if confidence < 0.3:  # Less than 30% confidence
            raise HTTPException(
                status_code=400, 
                detail="The image quality is unclear or does not appear to be a recognizable skin lesion. Please upload a clearer, well-lit photo of the skin area."
            )
        
        class_probs = {class_names[i]: float(predictions[0][i]) for i in range(len(class_names))}
        heatmap_base64 = generate_heatmap(image_array, predictions)
        return {
            "prediction": predicted_class,
            "confidence": confidence,
            "class_probabilities": class_probs,
            "heatmap_image": heatmap_base64
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail="An error occurred during prediction. Please check the model input or model structure.")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
