import cv2
import os
import logging
import numpy as np

def save_scaled_images(image_content, file_name, quality=90, scale_factor=1.0, output_format='jpeg'):
    """
    Save scaled images with compression for optimization.

    Args:
        image_content: Raw image content (bytes).
        file_name: Original image file name.
        quality: Quality level (1-100) for saving the image (applicable for JPEG).
        scale_factor: Scaling factor for the image size (e.g., 1.0 means original size, 0.5 means half size).
        output_format: Format to save the image (e.g., 'jpeg', 'png').
    """
    # Convert the image content (byte data) to a numpy array
    np_image = np.frombuffer(image_content, np.uint8)
    
    # Decode the image from the numpy array
    image = cv2.imdecode(np_image, cv2.IMREAD_COLOR)
    
    if image is None:
        logging.error("Could not decode the image.")
        return
    
    # Get the base file name and extension
    base_name, ext = os.path.splitext(file_name)
    
    # Scale the image based on the scale_factor (e.g., 0.5 for half-size)
    if scale_factor != 1.0:
        new_width = int(image.shape[1] * scale_factor)
        new_height = int(image.shape[0] * scale_factor)
        image = cv2.resize(image, (new_width, new_height), interpolation=cv2.INTER_AREA)
        logging.info(f"Scaled image to {new_width}x{new_height}")
    
    # Ensure output format is correct
    output_format = output_format.lower()
    if output_format not in ['jpeg', 'png']:
        logging.error("Invalid output format. Please choose 'jpeg' or 'png'.")
        return
    
    # Compression settings (applicable for JPEG)
    compression_params = []
    if output_format == 'jpeg':
        compression_params = [cv2.IMWRITE_JPEG_QUALITY, quality]
        ext = ".jpg"  # Force JPEG extension
    elif output_format == 'png':
        compression_params = [cv2.IMWRITE_PNG_COMPRESSION, 3]  # PNG compression level (0-9)
        ext = ".png"
    
    # Create the output directory if it doesn't exist
    output_dir = "/out_img"
    os.makedirs(output_dir, exist_ok=True)
    
    # Create the new file name with the desired output format
    scaled_file_name = f"{output_dir}/{base_name}_scaled_{quality}_p_{ext}"
    
    # Save the scaled image with the compression settings
    cv2.imwrite(scaled_file_name, image, compression_params)
    logging.info(f"Saved scaled image: {scaled_file_name}, Quality: {quality}")
