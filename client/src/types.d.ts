// Add support for A-Frame elements in JSX
declare namespace JSX {
  interface IntrinsicElements {
    'a-scene': any;
    'a-entity': any;
    'a-box': any;
    'a-camera': any;
    'a-marker': any;
    'a-marker-camera': any;
    'a-cursor': any;
    'a-text': any;
    'a-sphere': any;
    'a-cylinder': any;
    'a-plane': any;
    'a-sky': any;
  }
}
