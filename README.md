# image-preprocessing-solution
TODO: Dec.
# Table of content
- Todo needs to implement
# 0: System architecture:
![image](https://github.com/user-attachments/assets/12e10b9b-fef3-44d8-baa5-63943782235d)


1. This service allows clients to upload files such as images, videos, and other media types, similar to Google Drive. Our algorithms support a large number of concurrent user uploads ([see our benchmark](#)).  
2. After the file is uploaded, we offer several optional pre-processing features that can be enabled or disabled, including:
   - **Image resolution adjustments**
   - **Video transcoding** for video streaming
   - **High-availability and high-performance object detection AI model**
3. Files can be served with high performance using distributed caching.
4. You can deploy this service using Docker or Kubernetes ([please refer to the deployment documentation](#)).

## Technical Details:

1. The system is designed with open APIs to facilitate interaction through both RESTful API and gRPC methods.
2. We use Node.js for the main service and Python for the workers. You can deploy multiple independent instances, which consume messages from the Kafka message broker.
3. Two types of databases are used: MongoDB to store file metadata and MinIO to store file binaries. ([We provide a backup solution for these files here](#)).
4. The service can be deployed using Kubernetes and Docker.
5. We provide a template for CI/CD using Jenkins to manage continuous integration, SonarQube for code quality checks, and Docker for building and deploying to AWS.
6. For system monitoring, we use ELK Stack (Elasticsearch, Logstash, and Kibana, Kafka) to centralize logs.


# 1: Image preprocessing 
## 1.1. Usecase upload image to object storage:
- This use case describes the process of uploading images to an object storage service using MinIO, with Node.js as the uploader service. MinIO is a high-performance, S3-compatible object storage service that allows you to - - store and retrieve large amounts of unstructured data.
- The image upload process involves receiving image files from clients, validating them, and storing them in MinIO. This ensures that the images are securely stored and readily accessible for further processing or retrieval.

**Architecture**
- Node.js Uploader Service: This service handles incoming image upload requests. It performs tasks such as validating the image format and size, and then uploads the image to MinIO.
- MinIO: This is the object storage service where images are stored. It is compatible with Amazon S3, making it easy to use S3-like API calls.
  
## 1.2. Usecase resolution image.
- This use case outlines the process for adjusting the resolution of images after they are uploaded to MinIO. The workflow involves publishing an event to Kafka once the image is stored, processing the image to adjust its resolution using a Python service, and then publishing the results back to Kafka.
- Image Upload: Images are uploaded to MinIO, a scalable object storage service.
- Event Publishing: Once the image is stored, an event is published to Kafka to trigger resolution adjustment.
- Resolution Adjustment: A Python service consumes the Kafka message, processes the image to adjust its resolution, and then publishes the processed image back to Kafka.
- Result Handling: The processed image is either stored in MinIO or sent to another system based on the workflow requirements.
  
**Architecture**
- Node.js Uploader Service: Handles image uploads and publishes a Kafka message once the image is saved to MinIO.
- Kafka: Acts as the message broker for communication between services.
- Python Resolution Service: Consumes messages from Kafka, processes the image to adjust its resolution, and publishes the result back to Kafka.
- MinIO: Stores both the original and processed images.
## 2.3. Handle 1M users upload and fault tolerance handle image preprocessing.
Image Upload Service:
- Scaled using a load balancer and multiple instances.
- Publishes upload events to Kafka.

Kafka Message Broker:
- Handles high throughput and provides message durability.
- Sends messages to an image preprocessing queue.

Image Preprocessing Service:
- Consumes messages from Kafka.
- Scaled horizontally using Kubernetes.
- Performs image resolution and processing.
- Stores processed images back to MinIO.

MinIO Object Storage:
- Configured with replication and high availability.
- Stores both original and processed images.

Monitoring and Alerts:
- Integrated with ELK Stack and Prometheus.
- Provides real-time insights and alerts on system health.

# 2: Computer vision solution:
## 2.1: Object detection endpoint:
Objective: To provide an API endpoint that allows users to upload images and receive object detection results. This endpoint uses a pre-trained object detection model to identify objects within images.

Tools and Technologies:

FastAPI: For building the REST API.
TensorFlow or PyTorch: For running the object detection model.
Pillow: For image processing.
Overview of the Endpoint:
Upload Image: The client uploads an image to the endpoint.
Object Detection: The server uses a pre-trained object detection model to analyze the image and identify objects.
Return Results: The server returns the detected objects along with their bounding boxes and confidence scores.
## 2.2: Increase image quality.
Objective: To provide an API endpoint that allows users to upload images and receive enhanced versions of these images. This endpoint uses image processing techniques to improve the quality of uploaded images.

Techniques for Increasing Image Quality:

Noise Reduction: Reduce noise in images using filters or denoising algorithms.
Sharpening: Enhance image details and sharpness.
Upscaling: Increase the resolution of images using interpolation or super-resolution techniques.
Color Enhancement: Adjust image contrast, brightness, and saturation to make colors more vivid.

# 3: How to integrate it into your current system:
# 4: Setup and scale with k8s:
# 5. API document
