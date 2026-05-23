
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export const uploadToImageKit = async (
  file,
  fileName,
) => {
  try {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("fileName", fileName);
    console.log(formData)

    const response = await fetch(
      API_URL+'/api/imagekit/upload',
      {
        method: "POST",
        credentials: "include",
        body: formData,
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ||
        result.error ||
        "Upload failed"
      );
    }

    return {
      success: true,
      data: {
        fileId: result.data.fileId,
        name: result.data.name,
        url: result.data.url,
        width: result.data.width,
        height: result.data.height,
        size: result.data.size,
      },
    };

  } catch (error) {
    console.error("ImageKit upload error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};