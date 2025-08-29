import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-foreground mb-6">
            InstaMoments
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Instant collaborative photo and video galleries for events in the
            Philippines. Scan QR codes, capture moments, and create beautiful
            memories together.
          </p>
          <div className="mt-8 space-x-4">
            <Button size="lg" className="bg-brand-600 hover:bg-brand-700">
              Get Started
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <a href="/components">View Components</a>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-brand-600">QR Code Access</CardTitle>
              <CardDescription>
                No app downloads required. Just scan and start sharing
                instantly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Event organizers create galleries and get printable QR codes.
                Attendees scan to access the camera and start contributing
                immediately.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-brand-600">
                Real-time Gallery
              </CardTitle>
              <CardDescription>
                See photos appear live as they&apos;re uploaded during events.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Watch memories build in real-time. Everyone can view the gallery
                as it grows, creating excitement and engagement during events.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-brand-600">Video Greetings</CardTitle>
              <CardDescription>
                Personal 20-second video messages for complete event memories.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Record heartfelt messages and well-wishes. Perfect for weddings,
                birthdays, and special celebrations in Filipino culture.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-semibold mb-4">
            Perfect for Philippine Events
          </h2>
          <p className="text-muted-foreground mb-8">
            From intimate family gatherings to large corporate celebrations,
            InstaMoments captures every precious moment.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <span className="px-3 py-1 bg-muted rounded-full">Weddings</span>
            <span className="px-3 py-1 bg-muted rounded-full">Birthdays</span>
            <span className="px-3 py-1 bg-muted rounded-full">
              Corporate Events
            </span>
            <span className="px-3 py-1 bg-muted rounded-full">Graduations</span>
            <span className="px-3 py-1 bg-muted rounded-full">
              Anniversaries
            </span>
            <span className="px-3 py-1 bg-muted rounded-full">
              Community Celebrations
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
