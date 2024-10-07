// Show the plugin UI with specific dimensions
figma.showUI(__html__, { width: 300, height: 300 });

// Function to update the preview when a frame is selected
const updatePreview = async () => {
  const selectedFrame = figma.currentPage.selection[0];

  if (selectedFrame && selectedFrame.type === "FRAME") {
    // Export the selected frame as PNG for preview (using a smaller scale)
    const previewPngBytes = await selectedFrame.exportAsync({ format: "PNG", constraint: { type: "SCALE", value: 0.5 }});

    // Convert the preview PNG bytes to a base64 string
    const base64Preview = figma.base64Encode(previewPngBytes);

    // Send the preview PNG data back to the UI
    figma.ui.postMessage({
      type: 'display-preview',
      data: base64Preview
    });
  } else {
    figma.notify("Please select a frame");
  }
};

// Automatically update the preview when a frame is selected
figma.on("selectionchange", updatePreview);

figma.ui.onmessage = async (msg) => {
  // Handle frame export to ICO
  if (msg.type === 'convert-frame') {
    const selectedFrame = figma.currentPage.selection[0];
    
    if (selectedFrame && selectedFrame.type === "FRAME") {
      const frameName = selectedFrame.name;

      // Export the selected frame as PNG (first step for ICO export)
      const pngBytes = await selectedFrame.exportAsync({ format: "PNG", constraint: { type: "SCALE", value: 1 }});

      // Convert PNG bytes to ICO format (You'll need to implement this)
      const icoBytes = await convertPngToIco(pngBytes);

      // Convert the ICO bytes to base64 for download
      const base64Ico = figma.base64Encode(icoBytes);

      // Send the base64 ICO data and file name back to the UI
      figma.ui.postMessage({ 
        type: 'process-ico',
        data: base64Ico,
        fileName: `${frameName}.ico`
      });
    } else {
      figma.notify("Please select a frame");
    }
  }
};

// Mockup function for converting PNG to ICO (You'll need to implement this)
async function convertPngToIco(pngBytes) {
  // Use actual ICO conversion logic
  return pngBytes; // Replace this with ICO conversion
}