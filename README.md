# 3D Contour Plot for Looker

## Interactive 3D Contour Plot Visualization

This Looker custom visualization provides an interactive 3D contour plot using Plotly.js, allowing users to explore multidimensional data with rich visualization options.

### Features
- Interactive 3D surface plot
- Customizable color scales
- Configurable contour line display
- Responsive design
- CDN-loaded Plotly.js for lightweight integration

### Project Structure
- `manifest.lkml`: Looker manifest defining visualization metadata
- `src/visualization.js`: Core visualization implementation
- `README.md`: Project documentation
- `LICENSE`, `marketplace.json`: Metadata and licensing

### Visualization Options
- Color Scale: Choose from multiple color palettes (Viridis, Plasma, Jet, etc.)
- Contour Lines: Toggle visibility of contour lines

### Installation & Usage in Looker

#### 1. Prepare the ZIP Bundle
- Ensure the following files and folders are present at the root of your ZIP:
  - `manifest.lkml`
  - `marketplace.json`
  - `README.md`
  - `LICENSE`
  - `src/` (with `visualization.js` inside)
- Do NOT include `test/` or unrelated files.
- The ZIP structure must look like:

```
my_viz.zip
├── manifest.lkml
├── marketplace.json
├── README.md
├── LICENSE
└── src/
    └── visualization.js
```

#### 2. Upload to Looker
- Go to **Admin → Platform → Custom Visualizations** in Looker.
- Click **Add Visualization** and upload your ZIP file.
- After uploading, the visualization will appear in the visualization picker as "3D Contour Plot".

#### 3. Use in Looker
- Add the visualization to your dashboard or explore.
- Configure options as desired.

### Notes
- No web hosting or build step is needed. All required files are bundled in the ZIP.
- If you update the JS or manifest, re-zip and re-upload to Looker.
- For public distribution, follow Looker Marketplace guidelines (not covered here).

### Development Roadmap
- [ ] Implement dynamic data transformation from Looker
- [ ] Add more customization options
- [ ] Enhance performance for large datasets
