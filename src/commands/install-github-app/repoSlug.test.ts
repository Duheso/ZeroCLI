import assert from 'node:assert/strict'
import test from 'node:test'

import { extractGitHubRepoSlug } from './repoSlug.ts'

test('keeps owner/repo input as-is', () => {
  assert.equal(extractGitHubRepoSlug('Duheso/ZeroCLI'), 'Duheso/ZeroCLI')
})

test('extracts slug from https GitHub URLs', () => {
  assert.equal(
    extractGitHubRepoSlug('https://github.com/Duheso/ZeroCLI'),
    'Duheso/ZeroCLI',
  )
  assert.equal(
    extractGitHubRepoSlug('https://www.github.com/Duheso/ZeroCLI.git'),
    'Duheso/ZeroCLI',
  )
})

test('extracts slug from ssh GitHub URLs', () => {
  assert.equal(
    extractGitHubRepoSlug('git@github.com:Duheso/ZeroCLI.git'),
    'Duheso/ZeroCLI',
  )
  assert.equal(
    extractGitHubRepoSlug('ssh://git@github.com/Duheso/ZeroCLI'),
    'Duheso/ZeroCLI',
  )
})

test('rejects malformed or non-GitHub URLs', () => {
  assert.equal(extractGitHubRepoSlug('https://gitlab.com/Duheso/ZeroCLI'), null)
  assert.equal(extractGitHubRepoSlug('https://github.com/Duheso'), null)
  assert.equal(extractGitHubRepoSlug('not actually github.com/Duheso/ZeroCLI'), null)
  assert.equal(
    extractGitHubRepoSlug('https://evil.example/?next=github.com/Duheso/ZeroCLI'),
    null,
  )
  assert.equal(
    extractGitHubRepoSlug('https://github.com.evil.example/Duheso/ZeroCLI'),
    null,
  )
  assert.equal(
    extractGitHubRepoSlug('https://example.com/github.com/Duheso/ZeroCLI'),
    null,
  )
})
