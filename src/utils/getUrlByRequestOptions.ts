import { Agent } from 'http'
import { RequestOptions } from 'https'
import { RequestSelf } from '../glossary'

const debug = require('debug')('utils getUrlByRequestOptions')

export const DEFAULT_PATH = '/'
const DEFAULT_PROTOCOL = 'http:'

/**
 * Creates a `URL` instance from a given `RequestOptions` object.
 */
export function getUrlByRequestOptions(
  options: RequestOptions & RequestSelf
): URL {
  const path = options.path || DEFAULT_PATH

  debug('creating URL from options:', options)

  // Inherit the protocol from the Agent, if present.
  if (options.agent instanceof Agent) {
    options.protocol = (options.agent as RequestOptions).protocol
  }

  if (!options.protocol) {
    debug('given no protocol, resolving...')

    // Assume HTTPS if cert is set.
    options.protocol = options.cert
      ? 'https:'
      : options.uri?.protocol || DEFAULT_PROTOCOL

    debug('resolved protocol to:', options.protocol)
  }

  const baseUrl = `${options.protocol}//${options.hostname || options.host}`
  debug('using base URL:', baseUrl)

  const url = options.uri ? new URL(options.uri.href) : new URL(path, baseUrl)

  if (!!options.port) {
    url.port = options.port.toString()
  }

  if (!!options.auth) {
    const [username, password] = options.auth.split(':')
    url.username = username
    url.password = password
  }

  debug('created URL:', url)

  return url
}
