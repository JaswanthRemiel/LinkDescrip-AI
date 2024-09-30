'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle } from 'lucide-react';
import { cn } from "@/lib/utils";
import { BorderBeam } from "@/components/ui/border-beam";
import { DotPattern } from "@/components/ui/dot-pattern";
import { Dock, DockIcon } from "@/components/ui/dock";
import { Icons } from "@/components/ui/icons";
import GradualSpacing from '@/components/ui/gradual-spacing';

// Hugging Face API URL and token (for GPT-Neo model)
const API_URL = 'https://api-inference.huggingface.co/models/EleutherAI/gpt-neo-2.7B';
const API_TOKEN = process.env.NEXT_PUBLIC_HUGAPI; // Ensure this is set in your .env.local file

// Function to call Hugging Face API for headline generation
const generateHeadline = async (bio: string): Promise<string> => {
  const prompt = `Based on this bio: "${bio}", generate a catchy and professional LinkedIn headline in under 7 to 9 words and i only want the headline to be generated not anything else just give me the headline only `;

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ inputs: prompt, parameters: { max_length: 30, temperature: 0.7 } }) // Adjusting parameters
  });

  if (!response.ok) {
    const errorDetails = await response.text();
    const error = new Error(`Failed to fetch headline. Status: ${response.status}. Details: ${errorDetails}`);
    throw error;
  }

  const result = await response.json();
  console.log(result); // Log the full response to check its structure

  // Check if the model returns the generated text
  if (Array.isArray(result) && result[0]?.generated_text) {
    return result[0].generated_text.trim();
  }

  return 'No headline generated. Please try again.';
}

export default function HeadlineGenerator() {
  const [bio, setBio] = useState('');
  const [headline, setHeadline] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!bio.trim()) {
      setError('Please enter your bio');
      return;
    }

    setError('');
    setIsLoading(true);
    try {
      const generatedHeadline = await generateHeadline(bio);
      setHeadline(generatedHeadline);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center">
      <DotPattern
        className={cn(
          "[mask-image:radial-gradient(900px_circle_at_center,black,transparent)]",
        )}
      />

      {/* Main Card content */}
      <Card className="w-full max-w-2xl mx-auto relative">
        <BorderBeam size={500} duration={12} delay={12} />
        <CardHeader>
          <GradualSpacing className="font-display text-center text-4xl font-bold -tracking-widest text-black dark:text-white md:text-7xl md:leading-[5rem]" text="LinkDescrip AI" />
          <CardDescription className="font-display text-center text-lg text-gray-500 dark:text-gray-400">Enter your bio to generate an optimized LinkedIn headline</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter your professional bio here..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={5}
            className="resize-none"
          />
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {headline && (
            <Alert>
              <AlertTitle>Generated Headline</AlertTitle>
              <AlertDescription>{headline}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Headline'
            )}
          </Button>
        </CardFooter>
      </Card>
      <Dock direction="bottom">
        <DockIcon>
          <a href="https://remiel.fyi" target='_blank' rel="noopener" title="Google"><Icons.logo className="size-6" /></a>
        </DockIcon>
        <DockIcon>
          <a href="https://remiel.fyi" target='_blank' rel="noopener" title="Google"><Icons.google className="size-6" /></a>
        </DockIcon>
        <DockIcon>
          <a href="https://remiel.fyi" target='_blank' rel="noopener" title="Google"><Icons.google className="size-6" /></a>
        </DockIcon>
        <DockIcon>
          <a href="https://remiel.fyi" target='_blank' rel="noopener" title="Google"><Icons.spinner className="size-6" /></a>
        </DockIcon>
      </Dock>
    </div>
  );
}
