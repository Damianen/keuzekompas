import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold mb-6">About Keuzekompas</h1>
        <Card>
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
            <CardDescription>
              Empowering better decision-making through technology
            </CardDescription>
          </CardHeader>
          <CardContent className="prose prose-neutral dark:prose-invert">
            <p>
              Keuzekompas is a decision-making platform designed to help individuals
              and teams make better choices through structured analysis and
              collaborative tools.
            </p>
            <p>
              We believe that better decisions come from clear thinking, proper
              analysis, and the right tools. Our platform combines modern technology
              with proven decision-making frameworks to help you navigate complex
              choices with confidence.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
