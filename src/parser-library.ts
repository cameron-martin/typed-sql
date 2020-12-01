/**
 * A specialisation of ParseSuccess where X has an added constraint of being a string.
 * Useful when using in a condition type as `Y extends ParseSuccessString<infer X, infer R> ? ... : ...`
 * since then X is usable in template literal types.
 */
export type ParseSuccessString<X extends string, R extends string> = ParseSuccess<X, R>;

/**
 * Represents a successful parse, yielding the value `X` with remaining input `R`.
 */
export type ParseSuccess<X, R extends string> = { success: true, result: X, rest: R };

/**
 * Represents a failed parse.
 */
export type ParseFail = { success: false };

/**
 * Consumes a literal value, yielding that value.
 */
export type ParseLiteral<Literal extends string, S extends string> = S extends `${Literal}${infer R}` ? ParseSuccess<Literal, R> : ParseFail;

/**
 * Consumes a single character, given a union of chars.
 */
export type ParseChar<Chars extends string, S extends string> =
  S extends `${infer Char}${infer R}` ?
  (Char extends Chars ? ParseSuccess<Char, R> : ParseFail) :
  ParseFail;

/**
 * Consumes a single character of whitespace, yielding that character.
 * TODO: Add more whitespace chars
 */
export type ParseSingleWhitespace<S extends string> = ParseChar<' ' | '\t', S>;

/**
 * Consumes 0 or more characters of whitespace as possible, yielding the consumed whitespace.
 */
export type ParseManyWhitespace<S extends string> =
  ParseSingleWhitespace<S> extends ParseSuccessString<infer X1, infer R0> ?
  (ParseManyWhitespace<R0> extends ParseSuccessString<infer X2, infer R1> ? ParseSuccess<`${X1}${X2}`, R1> : ParseSuccess<X1, R0> ) : ParseSuccess<'', S>;

/**
 * Consumes 1 or more characters of whitespace as possible, yielding the consumed whitespace.
 */
export type ParseMany1Whitespace<S extends string> =
  ParseSingleWhitespace<S> extends ParseSuccessString<infer X1, infer R0> ?
  (ParseManyWhitespace<R0> extends ParseSuccessString<infer X2, infer R1> ? ParseSuccess<`${X1}${X2}`, R1> : ParseSuccess<X1, R0>) : ParseFail;

/**
 * Parse a string literal in single or double quotes, with backslash-escaping
 */
export type ParseStringLiteral<S extends string> =
  ParseStringLiteralWithQuote<"'", S> extends ParseSuccess<infer X, infer R> ? ParseSuccess<X, R> :
  ParseStringLiteralWithQuote<'"', S> extends ParseSuccess<infer X, infer R> ? ParseSuccess<X, R> :
  ParseFail;

type ParseStringLiteralWithQuote<Quote extends string, S extends string> =
  S extends `${Quote}${infer R0}`
  ? ParseInsideStringLiteralWithQuote<Quote, R0>
  : ParseFail;

type ParseInsideStringLiteralWithQuote<Quote extends string, S extends string> =
  S extends `${Quote}${infer R0}` ? ParseSuccess<'', R0> :
  S extends `\\${infer X0}${infer R0}` ? (ParseInsideStringLiteralWithQuote<Quote, R0> extends ParseSuccessString<infer X1, infer R1> ? ParseSuccess<`${X0}${X1}`, R1> : ParseFail) :
  S extends `${infer X0}${infer R0}` ? (ParseInsideStringLiteralWithQuote<Quote, R0> extends ParseSuccessString<infer X1, infer R1> ? ParseSuccess<`${X0}${X1}`, R1> : ParseFail) :
  ParseFail