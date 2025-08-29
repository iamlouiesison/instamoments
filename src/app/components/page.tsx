import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Calendar, MapPin } from 'lucide-react';

export default function ComponentsPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-6xl space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="h1 text-primary">InstaMoments Component Library</h1>
          <p className="text-lead text-muted-foreground">
            A showcase of our custom shadcn/ui components with InstaMoments
            branding
          </p>
        </div>

        {/* Buttons Section */}
        <section className="space-y-6">
          <h2 className="h2">Buttons</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="default">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button variant="celebration">Celebration</Button>
            <Button variant="photo">Photo</Button>
            <Button variant="video">Video</Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon">
              <Camera className="h-4 w-4" />
            </Button>
          </div>
        </section>

        {/* Inputs Section */}
        <section className="space-y-6">
          <h2 className="h2">Inputs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input placeholder="Enter your name" />
            <Input type="email" placeholder="Enter your email" />
            <Input type="password" placeholder="Enter your password" />
            <Input disabled placeholder="Disabled input" />
          </div>
        </section>

        {/* Cards Section */}
        <section className="space-y-6">
          <h2 className="h2">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Card</CardTitle>
                <CardDescription>
                  Beautiful event showcase with our design system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>December 25, 2024</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-2">
                  <MapPin className="h-4 w-4" />
                  <span>Manila, Philippines</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">
                  Details
                </Button>
                <Button size="sm">Join Event</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Photo Gallery</CardTitle>
                <CardDescription>
                  Capture and share your moments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                  <Camera className="h-12 w-12 text-muted-foreground" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="photo" size="sm">
                  Take Photo
                </Button>
                <Button variant="outline" size="sm">
                  View Gallery
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Live Stream</CardTitle>
                <CardDescription>Real-time event broadcasting</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Badge variant="live">LIVE</Badge>
                  <span className="text-sm text-muted-foreground">
                    2.5k watching
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="video" className="w-full">
                  Join Stream
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Badges Section */}
        <section className="space-y-6">
          <h2 className="h2">Badges</h2>
          <div className="flex flex-wrap gap-4">
            <Badge variant="default">Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="celebration">Celebration</Badge>
            <Badge variant="photo">Photo</Badge>
            <Badge variant="video">Video</Badge>
            <Badge variant="live">LIVE</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
          </div>
        </section>

        {/* Avatars Section */}
        <section className="space-y-6">
          <h2 className="h2">Avatars</h2>
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage src="https://github.com/vercel.png" alt="@vercel" />
              <AvatarFallback>VR</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>IM</AvatarFallback>
            </Avatar>
          </div>
        </section>

        {/* Dialog Section */}
        <section className="space-y-6">
          <h2 className="h2">Dialog</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Open Dialog</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Event Details</DialogTitle>
                <DialogDescription>
                  Make changes to your event here. Click save when you&apos;re
                  done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="name" className="text-right">
                    Name
                  </label>
                  <Input
                    id="name"
                    value="Christmas Party 2024"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="date" className="text-right">
                    Date
                  </label>
                  <Input
                    id="date"
                    value="December 25, 2024"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </section>

        {/* Color Palette Section */}
        <section className="space-y-6">
          <h2 className="h2">Color Palette</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="h-20 bg-primary rounded-lg"></div>
              <p className="text-sm font-medium">Primary</p>
              <p className="text-xs text-muted-foreground">#3B82F6</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-secondary rounded-lg"></div>
              <p className="text-sm font-medium">Secondary</p>
              <p className="text-xs text-muted-foreground">#F59E0B</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-success rounded-lg"></div>
              <p className="text-sm font-medium">Success</p>
              <p className="text-xs text-muted-foreground">#10B981</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-destructive rounded-lg"></div>
              <p className="text-sm font-medium">Destructive</p>
              <p className="text-xs text-muted-foreground">#EF4444</p>
            </div>
          </div>
        </section>

        {/* Typography Section */}
        <section className="space-y-6">
          <h2 className="h2">Typography</h2>
          <div className="space-y-4">
            <h1 className="h1">Heading 1 - Event Titles</h1>
            <h2 className="h2">Heading 2 - Section Headers</h2>
            <h3 className="h3">Heading 3 - Card Titles</h3>
            <h4 className="h4">Heading 4 - Subsection Headers</h4>
            <h5 className="h5">Heading 5 - Component Titles</h5>
            <h6 className="h6">Heading 6 - Small Headers</h6>
            <p className="text-lead">Lead text for hero descriptions</p>
            <p className="text-large">Large text for important content</p>
            <p className="text-default">
              Default body text for standard content
            </p>
            <p className="text-small">Small text for captions and metadata</p>
          </div>
        </section>

        {/* Payment Methods Section */}
        <section className="space-y-6">
          <h2 className="h2">Philippine Payment Methods</h2>
          <div className="flex space-x-4">
            <div className="gcash-blue text-white px-4 py-2 rounded-lg font-medium">
              GCash
            </div>
            <div className="paymaya-green text-white px-4 py-2 rounded-lg font-medium">
              PayMaya
            </div>
            <div className="paymongo-purple text-white px-4 py-2 rounded-lg font-medium">
              PayMongo
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
