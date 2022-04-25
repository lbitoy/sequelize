export type Escapable = undefined | null | boolean | number | string | Date;
export function escapeId(val: string, forbidQualified?: boolean): string;
export function escape(val: Escapable | Escapable[], timeZone?: string, dialect?: string, format?: string): string;
export function formatPositionalReplacements(sql: string, values: unknown[], timeZone?: string | null, dialect?: string): string;
export function formatNamedReplacements(sql: string, values: Record<string, unknown>, timeZone?: string | null, dialect?: string): string;
export function includesPositionalReplacements(sql: string): boolean;
