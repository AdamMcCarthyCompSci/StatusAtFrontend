import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FlowNode } from '../../../components/Flow/components/FlowNode';
import { FlowStep, ConnectionState } from '../../../components/Flow/types';

describe('FlowNode', () => {
  const mockStep: FlowStep = {
    id: 'test-node',
    name: 'Test Node',
    x: 100,
    y: 200
  };

  const mockConnectionState: ConnectionState = {
    isConnecting: false
  };

  const defaultProps = {
    step: mockStep,
    isSelected: false,
    isHovered: false,
    isConnectionTarget: false,
    isDragging: false,
    isEditing: false,
    onMouseDown: vi.fn(),
    onDoubleClick: vi.fn(),
    onMouseEnter: vi.fn(),
    onMouseLeave: vi.fn(),
    onMouseUp: vi.fn(),
    onConnectionStart: vi.fn(),
    onNameChange: vi.fn(),
    onEditingEnd: vi.fn(),
    connectionState: mockConnectionState
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render node with correct name and position', () => {
    render(<FlowNode {...defaultProps} />);

    expect(screen.getByText('Test Node')).toBeInTheDocument();

    const nodeElement = document.querySelector('[data-flow-node="test-node"]');
    expect(nodeElement).toHaveStyle({
      left: '100px',
      top: '200px'
    });
  });

  describe('node states', () => {
    it('should apply selected styles when selected', () => {
      render(<FlowNode {...defaultProps} isSelected={true} />);

      const nodeElement = document.querySelector('[data-flow-node="test-node"]');
      expect(nodeElement).toHaveClass('bg-blue-600', 'border-4', 'border-blue-700', 'ring-4', 'ring-blue-300', 'shadow-xl', 'scale-105');
    });

    it('should apply connection target styles when hovered and is connection target', () => {
      render(<FlowNode {...defaultProps} isHovered={true} isConnectionTarget={true} />);

      const nodeElement = document.querySelector('[data-flow-node="test-node"]');
      expect(nodeElement).toHaveClass('bg-green-500', 'border-4', 'border-green-600', 'ring-4', 'ring-green-300', 'shadow-xl');
    });

    it('should apply connection target styles when is connection target but not hovered', () => {
      render(<FlowNode {...defaultProps} isConnectionTarget={true} />);

      const nodeElement = document.querySelector('[data-flow-node="test-node"]');
      expect(nodeElement).toHaveClass('bg-blue-500', 'border-2', 'border-blue-400', 'ring-2', 'ring-blue-200');
    });

    it('should disable transitions when dragging', () => {
      render(<FlowNode {...defaultProps} isDragging={true} />);

      const nodeElement = document.querySelector('[data-flow-node="test-node"]');
      expect(nodeElement).not.toHaveClass('transition-all', 'duration-200');
    });

    it('should enable transitions when not dragging', () => {
      render(<FlowNode {...defaultProps} isDragging={false} />);

      const nodeElement = document.querySelector('[data-flow-node="test-node"]');
      expect(nodeElement).toHaveClass('transition-all', 'duration-200');
    });
  });

  describe('editing mode', () => {
    it('should show input field when editing', () => {
      render(<FlowNode {...defaultProps} isEditing={true} />);
      
      const input = screen.getByDisplayValue('Test Node');
      expect(input).toBeInTheDocument();
      expect(input).toHaveClass('bg-transparent', 'border-none', 'outline-none');
    });

    it('should call onNameChange when input value changes and loses focus', () => {
      render(<FlowNode {...defaultProps} isEditing={true} />);

      const input = screen.getByDisplayValue('Test Node');
      fireEvent.change(input, { target: { value: 'New Name' } });
      fireEvent.blur(input);

      expect(defaultProps.onNameChange).toHaveBeenCalledWith('test-node', 'New Name');
    });

    it('should call onEditingEnd when Enter is pressed', () => {
      render(<FlowNode {...defaultProps} isEditing={true} />);
      
      const input = screen.getByDisplayValue('Test Node');
      fireEvent.keyDown(input, { key: 'Enter' });
      
      expect(defaultProps.onEditingEnd).toHaveBeenCalled();
    });

    it('should call onEditingEnd when input loses focus', () => {
      render(<FlowNode {...defaultProps} isEditing={true} />);
      
      const input = screen.getByDisplayValue('Test Node');
      fireEvent.blur(input);
      
      expect(defaultProps.onEditingEnd).toHaveBeenCalled();
    });
  });

  describe('mouse interactions', () => {
    it('should call onMouseDown when node is clicked', () => {
      render(<FlowNode {...defaultProps} />);

      const nodeElement = document.querySelector('[data-flow-node="test-node"]');
      fireEvent.mouseDown(nodeElement!);

      expect(defaultProps.onMouseDown).toHaveBeenCalledWith(expect.any(Object), 'test-node');
    });

    it('should call onDoubleClick when node is double-clicked', () => {
      render(<FlowNode {...defaultProps} />);

      const nodeElement = document.querySelector('[data-flow-node="test-node"]');
      fireEvent.doubleClick(nodeElement!);

      expect(defaultProps.onDoubleClick).toHaveBeenCalledWith('test-node');
    });

    it('should call onMouseEnter when mouse enters node', () => {
      render(<FlowNode {...defaultProps} />);

      const nodeElement = document.querySelector('[data-flow-node="test-node"]');
      fireEvent.mouseEnter(nodeElement!);

      expect(defaultProps.onMouseEnter).toHaveBeenCalledWith('test-node');
    });

    it('should call onMouseLeave when mouse leaves node', () => {
      render(<FlowNode {...defaultProps} />);

      const nodeElement = document.querySelector('[data-flow-node="test-node"]');
      fireEvent.mouseLeave(nodeElement!);

      expect(defaultProps.onMouseLeave).toHaveBeenCalled();
    });

    it('should call onMouseUp when connection target is clicked', () => {
      render(<FlowNode {...defaultProps} isConnectionTarget={true} />);

      const nodeElement = document.querySelector('[data-flow-node="test-node"]');
      fireEvent.mouseUp(nodeElement!);

      expect(defaultProps.onMouseUp).toHaveBeenCalledWith('test-node');
    });

    it('should not call onMouseUp when not a connection target', () => {
      render(<FlowNode {...defaultProps} isConnectionTarget={false} />);

      const nodeElement = document.querySelector('[data-flow-node="test-node"]');
      fireEvent.mouseUp(nodeElement!);

      expect(defaultProps.onMouseUp).not.toHaveBeenCalled();
    });
  });

  describe('connection handles', () => {
    it('should show connection handles when not connecting', () => {
      render(<FlowNode {...defaultProps} />);
      
      // Should have 4 connection handles (top, right, bottom, left)
      const handles = document.querySelectorAll('.cursor-crosshair');
      expect(handles).toHaveLength(4);
    });

    it('should show connection handles when this node is the source', () => {
      const connectingState: ConnectionState = {
        isConnecting: true,
        fromNodeId: 'test-node'
      };
      
      render(<FlowNode {...defaultProps} connectionState={connectingState} />);
      
      const handles = document.querySelectorAll('.cursor-crosshair');
      expect(handles).toHaveLength(4);
    });

    it('should hide connection handles when connecting from another node', () => {
      const connectingState: ConnectionState = {
        isConnecting: true,
        fromNodeId: 'other-node'
      };
      
      render(<FlowNode {...defaultProps} connectionState={connectingState} />);
      
      const handles = document.querySelectorAll('.cursor-crosshair');
      expect(handles).toHaveLength(0);
    });

    it('should call onConnectionStart when connection handle is clicked', () => {
      render(<FlowNode {...defaultProps} />);
      
      const handles = document.querySelectorAll('.cursor-crosshair');
      fireEvent.mouseDown(handles[0]); // Click first handle
      
      expect(defaultProps.onConnectionStart).toHaveBeenCalledWith(expect.any(Object), 'test-node');
    });

    it('should have proper styling for connection handles', () => {
      render(<FlowNode {...defaultProps} />);
      
      const handles = document.querySelectorAll('.cursor-crosshair');
      handles.forEach(handle => {
        expect(handle).toHaveClass('bg-blue-600', 'border', 'border-white', 'rounded-full');
      });
    });
  });

  describe('accessibility', () => {
    it('should have proper cursor styles', () => {
      render(<FlowNode {...defaultProps} />);

      const nodeElement = document.querySelector('[data-flow-node="test-node"]');
      expect(nodeElement).toHaveClass('cursor-pointer');
    });

    it('should be non-selectable', () => {
      render(<FlowNode {...defaultProps} />);

      const nodeElement = document.querySelector('[data-flow-node="test-node"]');
      expect(nodeElement).toHaveClass('select-none');
    });

    it('should have proper dimensions', () => {
      render(<FlowNode {...defaultProps} />);

      const nodeElement = document.querySelector('[data-flow-node="test-node"]');
      expect(nodeElement).toHaveClass('w-36', 'h-24'); // 144px x 96px
    });
  });
});
