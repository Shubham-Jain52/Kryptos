# Use a lightweight Python base image
FROM python:3.10-slim

# Hugging Face requires a non-root user to run the container
RUN useradd -m -u 1000 user
USER user

# Set the working directory and PATH for the new user
ENV HOME=/home/user
ENV PATH="/home/user/.local/bin:${PATH}"
WORKDIR $HOME/app

# Copy the requirements file and install dependencies
COPY --chown=user requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the FastAPI application code
COPY --chown=user main.py .

# Expose Hugging Face's mandatory port
EXPOSE 7860

# Run the FastAPI server on port 7860
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]