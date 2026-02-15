// Mock localtunnel globally to prevent initialization warnings
jest.mock('localtunnel', () => ({
  __esModule: true,
  default: jest.fn(),
}))

// Suppress localStorage file warning from Jest's environment teardown
const originalStderrWrite = process.stderr.write.bind(process.stderr)
process.stderr.write = (
  chunk: any,
  encoding?: any,
  callback?: any,
): boolean => {
  if (typeof chunk === 'string' && chunk.includes('--localstorage-file')) {
    return true
  }
  return originalStderrWrite(chunk, encoding, callback)
}
