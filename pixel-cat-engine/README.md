# React Native Pixel Cat Animation Engine

This folder contains the core logic for the Data-Driven Pixel Cat animation engine, ready to be implemented in a React Native application (ideally using `react-native-skia` for high-performance canvas rendering).

## Architecture

Instead of relying on predefined loops or large spritesheets, this engine computes animations procedurally by manipulating a 21x21 array of color indices based on explicit inputs.

1. `catPatterns.ts`: Contains the definitions for your varous cats. 
2. `catAnimationEngine.ts`: The pure-logic brain. You feed it a local `tick` (time elapsed for current action) and an `AnimationControls` object of booleans, and it returns the exact 21x21 matrix to render.

## Complete Animation Control

You have full React Native control over the cat's behavior via the `AnimationControls` interface:

```typescript
export interface AnimationControls {
  lookLeft?: boolean;
  lookRight?: boolean;
  scratching?: boolean;  // Rises paw to face
  yawning?: boolean;     // Opens pink mouth
  tailWagging?: boolean; // Smooth wag loop
  earTwitchLeft?: boolean;
  earTwitchRight?: boolean;
  happyMeow?: boolean;   // Eyes ^ ^ and floating hearts
  sleeping?: boolean;    // Face drops, Zzz particles
  blinking?: boolean;    // Auto-blinks on an interval
}
```

## React Native Implementation Example

```tsx
import React, { useState, useEffect } from 'react';
import { useSharedValue, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { Canvas, Group } from '@shopify/react-native-skia';
import { catPatterns } from './catPatterns';
import { getCatState, generateRenderFrame, AnimationControls } from './catAnimationEngine';

export const AnimatedPixelCat = ({ catId = "white", scale = 10 }) => {
  const tick = useSharedValue(0);
  const [controls, setControls] = useState<AnimationControls>({
    blinking: true,
    tailWagging: true, 
  });
  
  // Start the 60fps local tick loop
  useEffect(() => {
    tick.value = withRepeat(
      withTiming(6000, { duration: 100000, easing: Easing.linear }),
      -1 
    );
  }, []);

  const triggerYawn = () => {
    setControls(prev => ({ ...prev, yawning: true }));
    setTimeout(() => setControls(prev => ({ ...prev, yawning: false })), 1000);
  };

  const cat = catPatterns.find(c => c.id === catId);

  return (
    <Canvas style={{ width: 21 * scale, height: 21 * scale }} onTouchEnd={triggerYawn}>
      {/* 
        Inside a custom Skia component or calculated on JS thread:
        const state = getCatState(Math.floor(tick.value), controls);
        const frame = generateRenderFrame(cat, state);
        
        // Render rects based on `frame`
      */}
    </Canvas>
  );
};
```
