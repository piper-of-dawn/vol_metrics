// components/data_fetcher.tsx
import { FirestoreDocument } from '../typing/firebase';

interface TestProps {
  data: FirestoreDocument[];
  error?: string;
}

const Test: React.FC<TestProps> = ({ data, error }) => {
  if (error) return <div>Error: {error}</div>;
  if (!data.length) return <div>No data found.</div>;

  return (
    <div className="container mx-auto p-4 font-mono">
      <h1 className="text-2xl font-bold mb-4">Data from Firebase</h1>
      <div className="grid gap-4">
        {data.map((item) => (
          <div key={item.id} className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold">{item.title}</h2>
            <p className="text-gray-600">{item.description}</p>
            <p className="text-sm text-gray-500">
              Created: {item.createdAt}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Test;
