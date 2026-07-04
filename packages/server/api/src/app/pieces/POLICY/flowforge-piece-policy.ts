import { PieceMetadataModelSummary } from '@activepieces/pieces-framework';

import {
  FlowForgeDecisionReason,
  FlowForgePieceClassification,
  FlowForgePieceDecision,
} from './flowforge-piece-types';

export function classifyPiece(
  piece: PieceMetadataModelSummary,
): FlowForgePieceClassification {
  return {
    decision: FlowForgePieceDecision.REVIEW,
    reason: FlowForgeDecisionReason.UNKNOWN,
  };
}