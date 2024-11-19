// app/dropdown/page.tsx
import { notFound } from 'next/navigation'
import { getFirestore } from 'firebase-admin/firestore';
import { Lollipop } from "../../components/visualisation/lollipop_chart";
import { LineChart } from '../../components/visualisation/line_chart';
import { SparkLine } from '@/components/visualisation/sparkline';
import { PageProps } from 'next';

interface VolatilityMeasure {
  id: string;
  [key: string]: any;
}

interface dataPayload {
  vol_array: VolatilityMeasure;
  kde_data: Array<any>;
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

async function TickerPages({ params }: PageProps) {
  const slug = await params.slug;
  const stds = await getData(slug);
  let data = stds.vol_array.data;
  let kde_data = stds.kde_data;
  const last_5_days_vol = data.slice(-5).map((item: { annualized_volatility: number; }) => item.annualized_volatility);

  data = data.map((item: { date: string; annualized_volatility: number; }) => ({
    x: new Date(item.date),
    y: item.annualized_volatility
  }));

  return (
    <div style={{ backgroundColor: '#F7FAFF', padding: '20px' }} className="--font-geist-mono">
      {/* <Lollipop data={data} width={250} height={250} /> */}
      <LineChart data={kde_data} width={350} height={250} last_5_days_vol={last_5_days_vol} />
      <SparkLine data={data} width={350} height={100} />
    </div>
  );

}

export default TickerPages; 