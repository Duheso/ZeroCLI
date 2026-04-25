import assert from 'node:assert/strict'
import test from 'node:test'

import { extractGitHubRepoSlug } from './repoSlug.ts'

test('keeps owner/repo input as-is', () => {
  assert.equal(extractGitHubRepoSlug('Gitlawb/zero'), 'Gitlawb/zero')
})

test('extracts slug from https GitHub URLs', () => {
  assert.equal(
    extractGitHubRepoSlug('https://github.com/Duheso/ZeroCLI'),
    'Gitlawb/zero',
  )
  assert.equal(
    extractGitHubRepoSlug('https://www.github.com/Duheso/ZeroCLI.git'),
    'Gitlawb/zero',
  )
})

test('extracts slug from ssh GitHub URLs', () => {
  assert.equal(
    extractGitHubRepoSlug('git@github.com:Gitlawb/zero.git'),
    'Gitlawb/zero',
  )
  assert.equal(
    extractGitHubRepoSlug('ssh://git@github.com/Duheso/ZeroCLI'),
    'Gitlawb/zero',
  )
})

test('rejects malformed or non-GitHub URLs', () => {
  assert.equal(extractGitHubRepoSlug('https://gitlab.com/Gitlawb/zero'), null)
  assert.equal(extractGitHubRepoSlug('https://github.com/Gitlawb'), null)
  assert.equal(extractGitHubRepoSlug('not actually github.com/Duheso/ZeroCLI'), null)
  assert.equal(
    extractGitHubRepoSlug('https://evil.example/?next=github.com/Duheso/ZeroCLI'),
    null,
  )
  assert.equal(
    extractGitHubRepoSlug('https://github.com.evil.example/Gitlawb/zero'),
    null,
  )
  assert.equal(
    extractGitHubRepoSlug('https://example.com/github.com/Duheso/ZeroCLI'),
    null,
  )
})
