import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Camera, QrCode, Users, Video } from 'lucide-react';

export default function Home() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-50 to-orange-100 py-20 lg:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm">
              🎉 2,000+ Philippine events captured
            </Badge>

            <h1 className="text-5xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              Capture Every{' '}
              <span className="text-amber-600">Precious Moment</span> Together
            </h1>

            <p className="text-xl lg:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              No downloads, no signups for guests - just scan and share
              beautiful event memories instantly
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 text-lg font-semibold"
              >
                Create Your Event Gallery
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                Watch Demo
              </Button>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span>4.9/5 from 500+ reviews</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>10,000+ happy guests</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Why Event Organizers Choose InstaMoments
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three powerful features that make your events unforgettable
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8 border-2 hover:border-amber-200 transition-colors">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <QrCode className="w-8 h-8 text-amber-600" />
              </div>
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl text-foreground">
                  QR Code Magic
                </CardTitle>
                <CardDescription className="text-lg">
                  Guests scan → instant camera access
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  No app downloads or account creation. Just scan the QR code
                  and start capturing memories instantly.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 border-2 hover:border-amber-200 transition-colors">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Camera className="w-8 h-8 text-amber-600" />
              </div>
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl text-foreground">
                  Real-time Gallery
                </CardTitle>
                <CardDescription className="text-lg">
                  Watch memories appear live during your event
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  See photos appear in real-time as guests contribute. Everyone
                  can view the growing gallery during the event.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 border-2 hover:border-amber-200 transition-colors">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Video className="w-8 h-8 text-amber-600" />
              </div>
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl text-foreground">
                  Video Greetings
                </CardTitle>
                <CardDescription className="text-lg">
                  20-second personal messages from loved ones
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Capture heartfelt video messages and well-wishes. Perfect for
                  Filipino celebrations and family events.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get your event gallery running in just 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-2xl font-semibold mb-4">Create Your Event</h3>
              <p className="text-muted-foreground">
                Set up your event details, choose your plan, and get your unique
                QR code instantly
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-2xl font-semibold mb-4">Share QR Code</h3>
              <p className="text-muted-foreground">
                Print or display the QR code at your event. Guests scan and
                start contributing immediately
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-2xl font-semibold mb-4">
                Watch Memories Build
              </h3>
              <p className="text-muted-foreground">
                See your gallery grow in real-time. All photos and videos are
                automatically organized
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the perfect plan for your event size and needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Tier */}
            <Card className="text-center p-8 border-2 hover:border-gray-300 transition-colors">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-2xl">🆓</span>
                  <CardTitle className="text-2xl text-foreground">
                    FREE
                  </CardTitle>
                </div>
                <CardDescription className="text-lg">
                  Perfect for small gatherings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold text-foreground">₱0</div>
                <ul className="text-left space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    30 photos per event
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    3-day storage
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Basic gallery functionality
                  </li>
                </ul>
                <Button variant="outline" className="w-full mt-6">
                  Get Started Free
                </Button>
              </CardContent>
            </Card>

            {/* Standard Tier */}
            <Card className="text-center p-8 border-2 border-amber-200 hover:border-amber-300 transition-colors relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-amber-600 text-white px-4 py-2">
                  Most Popular
                </Badge>
              </div>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-2xl">⭐</span>
                  <CardTitle className="text-2xl text-foreground">
                    STANDARD
                  </CardTitle>
                </div>
                <CardDescription className="text-lg">
                  Ideal for most events
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold text-foreground">₱999</div>
                <ul className="text-left space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    100 photos per event
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    14-day storage
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Video greetings +₱599
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Email sharing
                  </li>
                </ul>
                <Button className="w-full mt-6 bg-amber-600 hover:bg-amber-700">
                  Choose Standard
                </Button>
              </CardContent>
            </Card>

            {/* Premium Tier */}
            <Card className="text-center p-8 border-2 hover:border-gray-300 transition-colors">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-2xl">💎</span>
                  <CardTitle className="text-2xl text-foreground">
                    PREMIUM
                  </CardTitle>
                </div>
                <CardDescription className="text-lg">
                  For large celebrations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold text-foreground">₱1,999</div>
                <ul className="text-left space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    250 photos per event
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    30-day storage
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Video greetings +₱1,199
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Advanced features
                  </li>
                </ul>
                <Button variant="outline" className="w-full mt-6">
                  Choose Premium
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              All plans include: No watermarks • Instant setup • 24/7 support
            </p>
            <p className="text-sm text-muted-foreground">
              Need a custom plan?{' '}
              <a href="/contact" className="text-amber-600 hover:underline">
                Contact us
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Loved by Event Organizers
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See what our users are saying about their InstaMoments experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                &ldquo;Our wedding photos were scattered everywhere before.
                InstaMoments brought everything together beautifully. Our guests
                loved how easy it was!&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <span className="text-amber-600 font-semibold">M</span>
                </div>
                <div>
                  <p className="font-semibold">Maria & Juan</p>
                  <p className="text-sm text-muted-foreground">
                    Wedding Couple, Manila
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                &ldquo;As a wedding planner, I need reliable tools. InstaMoments
                exceeded expectations. The QR code system is genius!&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <span className="text-amber-600 font-semibold">S</span>
                </div>
                <div>
                  <p className="font-semibold">Sarah Santos</p>
                  <p className="text-sm text-muted-foreground">
                    Wedding Planner, Cebu
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                &ldquo;Our corporate team building event was a huge success
                thanks to InstaMoments. Everyone participated and we have
                amazing memories!&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <span className="text-amber-600 font-semibold">R</span>
                </div>
                <div>
                  <p className="font-semibold">Roberto Cruz</p>
                  <p className="text-sm text-muted-foreground">
                    HR Manager, Makati
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about InstaMoments
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">
                Do guests need to download an app?
              </h3>
              <p className="text-muted-foreground">
                No! Guests simply scan the QR code with their phone&apos;s
                camera, which opens the gallery directly in their browser. No
                downloads or account creation required.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">
                How long do photos stay available?
              </h3>
              <p className="text-muted-foreground">
                It depends on your plan: Free (3 days), Basic (7 days), Standard
                (14 days), Premium (30 days). You can extend storage or download
                all photos before expiration.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">
                Can I moderate photos before they go live?
              </h3>
              <p className="text-muted-foreground">
                Yes! Premium plans include photo moderation features. You can
                review and approve photos before they appear in the public
                gallery.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">
                What payment methods do you accept?
              </h3>
              <p className="text-muted-foreground">
                We accept all major Philippine payment methods: GCash, PayMaya,
                bank transfers (BPI, BDO, Metrobank), and credit/debit cards via
                PayMongo.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">
                Is there a limit on how many guests can participate?
              </h3>
              <p className="text-muted-foreground">
                No guest limit! Any number of people can scan and contribute.
                The only limits are on total photos per event based on your
                plan.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">
                Can I use this for corporate events?
              </h3>
              <p className="text-muted-foreground">
                Absolutely! Many companies use InstaMoments for team building,
                conferences, product launches, and corporate celebrations.
                Perfect for professional events.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-amber-600 to-orange-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Capture Your Event Memories?
          </h2>
          <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
            Join thousands of event organizers who trust InstaMoments to make
            their celebrations unforgettable
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-amber-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            >
              Start Your Event Gallery
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-amber-600 px-8 py-4 text-lg"
            >
              Schedule a Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
