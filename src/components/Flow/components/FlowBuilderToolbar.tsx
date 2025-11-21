import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Plus,
  ZoomIn,
  ZoomOut,
  Move,
  Maximize2,
  Trash2,
  Users,
  Menu,
  Eye,
  Sparkles,
  Pencil,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

import { FlowStep } from '../types';
import { NodeSelector } from './NodeSelector';

interface FlowBuilderToolbarProps {
  flowName: string;
  steps: FlowStep[];
  selectedNodeId: string | null;
  enableRealtime: boolean;
  showMinimap: boolean;
  onCreateNode: () => void;
  onDeleteNode: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onFitToView: () => void;
  // eslint-disable-next-line no-unused-vars
  onJumpToNode: (step: FlowStep) => void;
  // eslint-disable-next-line no-unused-vars
  onToggleRealtime: (enabled: boolean) => void;
  // eslint-disable-next-line no-unused-vars
  onToggleMinimap: (show: boolean) => void;
  onOrganizeFlow: () => void;
  // eslint-disable-next-line no-unused-vars
  onUpdateFlowName: (newName: string) => Promise<void>;
  isOrganizing?: boolean;
}

const MAX_FLOW_NAME_LENGTH = 50;

export const FlowBuilderToolbar: React.FC<FlowBuilderToolbarProps> = ({
  flowName,
  steps,
  selectedNodeId,
  enableRealtime,
  showMinimap,
  onCreateNode,
  onDeleteNode,
  onZoomIn,
  onZoomOut,
  onResetView,
  onFitToView,
  onJumpToNode,
  onToggleRealtime,
  onToggleMinimap,
  onOrganizeFlow,
  onUpdateFlowName,
  isOrganizing = false,
}) => {
  const { t } = useTranslation();
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(flowName);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update edited name when flowName prop changes
  useEffect(() => {
    setEditedName(flowName);
  }, [flowName]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditingName && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingName]);

  const handleStartEdit = () => {
    setIsEditingName(true);
  };

  const handleSaveName = async () => {
    const trimmedName = editedName.trim();
    if (trimmedName && trimmedName !== flowName) {
      await onUpdateFlowName(trimmedName);
    } else {
      setEditedName(flowName);
    }
    setIsEditingName(false);
  };

  const handleCancelEdit = () => {
    setEditedName(flowName);
    setIsEditingName(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveName();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelEdit();
    }
  };

  return (
    <div className="flex-shrink-0 border-b bg-background">
      <div className="px-2 py-2 sm:px-4 sm:py-4">
        {/* Mobile Layout */}
        <div className="flex items-center justify-between xl:hidden">
          {/* Left side - Back button and title */}
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/flows">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only sm:ml-2">
                  {t('flows.back')}
                </span>
              </Link>
            </Button>
            <div className="min-w-0 flex-1">
              {isEditingName ? (
                <div className="relative">
                  <Input
                    ref={inputRef}
                    value={editedName}
                    onChange={e => setEditedName(e.target.value)}
                    onBlur={handleSaveName}
                    onKeyDown={handleKeyDown}
                    maxLength={MAX_FLOW_NAME_LENGTH}
                    className="h-8 text-sm font-semibold sm:text-lg"
                  />
                  <span className="absolute -bottom-4 right-0 text-xs text-muted-foreground">
                    {editedName.length}/{MAX_FLOW_NAME_LENGTH}
                  </span>
                </div>
              ) : (
                <div
                  className="group flex cursor-pointer items-center gap-2"
                  onClick={handleStartEdit}
                >
                  <h1 className="truncate text-sm font-semibold text-foreground sm:text-lg">
                    {flowName}
                  </h1>
                  <Pencil className="h-3 w-3 flex-shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 sm:h-4 sm:w-4" />
                </div>
              )}
            </div>
          </div>

          {/* Right side - Mobile menu */}
          <div className="flex items-center gap-1">
            {/* Primary actions always visible */}
            <Button size="sm" onClick={onCreateNode}>
              <Plus className="h-4 w-4" />
              <span className="sr-only">{t('flows.addNode')}</span>
            </Button>

            {selectedNodeId && (
              <Button variant="destructive" size="sm" onClick={onDeleteNode}>
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">{t('flows.deleteNode')}</span>
              </Button>
            )}

            {/* Node Navigation - Mobile */}
            {steps.length > 0 && (
              <NodeSelector
                steps={steps}
                onJumpToNode={onJumpToNode}
                variant="mobile"
                className="px-2"
              />
            )}

            {/* Mobile menu dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">{t('flows.moreOptions')}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={onZoomIn}>
                  <ZoomIn className="mr-2 h-4 w-4" />
                  {t('flows.zoomIn')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onZoomOut}>
                  <ZoomOut className="mr-2 h-4 w-4" />
                  {t('flows.zoomOut')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onResetView}>
                  <Move className="mr-2 h-4 w-4" />
                  {t('flows.resetView')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onFitToView}>
                  <Maximize2 className="mr-2 h-4 w-4" />
                  {t('flows.fitToView')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={onOrganizeFlow}
                  disabled={isOrganizing}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  {isOrganizing
                    ? t('flows.organizing')
                    : t('flows.organizeFlow')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onToggleMinimap(!showMinimap)}>
                  <Eye className="mr-2 h-4 w-4" />
                  {showMinimap ? t('flows.minimapOn') : t('flows.minimapOff')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onToggleRealtime(!enableRealtime)}
                >
                  <Users className="mr-2 h-4 w-4" />
                  {enableRealtime
                    ? t('flows.liveMode')
                    : t('flows.offlineMode')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden xl:block">
          {/* Two Row Grid Layout */}
          <div className="grid w-full grid-cols-[auto_1fr_auto] gap-x-4 gap-y-1">
            {/* Left Column - Back button (row 1) and Flow name (row 2) */}
            <div className="col-start-1 row-start-1 flex items-center">
              <Button variant="outline" size="sm" asChild className="h-8">
                <Link to="/flows">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t('flows.backToFlows')}
                </Link>
              </Button>
            </div>
            <div className="col-start-1 row-start-2 flex items-center">
              {isEditingName ? (
                <div className="relative">
                  <Input
                    ref={inputRef}
                    value={editedName}
                    onChange={e => setEditedName(e.target.value)}
                    onBlur={handleSaveName}
                    onKeyDown={handleKeyDown}
                    maxLength={MAX_FLOW_NAME_LENGTH}
                    className="h-9 text-lg font-semibold"
                    style={{ minWidth: '200px', maxWidth: '400px' }}
                  />
                  <span className="absolute -bottom-5 right-0 text-xs text-muted-foreground">
                    {editedName.length}/{MAX_FLOW_NAME_LENGTH}
                  </span>
                </div>
              ) : (
                <div
                  className="group flex cursor-pointer items-center gap-2"
                  onClick={handleStartEdit}
                  title={flowName.length > 30 ? flowName : undefined}
                >
                  <h1 className="max-w-[280px] truncate text-lg font-semibold text-foreground">
                    {flowName}
                  </h1>
                  <Pencil className="h-4 w-4 flex-shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              )}
            </div>

            {/* Middle Column - View and Navigation Controls (spans both rows) */}
            <div className="col-start-2 row-span-2 flex items-center justify-start gap-2">
              <div className="mr-1 h-16 w-px bg-border" />
              {/* Zoom Controls - Stacked */}
              <div className="flex flex-col gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onZoomIn}
                  className="h-8"
                >
                  <ZoomIn className="mr-1.5 h-3.5 w-3.5" />
                  <span className="text-xs">{t('flows.zoomIn')}</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onZoomOut}
                  className="h-8"
                >
                  <ZoomOut className="mr-1.5 h-3.5 w-3.5" />
                  <span className="text-xs">{t('flows.zoomOut')}</span>
                </Button>
              </div>

              <div className="flex flex-col gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onResetView}
                  className="h-8"
                >
                  <Move className="mr-1.5 h-3.5 w-3.5" />
                  <span className="text-xs">{t('flows.resetView')}</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onFitToView}
                  className="h-8"
                >
                  <Maximize2 className="mr-1.5 h-3.5 w-3.5" />
                  <span className="text-xs">{t('flows.fitToView')}</span>
                </Button>
              </div>

              <div className="mx-1 h-16 w-px bg-border" />

              {/* Node Navigation */}
              <NodeSelector
                steps={steps}
                onJumpToNode={onJumpToNode}
                variant="desktop"
              />
            </div>

            {/* Right Column - Action Controls (spans both rows) */}
            <div className="col-start-3 row-span-2 flex items-center gap-2">
              {selectedNodeId && (
                <Button variant="destructive" onClick={onDeleteNode} size="sm">
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t('flows.deleteNode')}
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={onOrganizeFlow}
                disabled={isOrganizing}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {isOrganizing ? t('flows.organizing') : t('flows.organize')}
              </Button>

              <Button
                variant={showMinimap ? 'default' : 'outline'}
                size="sm"
                onClick={() => onToggleMinimap(!showMinimap)}
                title={
                  showMinimap ? t('flows.hideMinimap') : t('flows.showMinimap')
                }
              >
                <Eye className="mr-2 h-4 w-4" />
                {t('flows.minimap')}
              </Button>

              <Button
                variant={enableRealtime ? 'default' : 'outline'}
                size="sm"
                onClick={() => onToggleRealtime(!enableRealtime)}
                title={
                  enableRealtime
                    ? t('flows.realtimeEnabled')
                    : t('flows.enableRealtime')
                }
              >
                <Users className="mr-2 h-4 w-4" />
                {enableRealtime ? t('flows.live') : t('flows.offline')}
              </Button>

              <div className="mx-1 h-16 w-px bg-border" />

              {/* Add Node - Spans both rows */}
              <Button
                onClick={onCreateNode}
                className="flex h-16 min-w-[140px] flex-col items-center justify-center gap-1 px-6 py-3"
              >
                <Plus className="h-6 w-6" />
                <span className="text-base font-semibold">
                  {t('flows.addNode')}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
