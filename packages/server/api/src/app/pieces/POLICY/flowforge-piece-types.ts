export enum FlowForgePieceDecision {
  KEEP = 'KEEP',
  REMOVE = 'REMOVE',
  REVIEW = 'REVIEW',
}

export enum FlowForgeDecisionReason {
  USER_API_KEY = 'USER_API_KEY',
  USER_OAUTH = 'USER_OAUTH',
  NO_AUTH = 'NO_AUTH',
  USER_INFRASTRUCTURE = 'USER_INFRASTRUCTURE',

  PLATFORM_ADMIN = 'PLATFORM_ADMIN',
  PLATFORM_AI = 'PLATFORM_AI',
  HOSTED_MODEL = 'HOSTED_MODEL',
  ENTERPRISE_INFRASTRUCTURE = 'ENTERPRISE_INFRASTRUCTURE',
  BACKGROUND_COST = 'BACKGROUND_COST',
  INTERNAL_PLATFORM = 'INTERNAL_PLATFORM',

  UNKNOWN = 'UNKNOWN',
}

export interface FlowForgePieceClassification {
  decision: FlowForgePieceDecision;
  reason: FlowForgeDecisionReason;
  warning?: string;
}