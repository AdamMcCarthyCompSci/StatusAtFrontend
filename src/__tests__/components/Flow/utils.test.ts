import { describe, it, expect } from 'vitest';
import {
  generateId,
  wouldCreateLoop,
  getNodeConnectionPoints,
  findBestConnectionPoints
} from '../../../components/Flow/utils';
import { FlowStep, FlowTransition } from '../../../components/Flow/types';

describe('Flow Utils', () => {
  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      
      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
      expect(id1.length).toBeGreaterThan(0);
    });
  });

  describe('wouldCreateLoop', () => {
    const transitions: FlowTransition[] = [
      { id: 't1', fromStepId: 'A', toStepId: 'B' },
      { id: 't2', fromStepId: 'B', toStepId: 'C' },
      { id: 't3', fromStepId: 'C', toStepId: 'D' },
    ];

    it('should detect direct loops', () => {
      expect(wouldCreateLoop('B', 'A', transitions)).toBe(true);
    });

    it('should detect indirect loops', () => {
      expect(wouldCreateLoop('D', 'A', transitions)).toBe(true);
    });

    it('should allow valid connections', () => {
      expect(wouldCreateLoop('A', 'D', transitions)).toBe(false);
      expect(wouldCreateLoop('E', 'F', transitions)).toBe(false);
    });

    it('should handle empty transitions', () => {
      expect(wouldCreateLoop('A', 'B', [])).toBe(false);
    });

    it('should handle self-loops', () => {
      expect(wouldCreateLoop('A', 'A', transitions)).toBe(true);
    });
  });

  describe('getNodeConnectionPoints', () => {
    const node: FlowStep = {
      id: 'test',
      name: 'Test Node',
      x: 100,
      y: 200
    };

    it('should return connection points with buffer', () => {
      const points = getNodeConnectionPoints(node);
      
      expect(points).toHaveProperty('top');
      expect(points).toHaveProperty('right');
      expect(points).toHaveProperty('bottom');
      expect(points).toHaveProperty('left');
      
      // Check positions (node is 128x80, buffer is 10px)
      expect(points.top).toEqual({ x: 164, y: 190 }); // x: 100 + 64, y: 200 - 10
      expect(points.right).toEqual({ x: 238, y: 240 }); // x: 100 + 128 + 10, y: 200 + 40
      expect(points.bottom).toEqual({ x: 164, y: 290 }); // x: 100 + 64, y: 200 + 80 + 10
      expect(points.left).toEqual({ x: 90, y: 240 }); // x: 100 - 10, y: 200 + 40
    });
  });

  describe('findBestConnectionPoints', () => {
    const fromNode: FlowStep = { id: 'from', name: 'From', x: 100, y: 100 };
    const toNode: FlowStep = { id: 'to', name: 'To', x: 300, y: 100 };

    it('should prefer horizontal connections for horizontally aligned nodes', () => {
      const result = findBestConnectionPoints(fromNode, toNode);
      
      expect(result.fromSide).toBe('right');
      expect(result.toSide).toBe('left');
    });

    it('should prefer vertical connections for vertically aligned nodes', () => {
      const verticalToNode: FlowStep = { id: 'to', name: 'To', x: 100, y: 300 };
      const result = findBestConnectionPoints(fromNode, verticalToNode);
      
      expect(result.fromSide).toBe('bottom');
      expect(result.toSide).toBe('top');
    });

    it('should handle diagonal connections intelligently', () => {
      const diagonalToNode: FlowStep = { id: 'to', name: 'To', x: 300, y: 300 };
      const result = findBestConnectionPoints(fromNode, diagonalToNode);
      
      // Should pick the primary axis (horizontal in this case)
      expect(['right', 'bottom']).toContain(result.fromSide);
      expect(['left', 'top']).toContain(result.toSide);
    });

    it('should switch to secondary axis when nodes are close on primary axis', () => {
      // Nodes very close horizontally but far vertically
      const closeHorizontalNode: FlowStep = { id: 'to', name: 'To', x: 120, y: 300 };
      const result = findBestConnectionPoints(fromNode, closeHorizontalNode);
      
      expect(result.fromSide).toBe('bottom');
      expect(result.toSide).toBe('top');
    });
  });

});
