import {DataTableDemo} from "../components/table";
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { FirestoreDocument } from '../typing/firebase';
import {VolatilityData } from "@/typing"


if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

interface QuantilePayload {
  id: string;
  data: Array<VolatilityData>;
}


const getServerSideProps = async (): Promise<Array<VolatilityData>> => {
  try {
    const db = getFirestore();
    const snapshot = await db.collection("/globals/").get();

    let data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
     })) as QuantilePayload[]
    return data.filter(item => item.id === 'vol_quantiles')[0].data as Array<VolatilityData>
  } catch (error) {
    console.error('Error fetching data:', error);
    return [] as Array<VolatilityData>
  }
};

export default async function Home() {
  const vol_quantile_data = await getServerSideProps();
  return (
    <div className="--font-geist-mono">
<DataTableDemo data={vol_quantile_data} />

    </div>
  );
}

