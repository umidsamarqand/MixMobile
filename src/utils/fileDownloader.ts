/**
 * Downloads an image file directly to the user's device.
 * Supports both Base64 Data URLs (uploaded files) and HTTP/HTTPS image URLs.
 */
export const downloadImageFile = async (url: string, defaultFilename: string = 'phone-photo.jpg') => {
  try {
    // Standardize filename
    const cleanFilename = defaultFilename.replace(/[^a-zA-Z0-9._-]/g, '_');

    // If it's a data URL (Base64 file from user device upload)
    if (url.startsWith('data:')) {
      const link = document.createElement('a');
      link.href = url;
      link.download = cleanFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    // For external URLs, fetch as Blob to force file download in browser
    const response = await fetch(url, { mode: 'cors' }).catch(() => null);
    
    if (response && response.ok) {
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = cleanFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
    } else {
      // Fallback anchor click
      const link = document.createElement('a');
      link.href = url;
      link.download = cleanFilename;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (error) {
    console.error('Failed to download image file:', error);
    // Ultimate fallback
    window.open(url, '_blank');
  }
};
