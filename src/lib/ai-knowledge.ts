import { supabase } from "@/integrations/supabase/client";

export const AI_EMBEDDING_DIMENSIONS = 1536;

export type AIKnowledgeMatch = {
  chunk_id: string;
  document_id: string;
  title: string;
  source_type: string;
  source_key: string;
  canonical_url: string | null;
  content: string;
  similarity?: number;
  combined_score?: number;
};

export async function matchAIKnowledgeChunks(args: {
  queryEmbedding: number[];
  matchCount?: number;
  matchThreshold?: number;
  filterSourceType?: string | null;
}) {
  const { data, error } = await supabase.rpc("match_ai_knowledge_chunks", {
    query_embedding: args.queryEmbedding,
    match_count: args.matchCount ?? 10,
    match_threshold: args.matchThreshold ?? 0.2,
    filter_source_type: args.filterSourceType ?? null,
  });

  if (error) throw error;
  return (data ?? []) as AIKnowledgeMatch[];
}

export async function hybridSearchAIKnowledgeChunks(args: {
  queryText: string;
  queryEmbedding: number[];
  matchCount?: number;
  fullTextWeight?: number;
  semanticWeight?: number;
  rrfK?: number;
  filterSourceType?: string | null;
}) {
  const { data, error } = await supabase.rpc("hybrid_search_ai_knowledge_chunks", {
    query_text: args.queryText,
    query_embedding: args.queryEmbedding,
    match_count: args.matchCount ?? 10,
    full_text_weight: args.fullTextWeight ?? 1,
    semantic_weight: args.semanticWeight ?? 1,
    rrf_k: args.rrfK ?? 50,
    filter_source_type: args.filterSourceType ?? null,
  });

  if (error) throw error;
  return (data ?? []) as AIKnowledgeMatch[];
}
