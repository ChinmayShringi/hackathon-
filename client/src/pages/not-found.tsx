import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import Metadata from "@/components/metadata";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Metadata
        title="Delula: One-Click Viral Hits"
        description="Delula creates one-click viral hits - no prompts, no hassle. Instantly generate videos and images you can customize with a friendly point-and-click interface."
        image="/delula-alpha-preview.png"
        canonicalUrl="https://delu.la/404"
        keywords="AI content creator, one-click viral videos, no-prompt image generator, text-free AI tool, generate images and videos, instant content creation, creator tools, customizable AI media"
        type="website"
        ogTitle="Delula: One-Click Viral Hits"
        ogDescription="No prompts. No waiting. Just scroll-stopping videos and images, generated instantly and customized your way."
      />
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            Did you forget to add the page to the router?
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
