# image-preprocessing-solution
TODO: Dec.
# Table of content
- Todo needs to implement
# 0: System architecture:
## Main flow:
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

## 1.2. Usecase resolution image.
## 2.3. Handle 1M users upload and fault tolerance handle image preprocessing.

# 2: Computer vision solution: 
## 2.1: Object detection endpoint:
## 2.2: Increase image quality.

# 3: How to integrate it into your current system:
# 4: Setup and scale with k8s:

# 5. API document
