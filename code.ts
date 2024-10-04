// Show the plugin UI with specific dimensions
figma.showUI(__html__, { width: 300, height: 300 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'convert-frame') {
    // Get the selected frame
    const selectedFrame = figma.currentPage.selection[0];
    
    if (selectedFrame && selectedFrame.type === "FRAME") {
      const frameName = selectedFrame.name;

      // Export the selected frame as PNG
      const pngBytes = await selectedFrame.exportAsync({ format: "PNG", constraint: { type: "SCALE", value: 1 }});

      // Send the PNG data, frame name, and folder name back to the UI
      figma.ui.postMessage({ 
        type: 'process-image', 
        data: pngBytes, 
        fileName: frameName, 
        folderName: msg.folder 
      });

    } else {
      figma.notify("Select a frame to export");
    }
  }
};