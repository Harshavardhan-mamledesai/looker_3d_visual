// src/visualization.js
// 3D Contour Plot Visualization for Looker Marketplace

looker.plugins.visualizations.add({
  id: 'looker_3d_contour',
  label: '3D Contour Plot',
  
  // Visualization configuration options
  options: {
    colorscale: {
      type: 'string',
      label: 'Color Scale',
      values: [
        'Viridis', 'Plasma', 'Inferno', 'Magma', 
        'Jet', 'Parula', 'Rainbow', 'Earth'
      ],
      default: 'Viridis',
      display: 'select'
    },
    showContours: {
      type: 'boolean',
      label: 'Show Contour Lines',
      default: true,
      section: 'Style'
    },
    interpolation: {
      type: 'string',
      label: 'Interpolation',
      values: ['linear', 'spline'],
      default: 'linear',
      section: 'Style'
    },
    plotTitle: {
      type: 'string',
      label: 'Plot Title',
      default: '3D Contour Plot',
      section: 'Plot'
    }
  },

  // Create visualization container
  create: function(element, config) {
    element.innerHTML = `
      <style>
        .error {
          color: red;
          padding: 10px;
        }
        .plotly-container {
          width: 100%;
          height: 100%;
          min-height: 500px;
          font-family: Helvetica, Arial, sans-serif;
        }
      </style>
      <div class="plotly-container"></div>
    `;

    // Load Plotly.js only if not already loaded
    if (typeof Plotly === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdn.plot.ly/plotly-latest.min.js';
      script.onload = () => {
        console.log('Plotly.js loaded successfully');
      };
      script.onerror = () => {
        this.addError({ title: 'Error Loading Plotly.js', message: 'Failed to load visualization library' });
      };
      document.head.appendChild(script);
    }
  },

  // Update visualization with new data
  updateAsync: function(data, element, config, queryResponse, details, done) {
    // Clear any existing errors
    this.clearErrors();

    // Validate data requirements
    if (!handleErrors(this, queryResponse, data)) {
      done();
      return;
    }

    try {
      // Transform Looker data into Plotly format
      const plotlyData = transformData(data, queryResponse, config);
      
      // Configure plot layout
      const layout = {
        title: config.plotTitle || '3D Contour Plot',
        autosize: true,
        margin: { l: 65, r: 50, b: 65, t: 90 },
        scene: {
          camera: {
            eye: { x: 1.87, y: 0.88, z: 0.64 }
          },
          xaxis: {
            title: queryResponse.fields.dimensions[0].label_short || 'X',
          },
          yaxis: {
            title: queryResponse.fields.dimensions[1].label_short || 'Y',
          },
          zaxis: {
            title: queryResponse.fields.measures[0].label_short || 'Z',
          }
        }
      };

      // Plot configuration
      const plotConfig = {
        responsive: true,
        displaylogo: false,
        modeBarButtonsToRemove: ['sendDataToCloud'],
        toImageButtonOptions: {
          format: 'png',
          filename: 'looker_3d_contour'
        }
      };

      // Render the plot
      Plotly.newPlot(
        element.querySelector('.plotly-container'),
        [plotlyData],
        layout,
        plotConfig
      );

      done();
    } catch (error) {
      this.addError({
        title: 'Error Rendering Visualization',
        message: error.message
      });
      done();
    }
  }
});

// Helper Functions
function handleErrors(viz, queryResponse, data) {
  if (!data || data.length === 0) {
    viz.addError({
      title: 'No Results',
      message: 'This visualization requires data to render.'
    });
    return false;
  }

  if (!queryResponse.fields.dimensions || queryResponse.fields.dimensions.length < 2) {
    viz.addError({
      title: 'Incomplete Data',
      message: 'This visualization requires at least two dimensions for X and Y coordinates.'
    });
    return false;
  }

  if (!queryResponse.fields.measures || queryResponse.fields.measures.length === 0) {
    viz.addError({
      title: 'Incomplete Data',
      message: 'This visualization requires at least one measure for Z values.'
    });
    return false;
  }

  return true;
}

function transformData(data, queryResponse, config) {
  // Extract field names
  const xField = queryResponse.fields.dimensions[0].name;
  const yField = queryResponse.fields.dimensions[1].name;
  const zField = queryResponse.fields.measures[0].name;

  // Get unique X and Y values
  const xValues = [...new Set(data.map(d => d[xField].value))];
  const yValues = [...new Set(data.map(d => d[yField].value))];

  // Create Z value matrix
  const zMatrix = Array(yValues.length).fill().map(() => Array(xValues.length).fill(null));

  // Fill Z matrix with values
  data.forEach(d => {
    const xIndex = xValues.indexOf(d[xField].value);
    const yIndex = yValues.indexOf(d[yField].value);
    if (xIndex !== -1 && yIndex !== -1) {
      zMatrix[yIndex][xIndex] = d[zField].value;
    }
  });

  return {
    type: 'surface',
    x: xValues,
    y: yValues,
    z: zMatrix,
    colorscale: config.colorscale || 'Viridis',
    contours: {
      z: {
        show: config.showContours !== false,
        usecolormap: true,
        highlightcolor: "#fff",
        project: {z: true}
      }
    },
    hoverongaps: false,
    hoverlabel: {
      bgcolor: "#fff",
      bordercolor: "#000",
      font: {color: "#000"}
    }
  };
}
