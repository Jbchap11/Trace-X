import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="soc-error-page">
      <Card className="soc-error-card">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-[var(--soc-danger)]" />
            <h1 className="text-2xl font-bold soc-error-title">
              404 Page Not Found
            </h1>
          </div>

          <p className="mt-4 text-sm soc-error-copy">
            Did you forget to add the page to the router?
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
