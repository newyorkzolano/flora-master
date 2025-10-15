import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface GameWrapperProps {
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
}

export function GameWrapper({ title, description, children, className }: GameWrapperProps) {
  return (
    <div className="w-full max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-500">
      <Card className={cn("shadow-xl", className)}>
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-center text-primary">{title}</CardTitle>
          <CardDescription className="text-center">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
      </Card>
    </div>
  );
}
