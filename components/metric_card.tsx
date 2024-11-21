import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { TrendingUpDown } from 'lucide-react';
  import '../public/styles.css';
export function MetricCard({ height, width, title, datum } : { height: string | number, width: string | number, title: string, datum: number }) {
  return (
    <Card className={`max-w-screen-sm font-mono rounded-xl bg-white/95 backdrop-blur-2xl lg:w-48 h-${height} text-stone-700`}>
      <TrendingUpDown size={20} className="mt-4 ml-6 mb-2" />
      <CardHeader className="pt-2 pb-1">
        <CardTitle className='text-base'>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-row items-center">
        
        <span className='font-mono text-base p-1 bg-stone-100 shadow-sm rounded-lg'>{datum}</span>
      </CardContent>
    </Card>
  )
}

