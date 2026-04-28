import {
  benchmarkModel,
  benchmarkMultipleModels,
  formatBenchmarkResults,
  isBenchmarkSupported,
} from '../utils/model/benchmark.js'
import { getCachedOllamaModelOptions } from '../utils/model/ollamaModels.js'

async function runBenchmark(
  model?: string,
  context?: { stdout?: { write: (s: string) => void } },
): Promise<void> {
  if (!isBenchmarkSupported()) {
    context?.stdout?.write(
      'Benchmark not supported for this provider.\n' +
        'Supported: OpenAI-compatible endpoints (Ollama, NVIDIA NIM, MiniMax)\n',
    )
    return
  }

  let modelsToBenchmark: string[]

  if (model) {
    modelsToBenchmark = [model]
  } else {
    modelsToBenchmark = getCachedOllamaModelOptions().slice(0, 3).map((m) => String(m.value))
  }

  context?.stdout?.write(`Benchmarking ${modelsToBenchmark.length} model(s)...\n`)

  const results = await benchmarkMultipleModels(
    modelsToBenchmark,
    (completed: number, total: number, result: { model: string; success: boolean; tokensPerSecond: number }) => {
      context?.stdout?.write(
        `[${completed}/${total}] ${result.model}: ` +
          `${result.success ? result.tokensPerSecond.toFixed(1) + ' tps' : 'FAILED'}\n`,
      )
    },
  )

  context?.stdout?.write('\n' + formatBenchmarkResults(results) + '\n')
}

export const benchmark = {
  name: 'benchmark',
  type: 'local' as const,
  supportsNonInteractive: true,
  description: 'Run model benchmarks',
  load: async () => ({
    call: async (args: string) => {
      const parsed = (args || '').trim()
      await runBenchmark(parsed || undefined)
    },
  }),
}