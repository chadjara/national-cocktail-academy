import { z } from "zod";

/**
 * Zod compiles fast parsers with `new Function` when it can. Our Content
 * Security Policy forbids eval, so we tell Zod up front to use its
 * interpreter instead of probing (the probe itself is a CSP violation).
 * Imported first by every module that parses at load time.
 */
z.config({ jitless: true });
