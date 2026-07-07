import { createClient } from "@supabase/supabase-js";
import config from "../config/env";
import logger from "./logger";

let supabaseClient: ReturnType<typeof createClient> | undefined;

export const getSupabaseClient = () => {
  if (!supabaseClient && config.supabaseUrl && config.supabaseAnonKey) {
    logger.info("Initializing Supabase client");
    supabaseClient = createClient(config.supabaseUrl, config.supabaseAnonKey);
  }
  return supabaseClient;
};

export const getSupabaseServiceClient = () => {
  if (config.supabaseUrl && config.supabaseServiceKey) {
    logger.info("Initializing Supabase service client");
    return createClient(config.supabaseUrl, config.supabaseServiceKey);
  }
  logger.warn("Supabase service client not available");
  return undefined;
};

export default {
  getSupabaseClient,
  getSupabaseServiceClient,
};
