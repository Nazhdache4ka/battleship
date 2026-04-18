const USER_AGENT_MAX_LENGTH = 255;

export function getUserAgent(userAgent: string) {
  return typeof userAgent === 'string'
    ? userAgent.length > USER_AGENT_MAX_LENGTH
      ? userAgent.slice(0, USER_AGENT_MAX_LENGTH)
      : userAgent
    : '';
}
