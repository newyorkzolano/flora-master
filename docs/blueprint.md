# **App Name**: Flora Master

## Core Features:

- Quiz Mode: Presents a 3-question quiz about botany per round with three answer options per question; provides correct answers at round's end. User provides questions.
- Image Guessing Game: Displays 2 plant images per round; user selects the correct name from 3 options, with feedback at the round's end. User provides images.
- Leaf-Tree Matching: Players match 3 leaves to their respective trees, receiving feedback on their matches at the end of each round. User provides leaves and trees.
- Image Upload: Allows users to upload images from local files for use in the Image Guessing Game and Leaf-Tree Matching.
- Question Input: Enables users to input their own questions for the Quiz Mode, either via a web interface or by uploading a local JSON file.
- Single Round Gameplay: Each game mode consists of a single round, and the entire game is played once through all modes.
- Highlight Feedback: Highlights correct answers in green and incorrect answers in red.
- Local Storage: Saves uploaded images and questions locally (e.g., in localStorage) for reuse during the session.
- Automatic Sequence: Automatically transitions to the next game mode upon completion of the current mode.

## Style Guidelines:

- Primary color: Forest Green (#388E3C), evoking nature and growth.
- Background color: Light Beige (#F5F5DC), providing a neutral and natural backdrop.
- Accent color: Earthy Brown (#A1887F), used for interactive elements and highlights.
- Font: 'Literata' (serif) for a readable and elegant user experience, suitable for both headlines and body text.
- Use simple, line-style icons representing various botanical elements (leaves, trees, flowers).
- Clean and spacious layout with distinct sections for each game mode to prevent visual clutter. Responsive layout optimized for desktop.
- Subtle animations, such as a gentle fade-in effect when revealing answers or completing a matching task. Simple animations using Tailwind CSS.