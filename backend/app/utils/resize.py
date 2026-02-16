from PIL import Image
from io import BytesIO
import structlog

logger = structlog.get_logger()


def create_thumbnail(image_data: bytes, size: tuple[int, int] = (400, 400)) -> bytes:
    """Create thumbnail from image data."""
    try:
        img = Image.open(BytesIO(image_data))
        
        # Convert to RGB if necessary
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
        
        # Create thumbnail
        img.thumbnail(size, Image.Resampling.LANCZOS)
        
        # Save to bytes
        output = BytesIO()
        img.save(output, format="WEBP", quality=85)
        return output.getvalue()
    except Exception as e:
        logger.error("Failed to create thumbnail", error=str(e))
        raise


def validate_image_type(content_type: str) -> bool:
    """Validate image content type."""
    allowed_types = ["image/jpeg", "image/png", "image/webp"]
    return content_type in allowed_types
