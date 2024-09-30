import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';

const ColorGameRules: React.FC = () => {
  return (
    <Card className="w-full max-w-3xl mx-auto absolute top-20 left-1/2 transform -translate-x-1/2 z-30 bg-white text-black overflow-y-auto max-h-[80vh]">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Color Guessing Game: Rules and Tips</CardTitle>
      </CardHeader>
      <CardContent>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Understanding the 6-Digit Color Code</h2>
          <p className="mb-2">In web design, colors are often represented using a 6-digit hexadecimal code. Here's how it works:</p>
          <ul className="list-disc list-inside mb-2">
            <li>The code is always 6 characters long, using numbers 0-9 and letters A-F.</li>
            <li>It's usually written with a # in front, like #FF0000 for bright red.</li>
            <li>The first two digits represent red, the middle two green, and the last two blue.</li>
            <li>Each pair ranges from 00 (none of that color) to FF (maximum of that color).</li>
          </ul>
          <p>For example:</p>
          <ul className="list-disc list-inside">
            <li>#FF0000 is bright red (maximum red, no green, no blue)</li>
            <li>#00FF00 is bright green</li>
            <li>#0000FF is bright blue</li>
            <li>#000000 is black (no color at all)</li>
            <li>#FFFFFF is white (maximum of all colors)</li>
          </ul>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Game Rules</h2>
          <ol className="list-decimal list-inside">
            <li>A random color will be displayed on the screen.</li>
            <li>Your task is to guess the 6-digit hex code for this color.</li>
            <li>Enter your guess in the input field and click 'Guess'.</li>
            <li>If correct, you'll score a point and move to the next color.</li>
            <li>If incorrect, you can try again until you get it right.</li>
          </ol>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Tips for Better Guessing</h2>
          <ul className="list-disc list-inside">
            <li>Start by identifying the dominant color (red, green, or blue).</li>
            <li>Estimate the intensity of each color component (00 to FF).</li>
            <li>Pure gray colors have equal values for all three components.</li>
            <li>Lighter colors have higher values, darker colors have lower values.</li>
            <li>Practice recognizing common colors like #FF0000 (red), #00FF00 (green), #0000FF (blue).</li>
            <li>Remember, slight variations can make a big difference in appearance!</li>
          </ul>
        </section>
      </CardContent>
    </Card>
  );
};

export default ColorGameRules;