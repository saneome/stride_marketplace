from minio import Minio
from minio.error import S3Error
from app.config import get_settings
import uuid

settings = get_settings()


class MinIOClient:
    def __init__(self):
        self.client = Minio(
            settings.MINIO_ENDPOINT,
            access_key=settings.MINIO_ACCESS_KEY,
            secret_key=settings.MINIO_SECRET_KEY,
            secure=settings.MINIO_SECURE,
        )
        self.bucket = settings.MINIO_BUCKET

    async def ensure_bucket_exists(self):
        """Ensure the bucket exists."""
        try:
            if not self.client.bucket_exists(self.bucket):
                self.client.make_bucket(self.bucket)
        except S3Error as e:
            raise Exception(f"Failed to ensure bucket exists: {e}")

    def generate_object_name(self, original_filename: str) -> str:
        """Generate unique object name."""
        ext = original_filename.rsplit(".", 1)[-1] if "." in original_filename else ""
        return f"{uuid.uuid4()}.{ext}"

    async def upload_file(self, file_data: bytes, object_name: str, content_type: str) -> str:
        """Upload file to MinIO."""
        await self.ensure_bucket_exists()
        
        try:
            self.client.put_object(
                self.bucket,
                object_name,
                data=BytesIO(file_data),
                length=len(file_data),
                content_type=content_type,
            )
            return f"/uploads/{object_name}"
        except S3Error as e:
            raise Exception(f"Failed to upload file: {e}")

    def get_file_url(self, object_name: str) -> str:
        """Get public URL for file."""
        return f"/uploads/{object_name}"

    async def delete_file(self, object_name: str) -> None:
        """Delete file from MinIO."""
        try:
            self.client.remove_object(self.bucket, object_name)
        except S3Error as e:
            raise Exception(f"Failed to delete file: {e}")


from io import BytesIO
