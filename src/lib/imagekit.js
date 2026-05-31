
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
      API_URL + '/api/imagekit/upload',
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


// Helper to build ImageKit transformation URLs
export const buildTransformationUrl = (src, transformations = []) => {
  if (!transformations.length) return src;

  // Convert transformation objects to URL parameters
  const transformParams = transformations
    .map((transform) => {
      const params = [];

      // Handle resizing transformations
      if (transform.width) params.push(`w-${transform.width}`);
      if (transform.height) params.push(`h-${transform.height}`);
      if (transform.focus) params.push(`fo-${transform.focus}`);
      if (transform.cropMode) params.push(`cm-${transform.cropMode}`);

      // Handle effects
      if (transform.effect) params.push(`e-${transform.effect}`);

      // Handle background
      if (transform.background) params.push(`bg-${transform.background}`);

      // Handle text overlays using layer syntax
      if (transform.overlayText) {
        const layerParams = [
          `l-text`,
          `i-${encodeURIComponent(transform.overlayText)}`,
        ];

        if (transform.overlayTextFontSize)
          layerParams.push(`fs-${transform.overlayTextFontSize}`);
        if (transform.overlayTextColor)
          layerParams.push(`co-${transform.overlayTextColor}`);
        if (transform.overlayTextGravity) {
          // Map common gravity values to ImageKit positioning
          const gravityMap = {
            center: "center",
            north_west: "top_left",
            north_east: "top_right",
            south_west: "bottom_left",
            south_east: "bottom_right",
            north: "top",
            south: "bottom",
            west: "left",
            east: "right",
          };
          const mappedGravity =
            gravityMap[transform.overlayTextGravity] || transform.overlayTextGravity;
          layerParams.push(`lfo-${mappedGravity}`);
        } else {
          layerParams.push(`lfo-center`);
        }
        if (transform.overlayTextPadding)
          layerParams.push(`pa-${transform.overlayTextPadding}`);
        if (transform.overlayBackground)
          layerParams.push(`bg-${transform.overlayBackground}`);

        layerParams.push("l-end");
        // Push the layer string into params instead of early-returning,
        // so any resize/effect params accumulated above are not abandoned.
        params.push(layerParams.join(","));
      }

      return params.join(",");
    })
    .filter((param) => param.length > 0)
    .join(":");

  // Insert transformation parameters into URL
  if (src.includes("/tr:")) {
    // Already has transformations, append to existing
    return src.replace("/tr:", `/tr:${transformParams}:`);
  } else {
    // Add new transformations
    const urlParts = src.split("/");
    const fileIndex = urlParts.length - 1;
    urlParts.splice(fileIndex, 0, `tr:${transformParams}`);
    return urlParts.join("/");
  }
};