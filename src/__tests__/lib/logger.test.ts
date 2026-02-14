import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('logger', () => {
  let consoleInfoSpy: any;
  let consoleWarnSpy: any;
  let consoleErrorSpy: any;
  let consoleDebugSpy: any;

  beforeEach(() => {
    // Spy on console methods
    consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    consoleDebugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore spies
    consoleInfoSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    consoleDebugSpy.mockRestore();

    // Clear module cache to reset logger state
    vi.resetModules();
  });

  it('should log info messages in development mode', async () => {
    // Set dev mode
    vi.stubEnv('DEV', true);

    const { logger } = await import('@/lib/logger');

    logger.info('Test info message', { data: 'value' });

    expect(consoleInfoSpy).toHaveBeenCalledWith('[INFO] Test info message', {
      data: 'value',
    });
  });

  it('should log warning messages in development mode', async () => {
    vi.stubEnv('DEV', true);

    const { logger } = await import('@/lib/logger');

    logger.warn('Test warning message');

    expect(consoleWarnSpy).toHaveBeenCalledWith('[WARN] Test warning message');
  });

  it('should log error messages in development mode', async () => {
    vi.stubEnv('DEV', true);

    const { logger } = await import('@/lib/logger');

    const error = new Error('Test error');
    logger.error('Error occurred', error);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[ERROR] Error occurred',
      error
    );
  });

  it('should log debug messages in development mode', async () => {
    vi.stubEnv('DEV', true);

    const { logger } = await import('@/lib/logger');

    logger.debug('Debug message', { debugData: true });

    expect(consoleDebugSpy).toHaveBeenCalledWith('[DEBUG] Debug message', {
      debugData: true,
    });
  });

  it('should not log in production mode', async () => {
    // Set production mode
    vi.stubEnv('DEV', false);

    const { logger } = await import('@/lib/logger');

    logger.info('Info message');
    logger.warn('Warning message');
    logger.error('Error message');
    logger.debug('Debug message');

    expect(consoleInfoSpy).not.toHaveBeenCalled();
    expect(consoleWarnSpy).not.toHaveBeenCalled();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(consoleDebugSpy).not.toHaveBeenCalled();
  });

  it('should handle multiple arguments', async () => {
    vi.stubEnv('DEV', true);

    const { logger } = await import('@/lib/logger');

    logger.info('Message', 'arg1', 'arg2', { key: 'value' });

    expect(consoleInfoSpy).toHaveBeenCalledWith(
      '[INFO] Message',
      'arg1',
      'arg2',
      { key: 'value' }
    );
  });
});
