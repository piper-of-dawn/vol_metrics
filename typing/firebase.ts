export interface FirebaseConfig {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  }
  
  // If you're storing documents with specific fields, define them here
  export interface FirestoreDocument {
    id: string;
    title: string;
    description: string;
    createdAt: string;
    // Add other fields as needed
  }
  
  export interface VolatilityMeasure {
    id: string;
    [key: string]: any;
  }

  export interface dataPayload {
    vol_array: VolatilityMeasure;
    kde_data: Array<any>;
  }