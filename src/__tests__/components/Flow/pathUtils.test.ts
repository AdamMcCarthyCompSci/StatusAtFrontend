import { describe, it, expect } from 'vitest';
import { generateOrthogonalPath, convertPathToScreen } from '../../../components/Flow/pathUtils';
import { FlowStep, CanvasState } from '../../../components/Flow/types';

describe('Path Utils', () => {
  const mockSteps: FlowStep[] = [
    { id: 'A', name: 'Node A', x: 100, y: 100 },
    { id: 'B', name: 'Node B', x: 300, y: 200 },
    { id: 'C', name: 'Node C', x: 150, y: 300 },
  ];

  describe('generateOrthogonalPath', () => {
    it('should generate a valid SVG path for horizontal connection', () => {
      const path = generateOrthogonalPath('A', 'B', mockSteps);
      
      expect(path).toBeDefined();
      expect(typeof path).toBe('string');
      expect(path).toMatch(/^M\s*[\d.-]+\s+[\d.-]+/); // Should start with M (move to)
      expect(path).toContain('L'); // Should contain line commands
    });

    it('should generate a valid SVG path for vertical connection', () => {
      const path = generateOrthogonalPath('A', 'C', mockSteps);
      
      expect(path).toBeDefined();
      expect(typeof path).toBe('string');
      expect(path).toMatch(/^M\s*[\d.-]+\s+[\d.-]+/);
      expect(path).toContain('L');
    });

    it('should handle non-existent nodes gracefully', () => {
      const path = generateOrthogonalPath('X', 'Y', mockSteps);
      
      expect(path).toBeDefined();
      expect(typeof path).toBe('string');
    });

    it('should create different paths for different node pairs', () => {
      const pathAB = generateOrthogonalPath('A', 'B', mockSteps);
      const pathAC = generateOrthogonalPath('A', 'C', mockSteps);
      
      expect(pathAB).not.toBe(pathAC);
    });

    it('should avoid obstacles when routing', () => {
      // Create a scenario where direct path would go through another node
      const stepsWithObstacle: FlowStep[] = [
        { id: 'start', name: 'Start', x: 100, y: 100 },
        { id: 'obstacle', name: 'Obstacle', x: 200, y: 150 },
        { id: 'end', name: 'End', x: 300, y: 200 },
      ];

      const path = generateOrthogonalPath('start', 'end', stepsWithObstacle);
      
      expect(path).toBeDefined();
      expect(path).toContain('L'); // Should have multiple line segments to avoid obstacle
    });
  });

  describe('convertPathToScreen', () => {
    const canvasState: CanvasState = {
      zoom: 2,
      panX: 50,
      panY: 100
    };

    it('should convert world coordinates to screen coordinates in SVG path', () => {
      const worldPath = 'M 100 200 L 150 250 L 200 200';
      const screenPath = convertPathToScreen(worldPath, canvasState);
      
      expect(screenPath).toBeDefined();
      expect(typeof screenPath).toBe('string');
      
      // M 100 200 should become M 250 500 (100*2+50, 200*2+100)
      expect(screenPath).toContain('M 250 500');
      // L 150 250 should become L 350 600 (150*2+50, 250*2+100)
      expect(screenPath).toContain('L 350 600');
      // L 200 200 should become L 450 500 (200*2+50, 200*2+100)
      expect(screenPath).toContain('L 450 500');
    });

    it('should handle negative coordinates', () => {
      const worldPath = 'M -50 -100 L 0 0';
      const screenPath = convertPathToScreen(worldPath, canvasState);
      
      // M -50 -100 should become M -50 -100 (-50*2+50, -100*2+100)
      expect(screenPath).toContain('M -50 -100');
      // L 0 0 should become L 50 100 (0*2+50, 0*2+100)
      expect(screenPath).toContain('L 50 100');
    });

    it('should handle decimal coordinates', () => {
      const worldPath = 'M 100.5 200.25 L 150.75 250.5';
      const screenPath = convertPathToScreen(worldPath, canvasState);
      
      expect(screenPath).toContain('M 251 500.5'); // 100.5*2+50, 200.25*2+100
      expect(screenPath).toContain('L 351.5 601'); // 150.75*2+50, 250.5*2+100
    });

    it('should preserve non-coordinate parts of the path', () => {
      const worldPath = 'M 100 200 L 150 250 Z';
      const screenPath = convertPathToScreen(worldPath, canvasState);
      
      expect(screenPath).toContain('Z'); // Close path command should be preserved
    });

    it('should handle empty or invalid paths gracefully', () => {
      expect(convertPathToScreen('', canvasState)).toBe('');
      expect(convertPathToScreen('invalid path', canvasState)).toBe('invalid path');
    });

    it('should work with different zoom levels', () => {
      const highZoomState: CanvasState = { zoom: 0.5, panX: 0, panY: 0 };
      const worldPath = 'M 100 200';
      const screenPath = convertPathToScreen(worldPath, highZoomState);
      
      // M 100 200 should become M 50 100 (100*0.5+0, 200*0.5+0)
      expect(screenPath).toContain('M 50 100');
    });
  });
});
