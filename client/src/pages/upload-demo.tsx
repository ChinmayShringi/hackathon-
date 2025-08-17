import React from 'react';
import Navigation from '@/components/navigation';
import { UploadDemo } from '@/components/upload/upload-demo';

export default function UploadDemoPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Navigation />
      <UploadDemo />
    </div>
  );
}
