import cv2
import os
import numpy as np
from utils.logger import logger

"""
Class handle resolution image.
"""
class ResolutionImage():
    def scale(self, image_content, file_name, quality=90, scale_factor=1.0, output_format='jpeg'):
        np_image = np.frombuffer(image_content, np.uint8)
    
        image = cv2.imdecode(np_image, cv2.IMREAD_COLOR)
        
        if image is None:
            logger.error("Could not decode the image.")
            return
        
        base_name, ext = os.path.splitext(file_name)
        
        if scale_factor != 1.0:
            new_width = int(image.shape[1] * scale_factor)
            new_height = int(image.shape[0] * scale_factor)
    
            image = cv2.resize(image, (new_width, new_height), interpolation=cv2.INTER_AREA)
            logger.info(f"Scaled image to {new_width}x{new_height}")

        
        output_format = output_format.lower()
        if output_format not in ['jpeg', 'png']:
            logger.error("Invalid output format. Please choose 'jpeg' or 'png'.")
            return
        
        compression_params = []
    
        if output_format == 'jpeg':
            compression_params = [cv2.IMWRITE_JPEG_QUALITY, quality]
            ext = ".jpg" 
    
        elif output_format == 'png':
            compression_params = [cv2.IMWRITE_PNG_COMPRESSION, 3]
            ext = ".png"

        return image, compression_params