import { getFirestore } from 'firebase-admin/firestore';
import { LineChart } from '../../components/visualisation/line_chart';
import { SparkLine } from '@/components/visualisation/sparkline';
import {MetricCard} from '@/components/metric_card';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import {RollingVolDataLineChart} from '@/components/visualisation/rolling_volatility/lineChartDatasetTransition'
import { DM_Mono } from 'next/font/google'
import  Example  from '@/components/visualisation/vol_cone';
import {getCleanedDataForVolCone} from '@/scripts/stats';
interface VolatilityMeasure {
  id: string;
  [key: string]: any;
}
const dmMono = DM_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-mono",
})

interface dataPayload {
  vol_array: VolatilityMeasure;
  kde_data: Array<any>;
}

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const getData = async (slug: string): Promise<dataPayload> => {
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

async function TickerPages({ params }: any) {
  const { slug } = await params
  const stds = await getData(slug);
  let data = stds.vol_array.data;
  let kde_data = stds.kde_data;
  const last_day_vol = data.slice(-1).map((item: { annualized_volatility: number; }) => item.annualized_volatility);
  const last_day_quantile = data.slice(-1).map((item: { quantile: number; }) => item.quantile);

  data = data.map((item: { date: string; annualized_volatility: number; }) => ({
    x: new Date(item.date),
    y: item.annualized_volatility
  }));

  return (
    <div className={`${dmMono.variable} bg-gradient-to-r from-cyan-800 to-teal-800`}>
      <div className='isolate aspect-video flex flex-col w-screen h-screen bg-white/95 backdrop-blur-2xl justify-start items-center'>
      <div className='flex flex-col lg:flex-row gap-2'>
      <MetricCard width={48} height={'fit'} title="Last Day Standard Deviation" datum={last_day_vol[last_day_vol.length - 1].toFixed(3)}/>
      <MetricCard width={48} height={'fit'} title="Last Day Standard Deviation Quantile" datum={last_day_quantile[last_day_quantile.length - 1].toFixed(3)}/>
      </div>
      <div className='flex flex-col lg:flex-row mt-10 gap-5'>
      <LineChart  data={kde_data} width={350} height={250} last_day_vol={last_day_vol} />
      <SparkLine data={data} width={300} height={150} />
      {/* <RollingVolDataLineChart width={350} height={250} /> */}
      <Example width={500} height={300} data={getCleanedDataForVolCone(stds)}/>
      </div>
      </div>
    </div>
  );

}

export default TickerPages; 