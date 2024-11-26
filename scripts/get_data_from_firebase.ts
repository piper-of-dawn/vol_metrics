import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, cert, getApps } from 'firebase-admin/app';

import { VolatilityMeasure, dataPayload } from '@/typing/firebase';

if (!getApps().length) {
  initializeApp({
  credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
  });
}

export const getDataPayloadFromFirebase = async (slug: string): Promise<dataPayload> => {
    try {
      const db = getFirestore();
      slug = slug.toUpperCase();
      const snapshot = await db.collection(`/vol_measures/${slug}/std_dev/`).get();
      let data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as VolatilityMeasure[];
  
      return {vol_array: data.filter(item => item.id === 'std')[0] as VolatilityMeasure, 
              kde_data: data.filter(item => item.id === 'kde')[0].data};
  
    } catch (error) {
      console.error('Error fetching data:', error);
      return {} as dataPayload;
    }
  };


// const t = await getData('aapl');
// const array = t.vol_array.data.map(d=>d.annualized_volatility);



